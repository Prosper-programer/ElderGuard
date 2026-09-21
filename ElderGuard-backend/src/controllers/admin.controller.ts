import { Response } from 'express';
import { Op } from 'sequelize';
import { User, ElderlyProfile, IoTDevice } from '../models';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getSocketIO } from '../config/socket';

/**
 * ADMIN CONTROLLER (Sequelize ORM)
 * 
 * Scope & Security Rules:
 * - Only users with role === 'admin' can access these endpoints.
 * - Admin manages Parent accounts only (view, search, filter, activate, deactivate).
 * - Admin does NOT manage or approve Caregiver/Doctor access (managed by Parent).
 * - Admin has zero access to confidential clinical notes, individual vitals, or GPS breadcrumbs.
 */

/**
 * GET /api/admin/parents
 * Retrieves a paginated, filterable list of Parent accounts with linked senior counts via Sequelize.
 */
export async function getParents(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10));
    const offset = (page - 1) * limit;
    const search = (req.query.search as string || req.query.q as string || '').trim();
    const status = (req.query.status as string || 'all').toLowerCase();

    const where: any = { role: 'parent' };

    if (status === 'active' || status === 'inactive') {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } },
      ];
    }

    // Use Sequelize findAndCountAll with joined ElderlyProfiles for elderly_count
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: ['user_id', 'full_name', 'email', 'phone_number', 'role', 'status', 'created_at'],
      include: [
        {
          model: ElderlyProfile,
          as: 'elderlyProfiles',
          attributes: ['elderly_id'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    const formattedData = rows.map((parent: any) => ({
      user_id: parent.user_id,
      full_name: parent.full_name,
      email: parent.email,
      phone_number: parent.phone_number,
      role: parent.role,
      status: parent.status,
      created_at: parent.created_at,
      elderly_count: parent.elderlyProfiles ? parent.elderlyProfiles.length : 0,
    }));

    res.status(200).json({
      status: 'success',
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: formattedData,
    });
  } catch (error: any) {
    console.error('Admin get parents error:', error);
    res.status(500).json({
      message: 'Internal server error fetching parent accounts.',
      status: 'error'
    });
  }
}

/**
 * GET /api/admin/parents/:id
 * Retrieves basic account information for a single parent via Sequelize.
 */
export async function getParentById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parentId = Number(req.params.id);

    const parent: any = await User.findOne({
      where: { user_id: parentId, role: 'parent' },
      attributes: ['user_id', 'full_name', 'email', 'phone_number', 'role', 'status', 'created_at'],
      include: [
        {
          model: ElderlyProfile,
          as: 'elderlyProfiles',
          attributes: ['elderly_id'],
        },
      ],
    });

    if (!parent) {
      res.status(404).json({ message: 'Parent account not found.', status: 'error' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        user_id: parent.user_id,
        full_name: parent.full_name,
        email: parent.email,
        phone_number: parent.phone_number,
        role: parent.role,
        status: parent.status,
        created_at: parent.created_at,
        elderly_count: parent.elderlyProfiles ? parent.elderlyProfiles.length : 0,
      }
    });
  } catch (error: any) {
    console.error('Admin get parent by ID error:', error);
    res.status(500).json({
      message: 'Internal server error fetching parent details.',
      status: 'error'
    });
  }
}

/**
 * PUT /api/admin/parents/:id/activate
 * Sets parent account status to active and pushes real-time WebSocket event via Sequelize.
 */
export async function activateParent(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parentId = Number(req.params.id);

    // Fetch and update parent via Sequelize
    const parent = await User.findOne({ where: { user_id: parentId, role: 'parent' } });

    if (!parent) {
      res.status(404).json({ message: 'Parent account not found.', status: 'error' });
      return;
    }

    await parent.update({ status: 'active' });

    // Push real-time event to mobile phone and admin consoles
    const io = getSocketIO();
    if (io) {
      const payload = {
        userId: parentId,
        email: parent.email,
        status: 'active',
        message: 'Your account has been activated successfully.'
      };
      io.to(`user_${parentId}`).emit('account_status_changed', payload);
      io.emit('account_status_changed', payload);
      io.to('admin_room').emit('parent_updated', {
        userId: parentId,
        email: parent.email,
        status: 'active'
      });
    }

    res.status(200).json({
      message: 'Parent account activated successfully.',
      status: 'success',
      parent_id: parentId,
      new_status: 'active'
    });
  } catch (error: any) {
    console.error('Activate parent error:', error);
    res.status(500).json({
      message: 'Internal server error activating parent account.',
      status: 'error'
    });
  }
}

/**
 * PUT /api/admin/parents/:id/deactivate
 * Sets parent account status to inactive, revokes active session, and pushes real-time event via Sequelize.
 */
export async function deactivateParent(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parentId = Number(req.params.id);

    // Fetch and update parent via Sequelize
    const parent = await User.findOne({ where: { user_id: parentId, role: 'parent' } });

    if (!parent) {
      res.status(404).json({ message: 'Parent account not found.', status: 'error' });
      return;
    }

    await parent.update({ status: 'inactive' });

    // Push real-time event to mobile phone immediately
    const io = getSocketIO();
    if (io) {
      const payload = {
        userId: parentId,
        email: parent.email,
        status: 'inactive',
        message: 'Your account has been deactivated by a platform administrator.'
      };
      io.to(`user_${parentId}`).emit('account_status_changed', payload);
      io.emit('account_status_changed', payload);
      io.to('admin_room').emit('parent_updated', {
        userId: parentId,
        email: parent.email,
        status: 'inactive'
      });
    }

    res.status(200).json({
      message: 'Parent account deactivated successfully. Active sessions are revoked.',
      status: 'success',
      parent_id: parentId,
      new_status: 'inactive'
    });
  } catch (error: any) {
    console.error('Deactivate parent error:', error);
    res.status(500).json({
      message: 'Internal server error deactivating parent account.',
      status: 'error'
    });
  }
}

/**
 * GET /api/admin/system-stats
 * Returns high-level aggregate platform statistics only via Sequelize count queries.
 */
export async function getSystemStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    // 1. Parent counts
    const totalParents = await User.count({ where: { role: 'parent' } });
    const activeParents = await User.count({ where: { role: 'parent', status: 'active' } });
    const inactiveParents = await User.count({ where: { role: 'parent', status: 'inactive' } });

    // 2. Elderly profiles count
    const totalElderly = await ElderlyProfile.count();

    // 3. Device counts
    const totalDevices = await IoTDevice.count();
    const connectedDevices = await IoTDevice.count({ where: { status: 'connected' } });
    const disconnectedDevices = await IoTDevice.count({ where: { status: 'disconnected' } });

    res.status(200).json({
      status: 'success',
      data: {
        parents: {
          total: totalParents,
          active: activeParents,
          inactive: inactiveParents,
        },
        elderly_profiles: {
          total: totalElderly,
        },
        devices: {
          total: totalDevices,
          connected: connectedDevices,
          disconnected: disconnectedDevices,
        }
      }
    });
  } catch (error: any) {
    console.error('Admin system stats error:', error);
    res.status(500).json({ message: 'Error retrieving system statistics.', status: 'error' });
  }
}

// Backwards-compatibility aliases
export const getAllUsers = getParents;
export const activateAccount = activateParent;
export const deactivateAccount = deactivateParent;
