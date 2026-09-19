import { Response } from 'express';
import pool from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * ELDERLY PERSON PROFILE CONTROLLER
 * 
 * Maps to UML: ElderlyPersonProfile
 * Methods: updateProfile(), viewHealthStatus()
 * 
 * Permissions:
 * - Parent: create, update, delete, view
 * - Caregiver: view assigned elderly
 * - Admin: restricted from managing elderly profiles
 */

/**
 * POST /api/elderly
 * Only Parent can create an elderly profile.
 */
export async function createElderlyProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parentId = req.user?.userId;
    const {
      fullName,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      medicalInformation,
      caregiverId,
      doctorId,
      doctorName,
      doctorPhone,
      doctorSpecialty,
      doctorHospital,
      doctorEmail,
    } = req.body;

    if (!fullName || !dateOfBirth || !gender || !address || !emergencyContact) {
      res.status(400).json({
        message: 'fullName, dateOfBirth, gender, address, and emergencyContact are required.',
        status: 'error'
      });
      return;
    }

    // Insert into MySQL elderly_profiles table
    const [result]: any = await pool.query(
      `INSERT INTO elderly_profiles 
       (parent_id, caregiver_id, doctor_id, full_name, date_of_birth, gender, address, emergency_contact, medical_information,
        doctor_name, doctor_phone, doctor_specialty, doctor_hospital, doctor_email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parentId,
        caregiverId || null,
        doctorId || null,
        fullName.trim(),
        dateOfBirth,
        gender.trim(),
        address.trim(),
        emergencyContact.trim(),
        medicalInformation ? medicalInformation.trim() : null,
        doctorName ? doctorName.trim() : null,
        doctorPhone ? doctorPhone.trim() : null,
        doctorSpecialty ? doctorSpecialty.trim() : null,
        doctorHospital ? doctorHospital.trim() : null,
        doctorEmail ? doctorEmail.trim() : null,
      ]
    );

    const elderlyId = result.insertId;

    res.status(201).json({
      message: 'Elderly profile created successfully.',
      status: 'success',
      data: {
        elderly_id: elderlyId,
        parent_id: parentId,
        caregiver_id: caregiverId || null,
        doctor_id: doctorId || null,
        full_name: fullName.trim(),
        date_of_birth: dateOfBirth,
        gender: gender.trim(),
        address: address.trim(),
        emergency_contact: emergencyContact.trim(),
        medical_information: medicalInformation || null,
        doctor_name: doctorName || null,
        doctor_phone: doctorPhone || null,
        doctor_specialty: doctorSpecialty || null,
        doctor_hospital: doctorHospital || null,
        doctor_email: doctorEmail || null,
      }
    });
  } catch (error: any) {
    console.error('Create elderly profile error:', error);
    res.status(500).json({
      message: 'Internal server error creating elderly profile.',
      status: 'error'
    });
  }
}

/**
 * GET /api/elderly
 * Returns elderly profiles:
 * - If Parent: returns all profiles they manage
 * - If Caregiver: returns all profiles assigned to them
 * - If Doctor: returns all profiles assigned to them
 */
export async function getElderlyProfiles(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    let query = '';
    let params: any[] = [];

    if (userRole === 'parent') {
      query = `SELECT e.*, 
                      u.full_name AS caregiver_name, u.phone_number AS caregiver_phone,
                      d.full_name AS doc_user_name, d.phone_number AS doc_user_phone
               FROM elderly_profiles e
               LEFT JOIN users u ON e.caregiver_id = u.user_id
               LEFT JOIN users d ON e.doctor_id = d.user_id
               WHERE e.parent_id = ?
               ORDER BY e.created_at DESC`;
      params = [userId];
    } else if (userRole === 'caregiver') {
      query = `SELECT e.*, p.full_name AS parent_name, p.phone_number AS parent_phone
               FROM elderly_profiles e
               JOIN users p ON e.parent_id = p.user_id
               WHERE e.caregiver_id = ?
               ORDER BY e.created_at DESC`;
      params = [userId];
    } else if (userRole === 'doctor') {
      query = `SELECT e.*, 
                      p.full_name AS parent_name, p.phone_number AS parent_phone,
                      c.full_name AS caregiver_name, c.phone_number AS caregiver_phone
               FROM elderly_profiles e
               JOIN users p ON e.parent_id = p.user_id
               LEFT JOIN users c ON e.caregiver_id = c.user_id
               WHERE e.doctor_id = ?
               ORDER BY e.created_at DESC`;
      params = [userId];
    } else {
      res.status(403).json({
        message: 'Forbidden: Admins do not manage or view elderly profiles.',
        status: 'error'
      });
      return;
    }

    const [rows]: any = await pool.query(query, params);

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  } catch (error: any) {
    console.error('Get elderly profiles error:', error);
    res.status(500).json({
      message: 'Internal server error retrieving elderly profiles.',
      status: 'error'
    });
  }
}

/**
 * GET /api/elderly/:id
 * Retrieves a single elderly profile by ID.
 * Maps to UML: viewHealthStatus()
 */
export async function getElderlyProfileById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.id);
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const [rows]: any = await pool.query(
      `SELECT e.*, 
              p.full_name AS parent_name, p.phone_number AS parent_phone,
              c.full_name AS caregiver_name, c.phone_number AS caregiver_phone,
              d.full_name AS doc_user_name, d.phone_number AS doc_user_phone
       FROM elderly_profiles e
       JOIN users p ON e.parent_id = p.user_id
       LEFT JOIN users c ON e.caregiver_id = c.user_id
       LEFT JOIN users d ON e.doctor_id = d.user_id
       WHERE e.elderly_id = ?`,
      [elderlyId]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: 'Elderly profile not found.', status: 'error' });
      return;
    }

    const profile = rows[0];

    // Authorization check: User must be either the managing Parent, assigned Caregiver, or assigned Doctor
    if (userRole === 'parent' && profile.parent_id !== userId) {
      res.status(403).json({ message: 'Forbidden: You do not manage this profile.', status: 'error' });
      return;
    }
    if (userRole === 'caregiver' && profile.caregiver_id !== userId) {
      res.status(403).json({ message: 'Forbidden: You are not assigned to this elderly person.', status: 'error' });
      return;
    }
    if (userRole === 'doctor' && profile.doctor_id !== userId) {
      res.status(403).json({ message: 'Forbidden: You are not the assigned doctor for this elderly person.', status: 'error' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: profile
    });
  } catch (error: any) {
    console.error('Get elderly profile by id error:', error);
    res.status(500).json({
      message: 'Internal server error fetching profile.',
      status: 'error'
    });
  }
}

/**
 * PUT /api/elderly/:id
 * Allows only Parent to update profile.
 * Maps to UML: updateProfile()
 */
export async function updateElderlyProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.id);
    const parentId = req.user?.userId;
    const {
      fullName,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      medicalInformation,
      caregiverId,
      doctorId,
      doctorName,
      doctorPhone,
      doctorSpecialty,
      doctorHospital,
      doctorEmail,
    } = req.body;

    // Check ownership
    const [existing]: any = await pool.query(
      'SELECT * FROM elderly_profiles WHERE elderly_id = ? AND parent_id = ?',
      [elderlyId, parentId]
    );

    if (existing.length === 0) {
      res.status(404).json({
        message: 'Elderly profile not found or you do not have permission to update it.',
        status: 'error'
      });
      return;
    }

    const current = existing[0];

    await pool.query(
      `UPDATE elderly_profiles SET
        full_name = ?,
        date_of_birth = ?,
        gender = ?,
        address = ?,
        emergency_contact = ?,
        medical_information = ?,
        caregiver_id = ?,
        doctor_id = ?,
        doctor_name = ?,
        doctor_phone = ?,
        doctor_specialty = ?,
        doctor_hospital = ?,
        doctor_email = ?
       WHERE elderly_id = ? AND parent_id = ?`,
      [
        fullName !== undefined ? fullName.trim() : current.full_name,
        dateOfBirth !== undefined ? dateOfBirth : current.date_of_birth,
        gender !== undefined ? gender.trim() : current.gender,
        address !== undefined ? address.trim() : current.address,
        emergencyContact !== undefined ? emergencyContact.trim() : current.emergency_contact,
        medicalInformation !== undefined ? medicalInformation : current.medical_information,
        caregiverId !== undefined ? caregiverId : current.caregiver_id,
        doctorId !== undefined ? doctorId : current.doctor_id,
        doctorName !== undefined ? doctorName.trim() : current.doctor_name,
        doctorPhone !== undefined ? doctorPhone.trim() : current.doctor_phone,
        doctorSpecialty !== undefined ? doctorSpecialty.trim() : current.doctor_specialty,
        doctorHospital !== undefined ? doctorHospital.trim() : current.doctor_hospital,
        doctorEmail !== undefined ? doctorEmail.trim() : current.doctor_email,
        elderlyId,
        parentId
      ]
    );

    res.status(200).json({
      message: 'Elderly profile updated successfully.',
      status: 'success'
    });
  } catch (error: any) {
    console.error('Update elderly profile error:', error);
    res.status(500).json({
      message: 'Internal server error updating elderly profile.',
      status: 'error'
    });
  }
}

/**
 * DELETE /api/elderly/:id
 * Allows only Parent to delete an elderly profile.
 */
export async function deleteElderlyProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.id);
    const parentId = req.user?.userId;

    const [result]: any = await pool.query(
      'DELETE FROM elderly_profiles WHERE elderly_id = ? AND parent_id = ?',
      [elderlyId, parentId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        message: 'Elderly profile not found or you do not have permission to delete it.',
        status: 'error'
      });
      return;
    }

    res.status(200).json({
      message: 'Elderly profile deleted successfully.',
      status: 'success'
    });
  } catch (error: any) {
    console.error('Delete elderly profile error:', error);
    res.status(500).json({
      message: 'Internal server error deleting elderly profile.',
      status: 'error'
    });
  }
}
