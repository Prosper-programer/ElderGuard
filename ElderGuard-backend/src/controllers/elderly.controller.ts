import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ElderlyProfile, User } from '../models';

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

    const newProfile = await ElderlyProfile.create({
      parent_id: parentId!,
      caregiver_id: caregiverId || null,
      doctor_id: doctorId || null,
      full_name: fullName.trim(),
      date_of_birth: dateOfBirth,
      gender: gender.trim(),
      address: address.trim(),
      emergency_contact: emergencyContact.trim(),
      medical_information: medicalInformation ? medicalInformation.trim() : null,
      doctor_name: doctorName ? doctorName.trim() : null,
      doctor_phone: doctorPhone ? doctorPhone.trim() : null,
      doctor_specialty: doctorSpecialty ? doctorSpecialty.trim() : null,
      doctor_hospital: doctorHospital ? doctorHospital.trim() : null,
      doctor_email: doctorEmail ? doctorEmail.trim() : null,
    });

    res.status(201).json({
      message: 'Elderly profile created successfully.',
      status: 'success',
      data: newProfile.toJSON()
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

    let whereClause: any = {};

    if (userRole === 'parent') {
      whereClause = { parent_id: userId };
    } else if (userRole === 'caregiver') {
      whereClause = { caregiver_id: userId };
    } else if (userRole === 'doctor') {
      whereClause = { doctor_id: userId };
    } else {
      res.status(403).json({
        message: 'Forbidden: Admins do not manage or view elderly profiles.',
        status: 'error'
      });
      return;
    }

    const profiles = await ElderlyProfile.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'parent', attributes: ['full_name', 'phone_number'] },
        { model: User, as: 'caregiver', attributes: ['full_name', 'phone_number'] },
        { model: User, as: 'doctorUser', attributes: ['full_name', 'phone_number'] },
      ],
      order: [['created_at', 'DESC']]
    });

    const data = profiles.map(p => {
      const json: any = p.toJSON();
      return {
        ...json,
        caregiver_name: json.caregiver?.full_name || null,
        caregiver_phone: json.caregiver?.phone_number || null,
        parent_name: json.parent?.full_name || null,
        parent_phone: json.parent?.phone_number || null,
        doc_user_name: json.doctorUser?.full_name || null,
        doc_user_phone: json.doctorUser?.phone_number || null,
      };
    });

    res.status(200).json({
      status: 'success',
      count: data.length,
      data
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

    const profile = await ElderlyProfile.findByPk(elderlyId, {
      include: [
        { model: User, as: 'parent', attributes: ['full_name', 'phone_number'] },
        { model: User, as: 'caregiver', attributes: ['full_name', 'phone_number'] },
        { model: User, as: 'doctorUser', attributes: ['full_name', 'phone_number'] },
      ]
    });

    if (!profile) {
      res.status(404).json({ message: 'Elderly profile not found.', status: 'error' });
      return;
    }

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

    const json: any = profile.toJSON();
    const data = {
      ...json,
      parent_name: json.parent?.full_name || null,
      parent_phone: json.parent?.phone_number || null,
      caregiver_name: json.caregiver?.full_name || null,
      caregiver_phone: json.caregiver?.phone_number || null,
      doc_user_name: json.doctorUser?.full_name || null,
      doc_user_phone: json.doctorUser?.phone_number || null,
    };

    res.status(200).json({
      status: 'success',
      data
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

    const profile = await ElderlyProfile.findOne({
      where: { elderly_id: elderlyId, parent_id: parentId }
    });

    if (!profile) {
      res.status(404).json({
        message: 'Elderly profile not found or you do not have permission to update it.',
        status: 'error'
      });
      return;
    }

    await profile.update({
      full_name: fullName !== undefined ? fullName.trim() : profile.full_name,
      date_of_birth: dateOfBirth !== undefined ? dateOfBirth : profile.date_of_birth,
      gender: gender !== undefined ? gender.trim() : profile.gender,
      address: address !== undefined ? address.trim() : profile.address,
      emergency_contact: emergencyContact !== undefined ? emergencyContact.trim() : profile.emergency_contact,
      medical_information: medicalInformation !== undefined ? medicalInformation : profile.medical_information,
      caregiver_id: caregiverId !== undefined ? caregiverId : profile.caregiver_id,
      doctor_id: doctorId !== undefined ? doctorId : profile.doctor_id,
      doctor_name: doctorName !== undefined ? doctorName.trim() : profile.doctor_name,
      doctor_phone: doctorPhone !== undefined ? doctorPhone.trim() : profile.doctor_phone,
      doctor_specialty: doctorSpecialty !== undefined ? doctorSpecialty.trim() : profile.doctor_specialty,
      doctor_hospital: doctorHospital !== undefined ? doctorHospital.trim() : profile.doctor_hospital,
      doctor_email: doctorEmail !== undefined ? doctorEmail.trim() : profile.doctor_email,
    });

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

    const deleted = await ElderlyProfile.destroy({
      where: { elderly_id: elderlyId, parent_id: parentId }
    });

    if (deleted === 0) {
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
