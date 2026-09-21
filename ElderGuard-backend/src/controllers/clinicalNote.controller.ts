import { Response } from 'express';
import { ClinicalNote, ElderlyProfile, User } from '../models';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * CLINICAL NOTE CONTROLLER (Sequelize ORM)
 * 
 * Allows Doctors to record medical observations, consultation notes, and treatment recommendations.
 * Allows Parents and Caregivers to view notes recorded for an elderly person.
 */

/**
 * POST /api/clinical-notes
 * Doctor adds a consultation / clinical note for a patient via Sequelize.
 */
export async function createClinicalNote(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const doctorId = req.user?.userId;
    const { elderlyId, title, noteContent, recommendations } = req.body;

    if (!elderlyId || !title || !noteContent) {
      res.status(400).json({
        message: 'elderlyId, title, and noteContent are required.',
        status: 'error'
      });
      return;
    }

    // Verify elderly profile exists via Sequelize
    const elderly = await ElderlyProfile.findByPk(elderlyId);
    if (!elderly) {
      res.status(404).json({ message: 'Elderly profile not found.', status: 'error' });
      return;
    }

    const note = await ClinicalNote.create({
      elderly_id: Number(elderlyId),
      doctor_id: Number(doctorId),
      title: title.trim(),
      note_content: noteContent.trim(),
      recommendations: recommendations ? recommendations.trim() : null,
    });

    res.status(201).json({
      message: 'Clinical note created successfully.',
      status: 'success',
      data: note,
    });
  } catch (error: any) {
    console.error('Create clinical note error:', error);
    res.status(500).json({
      message: 'Internal server error creating clinical note.',
      status: 'error'
    });
  }
}

/**
 * GET /api/clinical-notes/elderly/:elderlyId
 * Retrieves all clinical notes recorded for an elderly person with joined doctor details via Sequelize.
 */
export async function getClinicalNotesByElderly(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);

    const notes: any = await ClinicalNote.findAll({
      where: { elderly_id: elderlyId },
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['full_name', 'phone_number'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const formattedNotes = notes.map((n: any) => ({
      note_id: n.note_id,
      elderly_id: n.elderly_id,
      doctor_id: n.doctor_id,
      title: n.title,
      note_content: n.note_content,
      recommendations: n.recommendations,
      created_at: n.created_at,
      doctor_name: n.doctor?.full_name || null,
      doctor_phone: n.doctor?.phone_number || null,
    }));

    res.status(200).json({
      status: 'success',
      count: formattedNotes.length,
      data: formattedNotes,
    });
  } catch (error: any) {
    console.error('Get clinical notes error:', error);
    res.status(500).json({
      message: 'Internal server error retrieving clinical notes.',
      status: 'error'
    });
  }
}
