import { Response } from 'express';
import pool from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * ADMIN CONTROLLER
 * 
 * Scope & Security Rules:
 * - Only users with role === 'admin' can access these endpoints.
 * - Admin manages Parent accounts only (view, search, filter, activate, deactivate).
 * - Admin does NOT manage or approve Caregiver/Doctor access (managed by Parent).
 * - Admin has zero access to confidential clinical notes, individual vitals, or GPS breadcrumbs.
 */

/**
 * GET /api/admin/parents
 * Retrieves a paginated, filterable list of Parent accounts with linked senior counts.
 */
export async function getParents(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10));
    const offset = (page - 1) * limit;
    const search = (req.query.search as string || req.query.q as string || '').trim();
    const status = (req.query.status as string || 'all').toLowerCase();

    let whereClauses = ["u.role = 'parent'"];
    let queryParams: any[] = [];

    if (search) {
      whereClauses.push('(u.full_name LIKE ? OR u.email LIKE ? OR u.phone_number LIKE ?)');
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (status === 'active' || status === 'inactive') {
      whereClauses.push('u.status = ?');
      queryParams.push(status);
    }

    const whereSql = whereClauses.join(' AND ');

    // 1. Total count for pagination
    const [countRows]: any = await pool.query(
      `SELECT COUNT(*) AS total FROM users u WHERE ${whereSql}`,
      queryParams
    );
    const total = Number(countRows[0]?.total || 0);

    // 2. Fetch paginated parent accounts with elderly count
    const [rows]: any = await pool.query(
      `SELECT 
        u.user_id, 
        u.full_name, 
        u.email, 
        u.phone_number, 
        u.role, 
        u.status, 
        u.created_at,
        COUNT(e.elderly_id) AS elderly_count
       FROM users u
       LEFT JOIN elderly_profiles e ON u.user_id = e.parent_id
       WHERE ${whereSql}
       GROUP BY u.user_id
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    res.status(200).json({
      status: 'success',
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: rows.map((r: any) => ({
        ...r,
        elderly_count: Number(r.elderly_count) || 0
      }))
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
 * Retrieves basic account information for a single parent.
 */
export async function getParentById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parentId = Number(req.params.id);

    const [rows]: any = await pool.query(
      `SELECT 
        u.user_id, 
        u.full_name, 
        u.email, 
        u.phone_number, 
        u.role, 
        u.status, 
        u.created_at,
        COUNT(e.elderly_id) AS elderly_count
       FROM users u
       LEFT JOIN elderly_profiles e ON u.user_id = e.parent_id
       WHERE u.user_id = ? AND u.role = 'parent'
       GROUP BY u.user_id`,
      [parentId]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: 'Parent account not found.', status: 'error' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        ...rows[0],
        elderly_count: Number(rows[0].elderly_count) || 0
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

import { getSocketIO } from '../config/socket';

/**
 * PUT /api/admin/parents/:id/activate
 * Sets parent account status to active and pushes real-time WebSocket event.
 */
export async function activateParent(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parentId = Number(req.params.id);

    const [result]: any = await pool.query(
      'UPDATE users SET status = "active" WHERE user_id = ? AND role = "parent"',
      [parentId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Parent account not found.', status: 'error' });
      return;
    }

    // Fetch email so client can match either by ID or email
    const [userRows]: any = await pool.query('SELECT email FROM users WHERE user_id = ?', [parentId]);
    const userEmail = userRows[0]?.email;

    // Push real-time event to mobile phone and admin consoles
    const io = getSocketIO();
    if (io) {
      const payload = {
        userId: parentId,
        email: userEmail,
        status: 'active',
        message: 'Your account has been activated successfully.'
      };
      io.to(`user_${parentId}`).emit('account_status_changed', payload);
      io.emit('account_status_changed', payload);
      io.to('admin_room').emit('parent_updated', {
        userId: parentId,
        email: userEmail,
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
 * Sets parent account status to inactive, revokes active session, and pushes real-time event.
 */
export async function deactivateParent(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parentId = Number(req.params.id);

    const [result]: any = await pool.query(
      'UPDATE users SET status = "inactive" WHERE user_id = ? AND role = "parent"',
      [parentId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Parent account not found.', status: 'error' });
      return;
    }

    // Fetch email so client can match either by ID or email
    const [userRows]: any = await pool.query('SELECT email FROM users WHERE user_id = ?', [parentId]);
    const userEmail = userRows[0]?.email;

    // Push real-time event to mobile phone immediately
    const io = getSocketIO();
    if (io) {
      const payload = {
        userId: parentId,
        email: userEmail,
        status: 'inactive',
        message: 'Your account has been deactivated by a platform administrator.'
      };
      io.to(`user_${parentId}`).emit('account_status_changed', payload);
      io.emit('account_status_changed', payload);
      io.to('admin_room').emit('parent_updated', {
        userId: parentId,
        email: userEmail,
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
 * Returns high-level aggregate platform statistics only (zero clinical or personal data).
 */
export async function getSystemStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    // 1. Parent counts
    const [parentStats]: any = await pool.query(`
      SELECT 
        COUNT(*) AS total_parents,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_parents,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive_parents
      FROM users
      WHERE role = 'parent'
    `);

    // 2. Elderly profiles count
    const [elderlyStats]: any = await pool.query(
      'SELECT COUNT(*) AS total_elderly FROM elderly_profiles'
    );

    // 3. Device counts
    const [deviceStats]: any = await pool.query(`
      SELECT 
        COUNT(*) AS total_devices,
        SUM(CASE WHEN status = 'connected' THEN 1 ELSE 0 END) AS connected_devices,
        SUM(CASE WHEN status = 'disconnected' THEN 1 ELSE 0 END) AS disconnected_devices
      FROM iot_devices
    `);

    const p = parentStats[0] || {};
    const d = deviceStats[0] || {};

    res.status(200).json({
      status: 'success',
      data: {
        parents: {
          total: Number(p.total_parents) || 0,
          active: Number(p.active_parents) || 0,
          inactive: Number(p.inactive_parents) || 0
        },
        elderly_profiles: {
          total: Number(elderlyStats[0]?.total_elderly) || 0
        },
        devices: {
          total: Number(d.total_devices) || 0,
          connected: Number(d.connected_devices) || 0,
          disconnected: Number(d.disconnected_devices) || 0
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
