import { Response } from 'express';
import { Prescription, ElderlyProfile, User, Notification } from '../models';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * PRESCRIPTION CONTROLLER (Sequelize ORM)
 * 
 * Manages clinical prescriptions written by Doctors,
 * delivers dual notifications to Parents and Caregivers,
 * and allows Caregivers to log medication administration ("Done").
 */

/**
 * POST /api/prescriptions
 * Doctor creates a new medication prescription for an elderly person.
 * Automatically notifies BOTH the Parent and Caregiver.
 */
export async function createPrescription(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const doctorId = req.user?.userId;
    const doctorUser = doctorId ? await User.findByPk(doctorId) : null;
    const doctorName = doctorUser?.full_name || 'Doctor';
    const {
      elderly_id,
      medication_name,
      dosage,
      frequency,
      scheduled_time,
      instructions,
    } = req.body;

    if (!elderly_id || !medication_name || !dosage || !frequency) {
      res.status(400).json({
        message: 'elderly_id, medication_name, dosage, and frequency are required.',
        status: 'error',
      });
      return;
    }

    // Verify elderly person exists
    const elderly = await ElderlyProfile.findByPk(Number(elderly_id));
    if (!elderly) {
      res.status(404).json({
        message: 'Elderly profile not found.',
        status: 'error',
      });
      return;
    }

    const newPrescription = await Prescription.create({
      elderly_id: Number(elderly_id),
      doctor_id: doctorId!,
      medication_name: medication_name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      scheduled_time: scheduled_time?.trim() || '08:00 AM',
      instructions: instructions?.trim() || null,
      status: 'active',
    });

    const seniorName = elderly.full_name;
    const medSummary = `${medication_name.trim()} (${dosage.trim()}, ${frequency.trim()})`;

    // 1. Dual Notification: Notify PARENT
    if (elderly.parent_id) {
      await Notification.create({
        user_id: elderly.parent_id,
        title: `New Prescription: ${medication_name.trim()}`,
        message: `Dr. ${doctorName} has prescribed ${medSummary} for ${seniorName}. Time: ${scheduled_time || '08:00 AM'}.`,
        status: 'unread',
      });
    }

    // 2. Dual Notification: Notify CAREGIVER (if assigned)
    if (elderly.caregiver_id) {
      await Notification.create({
        user_id: elderly.caregiver_id,
        title: `New Medication to Administer: ${medication_name.trim()}`,
        message: `Dr. ${doctorName} prescribed ${medSummary} for ${seniorName}. Scheduled: ${scheduled_time || '08:00 AM'}. Please update daily care schedule.`,
        status: 'unread',
      });
    }

    // Try socket.io real-time broadcast if available
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`elderly_${elderly_id}`).emit('new_prescription', {
          prescription: newPrescription,
          seniorName,
          doctorName,
        });
        if (elderly.parent_id) {
          io.to(`user_${elderly.parent_id}`).emit('notification', {
            title: `New Prescription: ${medication_name.trim()}`,
            message: `Dr. ${doctorName} has prescribed ${medSummary} for ${seniorName}.`,
          });
        }
        if (elderly.caregiver_id) {
          io.to(`user_${elderly.caregiver_id}`).emit('notification', {
            title: `New Medication to Administer: ${medication_name.trim()}`,
            message: `Dr. ${doctorName} prescribed ${medSummary} for ${seniorName}.`,
          });
        }
      }
    } catch {
      // Socket emission is non-blocking
    }

    res.status(201).json({
      message: 'Prescription created successfully. Parent and Caregiver have been notified.',
      status: 'success',
      data: newPrescription,
    });
  } catch (error: any) {
    console.error('Create prescription error:', error);
    res.status(500).json({
      message: 'Internal server error creating prescription.',
      status: 'error',
    });
  }
}

/**
 * GET /api/prescriptions/elderly/:elderlyId
 * Returns all prescriptions for a specific elderly person.
 * Accessible to Doctor, Parent, and Caregiver.
 */
export async function getPrescriptionsByElderly(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);

    const prescriptions: any = await Prescription.findAll({
      where: { elderly_id: elderlyId },
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['user_id', 'full_name', 'email', 'phone_number'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error: any) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({
      message: 'Internal server error fetching prescriptions.',
      status: 'error',
    });
  }
}

/**
 * PATCH /api/prescriptions/:id/administer
 * Caregiver clicks "Done" after administering a medication dose.
 * Records the timestamp and the administering user's name,
 * and notifies the Parent for transparent compliance.
 */
export async function administerPrescription(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const prescriptionId = Number(req.params.id);
    const caregiverUser = req.user?.userId ? await User.findByPk(req.user.userId) : null;
    const administeredBy = caregiverUser?.full_name || req.body.administered_by || 'Assigned Caregiver';

    const prescription: any = await Prescription.findByPk(prescriptionId, {
      include: [
        {
          model: ElderlyProfile,
          as: 'elderly',
          attributes: ['elderly_id', 'full_name', 'parent_id', 'caregiver_id'],
        },
      ],
    });

    if (!prescription) {
      res.status(404).json({
        message: 'Prescription not found.',
        status: 'error',
      });
      return;
    }

    const now = new Date();
    await prescription.update({
      last_administered_at: now,
      last_administered_by: administeredBy,
    });

    // Notify Parent that medication was given
    if (prescription.elderly?.parent_id) {
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const notifMessage = `${administeredBy} administered ${prescription.medication_name} (${prescription.dosage}) to ${prescription.elderly.full_name} at ${timeStr}.`;
      
      await Notification.create({
        user_id: prescription.elderly.parent_id,
        title: `Medication Administered: ${prescription.medication_name}`,
        message: notifMessage,
        status: 'unread',
      });

      // Emit socket event for real-time update
      try {
        const io = req.app.get('io');
        if (io) {
          io.to(`elderly_${prescription.elderly.elderly_id}`).emit('medication_administered', {
            prescriptionId,
            administeredBy,
            administeredAt: now,
          });
          io.to(`user_${prescription.elderly.parent_id}`).emit('notification', {
            title: `Medication Administered: ${prescription.medication_name}`,
            message: notifMessage,
          });
        }
      } catch (err) {
        console.error('Socket emission error in administer:', err);
      }
    }

    res.status(200).json({
      message: 'Medication administration recorded successfully.',
      status: 'success',
      data: prescription,
    });
  } catch (error: any) {
    console.error('Administer prescription error:', error);
    res.status(500).json({
      message: 'Internal server error recording administration.',
      status: 'error',
    });
  }
}

/**
 * PATCH /api/prescriptions/:id/status
 * Doctor updates the status of a prescription (e.g. 'completed', 'discontinued', 'active').
 */
export async function updatePrescriptionStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const prescriptionId = Number(req.params.id);
    const { status } = req.body;

    if (!status || !['active', 'completed', 'discontinued'].includes(status)) {
      res.status(400).json({
        message: 'Valid status required: active, completed, or discontinued.',
        status: 'error',
      });
      return;
    }

    const prescription = await Prescription.findByPk(prescriptionId);
    if (!prescription) {
      res.status(404).json({
        message: 'Prescription not found.',
        status: 'error',
      });
      return;
    }

    await prescription.update({ status });

    res.status(200).json({
      message: `Prescription marked as ${status}.`,
      status: 'success',
      data: prescription,
    });
  } catch (error: any) {
    console.error('Update prescription status error:', error);
    res.status(500).json({
      message: 'Internal server error updating prescription status.',
      status: 'error',
    });
  }
}
