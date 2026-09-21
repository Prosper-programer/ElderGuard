import { Response } from 'express';
import bcrypt from 'bcrypt';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { User } from '../models';

export async function updateUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.', status: 'error' });
      return;
    }

    const { fullName, phoneNumber } = req.body;

    if (!fullName || !phoneNumber) {
      res.status(400).json({
        message: 'fullName and phoneNumber are required to update profile.',
        status: 'error'
      });
      return;
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found.', status: 'error' });
      return;
    }

    await user.update({
      full_name: fullName.trim(),
      phone_number: phoneNumber.trim()
    });

    res.status(200).json({
      message: 'User profile updated successfully.',
      status: 'success',
      data: {
        user_id: req.user.userId,
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim()
      }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Internal server error updating profile.',
      status: 'error'
    });
  }
}

/**
 * GET /api/users/caregivers
 * Returns a list of all active caregivers.
 * Useful for Parents when assigning a caregiver to an elderly profile.
 */
export async function getCaregivers(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const rows = await User.findAll({
      where: { role: 'caregiver', status: 'active' },
      attributes: ['user_id', 'full_name', 'email', 'phone_number', 'status']
    });

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  } catch (error: any) {
    console.error('Fetch caregivers error:', error);
    res.status(500).json({
      message: 'Internal server error fetching caregivers.',
      status: 'error'
    });
  }
}

/**
 * POST /api/users/caregivers
 * Allows a Parent to provision a new Caregiver account.
 */
export async function createCaregiver(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
      res.status(400).json({
        message: 'fullName, email, phoneNumber, and password are required.',
        status: 'error'
      });
      return;
    }

    const existing = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    if (existing) {
      res.status(400).json({
        message: 'A user with this email address already exists.',
        status: 'error'
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCaregiver = await User.create({
      full_name: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone_number: phoneNumber.trim(),
      password: hashedPassword,
      role: 'caregiver',
      status: 'active'
    });

    res.status(201).json({
      message: 'Caregiver account created successfully.',
      status: 'success',
      data: {
        user_id: newCaregiver.user_id,
        full_name: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone_number: phoneNumber.trim(),
        role: 'caregiver',
        status: 'active'
      }
    });
  } catch (error: any) {
    console.error('Create caregiver error:', error);
    res.status(500).json({
      message: 'Internal server error creating caregiver account.',
      status: 'error'
    });
  }
}

/**
 * GET /api/users/doctors
 * Returns a list of all active doctors.
 * Useful for Parents when assigning a doctor to an elderly profile.
 */
export async function getDoctors(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const rows = await User.findAll({
      where: { role: 'doctor', status: 'active' },
      attributes: ['user_id', 'full_name', 'email', 'phone_number', 'status']
    });

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  } catch (error: any) {
    console.error('Fetch doctors error:', error);
    res.status(500).json({
      message: 'Internal server error fetching doctors.',
      status: 'error'
    });
  }
}

/**
 * POST /api/users/doctors
 * Allows a Parent to provision a new Doctor account.
 */
export async function createDoctor(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
      res.status(400).json({
        message: 'fullName, email, phoneNumber, and password are required.',
        status: 'error'
      });
      return;
    }

    const existing = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    if (existing) {
      res.status(400).json({
        message: 'A user with this email address already exists.',
        status: 'error'
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = await User.create({
      full_name: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone_number: phoneNumber.trim(),
      password: hashedPassword,
      role: 'doctor',
      status: 'active'
    });

    res.status(201).json({
      message: 'Doctor account created successfully.',
      status: 'success',
      data: {
        user_id: newDoctor.user_id,
        full_name: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone_number: phoneNumber.trim(),
        role: 'doctor',
        status: 'active'
      }
    });
  } catch (error: any) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      message: 'Internal server error creating doctor account.',
      status: 'error'
    });
  }
}

/**
 * PUT /api/users/caregivers/:id
 * Allows a Parent to manage and update the profile of an assigned Caregiver.
 */
export async function updateCaregiver(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const caregiverId = Number(req.params.id);
    const { fullName, phoneNumber, email, status } = req.body;

    const caregiver = await User.findOne({
      where: { user_id: caregiverId, role: 'caregiver' }
    });

    if (!caregiver) {
      res.status(404).json({
        message: 'Caregiver not found.',
        status: 'error'
      });
      return;
    }

    const updates: any = {};
    if (fullName) updates.full_name = fullName.trim();
    if (phoneNumber) updates.phone_number = phoneNumber.trim();
    if (email) updates.email = email.toLowerCase().trim();
    if (status && ['active', 'inactive'].includes(status)) updates.status = status;

    await caregiver.update(updates);

    res.status(200).json({
      message: 'Caregiver profile updated successfully.',
      status: 'success',
      data: {
        user_id: caregiver.user_id,
        full_name: caregiver.full_name,
        email: caregiver.email,
        phone_number: caregiver.phone_number,
        role: caregiver.role,
        status: caregiver.status
      }
    });
  } catch (error: any) {
    console.error('Update caregiver error:', error);
    res.status(500).json({
      message: 'Internal server error updating caregiver.',
      status: 'error'
    });
  }
}

/**
 * PUT /api/users/doctors/:id
 * Allows a Parent to manage and update the profile of an assigned Doctor.
 */
export async function updateDoctor(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const doctorId = Number(req.params.id);
    const { fullName, phoneNumber, email, status } = req.body;

    const doctor = await User.findOne({
      where: { user_id: doctorId, role: 'doctor' }
    });

    if (!doctor) {
      res.status(404).json({
        message: 'Doctor not found.',
        status: 'error'
      });
      return;
    }

    const updates: any = {};
    if (fullName) updates.full_name = fullName.trim();
    if (phoneNumber) updates.phone_number = phoneNumber.trim();
    if (email) updates.email = email.toLowerCase().trim();
    if (status && ['active', 'inactive'].includes(status)) updates.status = status;

    await doctor.update(updates);

    res.status(200).json({
      message: 'Doctor profile updated successfully.',
      status: 'success',
      data: {
        user_id: doctor.user_id,
        full_name: doctor.full_name,
        email: doctor.email,
        phone_number: doctor.phone_number,
        role: doctor.role,
        status: doctor.status
      }
    });
  } catch (error: any) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      message: 'Internal server error updating doctor.',
      status: 'error'
    });
  }
}

/**
 * DELETE /api/users/:id
 * Deactivates or removes a caregiver or doctor user account.
 */
export async function deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = Number(req.params.id);

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found.', status: 'error' });
      return;
    }

    await user.destroy();

    res.status(200).json({
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} account removed successfully.`,
      status: 'success'
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({
      message: 'Internal server error removing user.',
      status: 'error'
    });
  }
}

