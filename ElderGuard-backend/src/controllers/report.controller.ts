import { Response } from 'express';
import pool from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * REPORT CONTROLLER
 * 
 * Maps to UML: report
 * Attributes: reportId, title, period, generatedDate, content
 * Methods:
 * - generateReport() : Report
 * - downloadReport() : File
 * - viewReport()
 * 
 * Permitted role: Only Parent can generate reports.
 */

/**
 * POST /api/reports/generate
 * Parent generates a comprehensive health and care summary report.
 * Maps to UML: generateReport()
 */
export async function generateReport(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parentId = req.user?.userId;
    const { elderlyId, period, title } = req.body;

    if (!elderlyId || !period) {
      res.status(400).json({ message: 'elderlyId and period (daily/weekly/monthly) are required.', status: 'error' });
      return;
    }

    // Verify parent owns this elderly profile
    const [profiles]: any = await pool.query(
      'SELECT * FROM elderly_profiles WHERE elderly_id = ? AND parent_id = ?',
      [elderlyId, parentId]
    );

    if (profiles.length === 0) {
      res.status(403).json({ message: 'Forbidden: You do not manage this elderly person.', status: 'error' });
      return;
    }

    const elderly = profiles[0];

    // 1. Gather activities count
    const [activities]: any = await pool.query(
      'SELECT COUNT(*) AS total, SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) AS completed FROM daily_activities WHERE elderly_id = ?',
      [elderlyId]
    );

    // 2. Gather reminders count
    const [reminders]: any = await pool.query(
      'SELECT COUNT(*) AS total FROM reminders WHERE elderly_id = ?',
      [elderlyId]
    );

    // 3. Gather alerts count
    const [alerts]: any = await pool.query(
      'SELECT COUNT(*) AS total FROM alerts WHERE elderly_id = ?',
      [elderlyId]
    );

    // 4. Gather recent alerts
    const [recentAlerts]: any = await pool.query(
      'SELECT description, date_time FROM alerts WHERE elderly_id = ? ORDER BY date_time DESC LIMIT 5',
      [elderlyId]
    );

    // 5. Gather latest location
    const [latestLocation]: any = await pool.query(
      'SELECT latitude, longitude, timestamp FROM locations WHERE elderly_id = ? ORDER BY timestamp DESC LIMIT 1',
      [elderlyId]
    );

    const reportTitle = title || `${period.toUpperCase()} Care & Health Report for ${elderly.full_name}`;

    const reportContent = {
      summary: `ElderGuard ${period} status report for ${elderly.full_name}`,
      elderly_info: {
        name: elderly.full_name,
        date_of_birth: elderly.date_of_birth,
        emergency_contact: elderly.emergency_contact,
        medical_conditions: elderly.medical_information || 'None reported'
      },
      statistics: {
        total_activities: Number(activities[0].total) || 0,
        completed_activities: Number(activities[0].completed) || 0,
        active_reminders: Number(reminders[0].total) || 0,
        total_alerts_recorded: Number(alerts[0].total) || 0
      },
      recent_alerts: recentAlerts,
      latest_known_location: latestLocation[0] || null,
      generated_at: new Date().toISOString()
    };

    // Store in reports table
    const [result]: any = await pool.query(
      `INSERT INTO reports (elderly_id, parent_id, title, period, generated_date, content)
       VALUES (?, ?, ?, ?, NOW(), ?)`,
      [elderlyId, parentId, reportTitle, period, JSON.stringify(reportContent, null, 2)]
    );

    res.status(201).json({
      message: 'Report generated successfully.',
      status: 'success',
      data: {
        report_id: result.insertId,
        elderly_id: elderlyId,
        parent_id: parentId,
        title: reportTitle,
        period: period,
        content: reportContent
      }
    });
  } catch (error: any) {
    console.error('Generate report error:', error);
    res.status(500).json({
      message: 'Internal server error generating report.',
      status: 'error'
    });
  }
}

/**
 * GET /api/reports/elderly/:elderlyId
 * Lists all reports generated for an elderly person.
 */
export async function getReportsByElderly(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);

    const [rows]: any = await pool.query(
      'SELECT report_id, elderly_id, parent_id, title, period, generated_date FROM reports WHERE elderly_id = ? ORDER BY generated_date DESC',
      [elderlyId]
    );

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  } catch (error: any) {
    console.error('Get reports error:', error);
    res.status(500).json({
      message: 'Internal server error fetching reports.',
      status: 'error'
    });
  }
}

/**
 * GET /api/reports/:id
 * Maps to UML: viewReport()
 */
export async function viewReport(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const reportId = Number(req.params.id);

    const [rows]: any = await pool.query('SELECT * FROM reports WHERE report_id = ?', [reportId]);

    if (rows.length === 0) {
      res.status(404).json({ message: 'Report not found.', status: 'error' });
      return;
    }

    const report = rows[0];

    // Parse JSON string content back to object if possible
    try {
      report.content = JSON.parse(report.content);
    } catch (e) {
      // keep as string
    }

    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error: any) {
    console.error('View report error:', error);
    res.status(500).json({
      message: 'Internal server error viewing report.',
      status: 'error'
    });
  }
}

/**
 * GET /api/reports/:id/download
 * Maps to UML: downloadReport() : File
 * Downloads the report as a formatted text file.
 */
export async function downloadReport(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const reportId = Number(req.params.id);

    const [rows]: any = await pool.query('SELECT * FROM reports WHERE report_id = ?', [reportId]);

    if (rows.length === 0) {
      res.status(404).json({ message: 'Report not found.', status: 'error' });
      return;
    }

    const report = rows[0];
    const filename = `ElderGuard_Report_${report.report_id}.txt`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(
      `=======================================================\n` +
      `  ELDERGUARD SUMMARY REPORT\n` +
      `=======================================================\n` +
      `Title: ${report.title}\n` +
      `Period: ${report.period}\n` +
      `Date: ${report.generated_date}\n` +
      `-------------------------------------------------------\n` +
      `Report Content:\n${report.content}\n` +
      `=======================================================\n`
    );
  } catch (error: any) {
    res.status(500).json({ message: 'Error downloading report.', status: 'error' });
  }
}
