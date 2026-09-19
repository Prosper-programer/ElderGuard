import { Response } from 'express';
import pool from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * CLINICAL NOTE CONTROLLER
 * 
 * Allows Doctors to record medical observations, consultation notes, and treatment recommendations.
 * Allows Parents and Caregivers to view notes recorded for an elderly person.
 */

/**
 * POST /api/clinical-notes
 * Doctor adds a consultation / clinical note for a patient.
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

    // Verify doctor is assigned to this senior or senior exists
    const [elderly]: any = await pool.query('SELECT * FROM elderly_profiles WHERE elderly_id = ?', [elderlyId]);
    if (elderly.length === 0) {
      res.status(404).json({ message: 'Elderly profile not found.', status: 'error' });
      return;
    }

    const [result]: any = await pool.query(
      `INSERT INTO clinical_notes (elderly_id, doctor_id, title, note_content, recommendations)
       VALUES (?, ?, ?, ?, ?)`,
      [elderlyId, doctorId, title.trim(), noteContent.trim(), recommendations ? recommendations.trim() : null]
    );

    const noteId = result.insertId;

    res.status(201).json({
      message: 'Clinical note created successfully.',
      status: 'success',
      data: {
        note_id: noteId,
        elderly_id: elderlyId,
        doctor_id: doctorId,
        title: title.trim(),
        note_content: noteContent.trim(),
        recommendations: recommendations ? recommendations.trim() : null,
        created_at: new Date().toISOString()
      }
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
 * Retrieves all clinical notes recorded for an elderly person.
 */
export async function getClinicalNotesByElderly(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);

    const [rows]: any = await pool.query(
      `SELECT cn.*, u.full_name AS doctor_name, u.phone_number AS doctor_phone
       FROM clinical_notes cn
       JOIN users u ON cn.doctor_id = u.user_id
       WHERE cn.elderly_id = ?
       ORDER BY cn.created_at DESC`,
      [elderlyId]
    );

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  } catch (error: any) {
    console.error('Get clinical notes error:', error);
    res.status(500).json({
      message: 'Internal server error retrieving clinical notes.',
      status: 'error'
    });
  }
}
