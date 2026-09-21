import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Report, ElderlyProfile, DailyActivity, Reminder, Alert, Location } from '../models';

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
    const profile = await ElderlyProfile.findOne({
      where: { elderly_id: elderlyId, parent_id: parentId }
    });

    if (!profile) {
      res.status(403).json({ message: 'Forbidden: You do not manage this elderly person.', status: 'error' });
      return;
    }

    const elderly = profile.toJSON();

    // 1-5. Gather data concurrently with Sequelize models
    const [
      totalActivities,
      completedActivities,
      totalReminders,
      totalAlerts,
      recentAlerts,
      latestLocation
    ] = await Promise.all([
      DailyActivity.count({ where: { elderly_id: elderlyId } }),
      DailyActivity.count({ where: { elderly_id: elderlyId, status: 'completed' } }),
      Reminder.count({ where: { elderly_id: elderlyId } }),
      Alert.count({ where: { elderly_id: elderlyId } }),
      Alert.findAll({
        where: { elderly_id: elderlyId },
        order: [['date_time', 'DESC']],
        limit: 5,
        attributes: ['description', 'date_time']
      }),
      Location.findOne({
        where: { elderly_id: elderlyId },
        order: [['timestamp', 'DESC']],
        attributes: ['latitude', 'longitude', 'timestamp']
      })
    ]);

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
        total_activities: totalActivities,
        completed_activities: completedActivities,
        active_reminders: totalReminders,
        total_alerts_recorded: totalAlerts
      },
      recent_alerts: recentAlerts.map(a => a.toJSON()),
      latest_known_location: latestLocation ? latestLocation.toJSON() : null,
      generated_at: new Date().toISOString()
    };

    // Store in reports table
    const newReport = await Report.create({
      elderly_id: elderlyId,
      parent_id: parentId!,
      title: reportTitle,
      period: period,
      content: JSON.stringify(reportContent, null, 2)
    });

    res.status(201).json({
      message: 'Report generated successfully.',
      status: 'success',
      data: {
        report_id: newReport.report_id,
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

    const rows = await Report.findAll({
      where: { elderly_id: elderlyId },
      attributes: ['report_id', 'elderly_id', 'parent_id', 'title', 'period', 'generated_date'],
      order: [['generated_date', 'DESC']]
    });

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

    const report = await Report.findByPk(reportId);

    if (!report) {
      res.status(404).json({ message: 'Report not found.', status: 'error' });
      return;
    }

    const data: any = report.toJSON();

    // Parse JSON string content back to object if possible
    try {
      data.content = JSON.parse(data.content);
    } catch (e) {
      // keep as string
    }

    res.status(200).json({
      status: 'success',
      data
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

    const report = await Report.findByPk(reportId);

    if (!report) {
      res.status(404).json({ message: 'Report not found.', status: 'error' });
      return;
    }

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
