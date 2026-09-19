import { Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';


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

    // Update in users table
    await pool.query(
      'UPDATE users SET full_name = ?, phone_number = ? WHERE user_id = ?',
      [fullName.trim(), phoneNumber.trim(), req.user.userId]
    );

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
    const [rows]: any = await pool.query(
      'SELECT user_id, full_name, email, phone_number, status FROM users WHERE role = "caregiver" AND status = "active"'
    );

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

    // Check if email already exists
    const [existing]: any = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (existing.length > 0) {
      res.status(400).json({
        message: 'A user with this email address already exists.',
        status: 'error'
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await pool.query(
      `INSERT INTO users (full_name, email, phone_number, password, role, status)
       VALUES (?, ?, ?, ?, 'caregiver', 'active')`,
      [fullName.trim(), email.toLowerCase().trim(), phoneNumber.trim(), hashedPassword]
    );

    const newCaregiverId = result.insertId;

    res.status(201).json({
      message: 'Caregiver account created successfully.',
      status: 'success',
      data: {
        user_id: newCaregiverId,
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
    const [rows]: any = await pool.query(
      'SELECT user_id, full_name, email, phone_number, status FROM users WHERE role = "doctor" AND status = "active"'
    );

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

    // Check if email already exists
    const [existing]: any = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (existing.length > 0) {
      res.status(400).json({
        message: 'A user with this email address already exists.',
        status: 'error'
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await pool.query(
      `INSERT INTO users (full_name, email, phone_number, password, role, status)
       VALUES (?, ?, ?, ?, 'doctor', 'active')`,
      [fullName.trim(), email.toLowerCase().trim(), phoneNumber.trim(), hashedPassword]
    );

    const newDoctorId = result.insertId;

    res.status(201).json({
      message: 'Doctor account created successfully.',
      status: 'success',
      data: {
        user_id: newDoctorId,
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
