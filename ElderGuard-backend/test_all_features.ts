import { server } from './src/server';

const BASE_URL = 'http://127.0.0.1:5000';

let parentToken = '';
let parentId = 0;
let caregiverToken = '';
let caregiverId = 0;
let doctorToken = '';
let doctorId = 0;
let adminToken = '';
let elderlyId = 0;
let deviceId = 0;
let activityId = 0;
let reminderId = 0;
let notificationId = 0;
let reportId = 0;

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: any) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (detail) {
      console.error(`     Detail:`, JSON.stringify(detail).slice(0, 300));
    }
    failedTests++;
  }
}

async function request(method: string, path: string, body?: any, token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    return { status: res.status, data };
  } else {
    const text = await res.text();
    return { status: res.status, text };
  }
}

async function runTests() {
  console.log('===============================================================');
  console.log('   🚀 ELDERGUARD BACKEND FULL FEATURE INTEGRATION TEST SUITE   ');
  console.log('===============================================================\n');

  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log('📡 Connected to Backend HTTP Server on port 5000\n');

  try {
    // -------------------------------------------------------------
    // SECTION 1: Health & Database Connectivity
    // -------------------------------------------------------------
    console.log('--- SECTION 1: Health Check & Database Connectivity ---');
    const rootRes = await request('GET', '/');
    assert(rootRes.status === 200 && rootRes.data?.status === 'success', 'Root endpoint GET / responds 200 OK');

    const dbRes = await request('GET', '/api/test-db');
    assert(dbRes.status === 200 && dbRes.data?.status === 'success', 'Sequelize DB test endpoint GET /api/test-db responds 200 OK');

    // -------------------------------------------------------------
    // SECTION 2: Authentication & User Accounts (Parent, Caregiver, Doctor)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 2: Auth & Role Provisioning ---');
    const timestamp = Date.now();
    const parentEmail = `test_parent_${timestamp}@elderguard.test`;
    const regParentRes = await request('POST', '/api/auth/register', {
      fullName: 'Alice Parent',
      email: parentEmail,
      phoneNumber: '+15551234567',
      password: 'Password123!',
      role: 'parent'
    });
    assert(regParentRes.status === 201 && !!regParentRes.data?.token, 'Parent registration POST /api/auth/register', regParentRes);
    parentToken = regParentRes.data?.token;
    parentId = regParentRes.data?.user?.user_id || regParentRes.data?.data?.user_id;

    // Login Parent
    const loginParentRes = await request('POST', '/api/auth/login', {
      email: parentEmail,
      password: 'Password123!'
    });
    assert(loginParentRes.status === 200 && !!loginParentRes.data?.token, 'Parent login POST /api/auth/login', loginParentRes);

    // Get Profile
    const profileRes = await request('GET', '/api/auth/profile', undefined, parentToken);
    assert(profileRes.status === 200 && profileRes.data?.data?.email === parentEmail, 'Get authenticated profile GET /api/auth/profile', profileRes);

    // Update Profile
    const updateProfileRes = await request('PUT', '/api/users/profile', {
      fullName: 'Alice Updated',
      phoneNumber: '+15559876543'
    }, parentToken);
    assert(updateProfileRes.status === 200 && updateProfileRes.data?.data?.full_name === 'Alice Updated', 'Update user profile PUT /api/users/profile', updateProfileRes);

    // Provision Caregiver
    const caregiverEmail = `test_caregiver_${timestamp}@elderguard.test`;
    const createCaregiverRes = await request('POST', '/api/users/caregivers', {
      fullName: 'Bob Caregiver',
      email: caregiverEmail,
      phoneNumber: '+15552345678',
      password: 'Password123!'
    }, parentToken);
    assert(createCaregiverRes.status === 201, 'Parent provisions Caregiver POST /api/users/caregivers', createCaregiverRes);
    caregiverId = createCaregiverRes.data?.data?.user_id;

    // Provision Doctor
    const doctorEmail = `test_doctor_${timestamp}@elderguard.test`;
    const createDoctorRes = await request('POST', '/api/users/doctors', {
      fullName: 'Dr. Carol Smith',
      email: doctorEmail,
      phoneNumber: '+15553456789',
      password: 'Password123!'
    }, parentToken);
    assert(createDoctorRes.status === 201, 'Parent provisions Doctor POST /api/users/doctors', createDoctorRes);
    doctorId = createDoctorRes.data?.data?.user_id;

    // Login Caregiver
    const loginCaregiverRes = await request('POST', '/api/auth/login', {
      email: caregiverEmail,
      password: 'Password123!'
    });
    assert(loginCaregiverRes.status === 200 && (loginCaregiverRes.data?.user?.role === 'caregiver' || loginCaregiverRes.data?.data?.role === 'caregiver'), 'Caregiver login POST /api/auth/login', loginCaregiverRes);
    caregiverToken = loginCaregiverRes.data?.token;

    // Login Doctor
    const loginDoctorRes = await request('POST', '/api/auth/login', {
      email: doctorEmail,
      password: 'Password123!'
    });
    assert(loginDoctorRes.status === 200 && (loginDoctorRes.data?.user?.role === 'doctor' || loginDoctorRes.data?.data?.role === 'doctor'), 'Doctor login POST /api/auth/login', loginDoctorRes);
    doctorToken = loginDoctorRes.data?.token;

    // -------------------------------------------------------------
    // SECTION 3: Elderly Profile Management
    // -------------------------------------------------------------
    console.log('\n--- SECTION 3: Elderly Profile Management ---');
    const createElderlyRes = await request('POST', '/api/elderly', {
      fullName: 'Grandpa John',
      dateOfBirth: '1945-05-12',
      gender: 'Male',
      address: '742 Evergreen Terrace, Springfield',
      emergencyContact: '+15551234567',
      medicalInformation: 'Hypertension, Mild Arthritis',
      caregiverId: caregiverId,
      doctorId: doctorId,
      doctorName: 'Dr. Carol Smith',
      doctorPhone: '+15553456789',
      doctorHospital: 'Springfield General Hospital'
    }, parentToken);
    assert(createElderlyRes.status === 201 && !!createElderlyRes.data?.data?.elderly_id, 'Create Elderly Profile POST /api/elderly', createElderlyRes);
    elderlyId = createElderlyRes.data?.data?.elderly_id;

    // Parent views elderly profiles
    const parentElderlyList = await request('GET', '/api/elderly', undefined, parentToken);
    assert(parentElderlyList.status === 200 && parentElderlyList.data?.count > 0, 'Parent lists elderly profiles GET /api/elderly', parentElderlyList);

    // Caregiver views assigned elderly profiles
    const caregiverElderlyList = await request('GET', '/api/elderly', undefined, caregiverToken);
    assert(caregiverElderlyList.status === 200 && caregiverElderlyList.data?.count > 0, 'Caregiver views assigned elderly GET /api/elderly', caregiverElderlyList);

    // Doctor views patient profiles
    const doctorElderlyList = await request('GET', '/api/elderly', undefined, doctorToken);
    assert(doctorElderlyList.status === 200 && doctorElderlyList.data?.count > 0, 'Doctor views assigned patients GET /api/elderly', doctorElderlyList);

    // Get elderly profile by ID
    const elderlyDetailRes = await request('GET', `/api/elderly/${elderlyId}`, undefined, parentToken);
    assert(elderlyDetailRes.status === 200 && elderlyDetailRes.data?.data?.full_name === 'Grandpa John', 'Get profile by ID GET /api/elderly/:id', elderlyDetailRes);

    // Update elderly profile
    const updateElderlyRes = await request('PUT', `/api/elderly/${elderlyId}`, {
      fullName: 'Grandpa John Updated',
      emergencyContact: '+15559876543'
    }, parentToken);
    assert(updateElderlyRes.status === 200, 'Update elderly profile PUT /api/elderly/:id', updateElderlyRes);

    // -------------------------------------------------------------
    // SECTION 4: Daily Activities
    // -------------------------------------------------------------
    console.log('\n--- SECTION 4: Daily Activities & Statistics ---');
    const createActRes = await request('POST', '/api/activities', {
      elderlyId,
      name: 'Morning Walk in Park',
      date: '2026-09-22',
      startTime: '08:00:00',
      endTime: '08:45:00',
      description: 'Gentle walk around the garden'
    }, parentToken);
    assert(createActRes.status === 201, 'Create activity POST /api/activities', createActRes);
    activityId = createActRes.data?.data?.activity_id;

    // List activities
    const listActRes = await request('GET', `/api/activities/elderly/${elderlyId}`, undefined, parentToken);
    assert(listActRes.status === 200 && listActRes.data?.count >= 1, 'List activities GET /api/activities/elderly/:elderlyId', listActRes);

    // Caregiver records activity completion
    const recordActRes = await request('PATCH', `/api/activities/${activityId}/record`, {
      status: 'completed'
    }, caregiverToken);
    assert(recordActRes.status === 200 && recordActRes.data?.new_status === 'completed', 'Record activity completion PATCH /api/activities/:id/record', recordActRes);

    // Statistics
    const statsActRes = await request('GET', `/api/activities/statistics/${elderlyId}`, undefined, parentToken);
    assert(statsActRes.status === 200 && statsActRes.data?.data?.completed_activities >= 1, 'Activity statistics GET /api/activities/statistics/:elderlyId', statsActRes);

    // -------------------------------------------------------------
    // SECTION 5: Reminders & Notifications
    // -------------------------------------------------------------
    console.log('\n--- SECTION 5: Reminders & Push Notifications ---');
    const createReminderRes = await request('POST', '/api/reminders', {
      elderlyId,
      title: 'Blood Pressure Medication',
      date: '2026-09-22',
      time: '09:00:00',
      description: 'Take 1 tablet of Amlodipine 5mg with water',
      type: 'medication'
    }, parentToken);
    assert(createReminderRes.status === 201, 'Create reminder POST /api/reminders', createReminderRes);
    reminderId = createReminderRes.data?.data?.reminder_id;

    // List reminders
    const listRemindersRes = await request('GET', `/api/reminders/elderly/${elderlyId}`, undefined, parentToken);
    assert(listRemindersRes.status === 200 && listRemindersRes.data?.count >= 1, 'List reminders GET /api/reminders/elderly/:elderlyId', listRemindersRes);

    // Verify parent has notification from the reminder
    const notifsRes = await request('GET', '/api/notifications', undefined, parentToken);
    assert(notifsRes.status === 200 && notifsRes.data?.count >= 1, 'Fetch notifications GET /api/notifications', notifsRes);
    notificationId = notifsRes.data?.data?.[0]?.notification_id;

    if (notificationId) {
      // Consult notification
      const consultNotifRes = await request('GET', `/api/notifications/${notificationId}`, undefined, parentToken);
      assert(consultNotifRes.status === 200, 'Consult notification GET /api/notifications/:id', consultNotifRes);

      // Mark notification as read
      const readNotifRes = await request('PATCH', `/api/notifications/${notificationId}/read`, undefined, parentToken);
      assert(readNotifRes.status === 200, 'Mark notification read PATCH /api/notifications/:id/read', readNotifRes);
    }

    // -------------------------------------------------------------
    // SECTION 6: Geofence Safe Zones
    // -------------------------------------------------------------
    console.log('\n--- SECTION 6: Geofence Safe Zones ---');
    // Center: Paris (48.8566, 2.3522), Radius: 500 meters
    const createGfRes = await request('POST', '/api/geofences', {
      elderlyId,
      centerLatitude: 48.8566,
      centerLongitude: 2.3522,
      radius: 500
    }, parentToken);
    assert(createGfRes.status === 201 && createGfRes.data?.data?.radius === 500, 'Create geofence POST /api/geofences', createGfRes);

    // Get Geofence
    const getGfRes = await request('GET', `/api/geofences/${elderlyId}`, undefined, parentToken);
    assert(getGfRes.status === 200 && getGfRes.data?.data?.is_enabled === true, 'Get geofence GET /api/geofences/:elderlyId', getGfRes);

    // Check boundary inside: ~50m away from center
    const checkInside = await request('POST', `/api/geofences/${elderlyId}/check-boundary`, {
      latitude: 48.8570,
      longitude: 2.3525
    }, parentToken);
    assert(checkInside.status === 200 && checkInside.data?.data?.is_inside_boundary === true, 'Check boundary inside safe zone', checkInside);

    // Check boundary outside: ~2km away from center
    const checkOutside = await request('POST', `/api/geofences/${elderlyId}/check-boundary`, {
      latitude: 48.8700,
      longitude: 2.3700
    }, parentToken);
    assert(checkOutside.status === 200 && checkOutside.data?.data?.is_inside_boundary === false, 'Check boundary outside safe zone', checkOutside);

    // -------------------------------------------------------------
    // SECTION 7: Location Updates & Geofence Breach Alerts
    // -------------------------------------------------------------
    console.log('\n--- SECTION 7: Locations & Automatic Breach Alerts ---');
    // 1. Safe location (Inside radius)
    const locInsideRes = await request('POST', '/api/locations', {
      elderlyId,
      latitude: 48.8567,
      longitude: 2.3523
    });
    assert(locInsideRes.status === 201 && locInsideRes.data?.data?.geofence_breached === false, 'Record safe location (no breach)', locInsideRes);

    // 2. Breach location (Outside radius: 2km away -> Triggers Alert & Notification)
    const locOutsideRes = await request('POST', '/api/locations', {
      elderlyId,
      latitude: 48.8900,
      longitude: 2.3900
    });
    assert(locOutsideRes.status === 201 && locOutsideRes.data?.data?.geofence_breached === true, 'Record outside location (triggers geofence breach alert!)', locOutsideRes);

    // Get current location
    const currentLocRes = await request('GET', `/api/locations/current/${elderlyId}`, undefined, parentToken);
    assert(currentLocRes.status === 200 && currentLocRes.data?.data?.latitude != null, 'Get current location GET /api/locations/current/:elderlyId', currentLocRes);

    // Get location history
    const locHistoryRes = await request('GET', `/api/locations/history/${elderlyId}?limit=10`, undefined, parentToken);
    assert(locHistoryRes.status === 200 && locHistoryRes.data?.count >= 2, 'Get location history GET /api/locations/history/:elderlyId', locHistoryRes);

    // Calculate distance utility
    const calcDistRes = await request('POST', '/api/locations/distance', {
      lat1: 48.8566,
      lon1: 2.3522,
      lat2: 48.8570,
      lon2: 2.3525
    });
    assert(calcDistRes.status === 200 && calcDistRes.data?.distance_meters > 0, 'Calculate distance POST /api/locations/distance', calcDistRes);

    // -------------------------------------------------------------
    // SECTION 8: IoT Wearable Devices & Telemetry
    // -------------------------------------------------------------
    console.log('\n--- SECTION 8: IoT Wearable Devices & Telemetry ---');
    const regDeviceRes = await request('POST', '/api/iot/register', {
      elderlyId,
      deviceName: `SmartWatch-${timestamp}`
    }, parentToken);
    assert(regDeviceRes.status === 201 && !!regDeviceRes.data?.data?.device_id, 'Register IoT device POST /api/iot/register', regDeviceRes);
    deviceId = regDeviceRes.data?.data?.device_id;

    // Connect device
    const connectDeviceRes = await request('POST', `/api/iot/${deviceId}/connect`);
    assert(connectDeviceRes.status === 200, 'Connect IoT device POST /api/iot/:id/connect', connectDeviceRes);

    // Send normal telemetry
    const normalTelemetry = await request('POST', '/api/iot/data', {
      deviceId,
      elderlyId,
      heartRate: 72,
      spo2: 98,
      temperature: 36.6,
      fallDetected: false,
      latitude: 48.8568,
      longitude: 2.3524
    });
    assert(normalTelemetry.status === 200 && normalTelemetry.data?.status === 'success', 'Send normal IoT telemetry POST /api/iot/data', normalTelemetry);

    // Send emergency telemetry (Fall detected & High Heart Rate -> Alert generated)
    const fallTelemetry = await request('POST', '/api/iot/data', {
      deviceId,
      elderlyId,
      heartRate: 145,
      spo2: 90,
      temperature: 38.5,
      fallDetected: true,
      latitude: 48.8568,
      longitude: 2.3524
    });
    assert(fallTelemetry.status === 200 && (fallTelemetry.data?.data?.is_abnormal === true || fallTelemetry.data?.is_abnormal === true), 'Send Fall Detection telemetry (triggers emergency alert)', fallTelemetry);

    // List devices
    const listDevicesRes = await request('GET', '/api/iot/devices', undefined, parentToken);
    assert(listDevicesRes.status === 200 && listDevicesRes.data?.count >= 1, 'Get IoT devices GET /api/iot/devices', listDevicesRes);

    // Disconnect device
    const disconnectRes = await request('POST', `/api/iot/${deviceId}/disconnect`);
    assert(disconnectRes.status === 200, 'Disconnect IoT device POST /api/iot/:id/disconnect', disconnectRes);

    // -------------------------------------------------------------
    // SECTION 9: Alerts System & Manual SOS
    // -------------------------------------------------------------
    console.log('\n--- SECTION 9: Alerts System & Manual SOS ---');
    // Fetch alerts for elderly person (should have geofence & fall detection alerts)
    const alertsRes = await request('GET', `/api/alerts/elderly/${elderlyId}`, undefined, parentToken);
    assert(alertsRes.status === 200 && alertsRes.data?.count >= 1, 'List alerts for elderly GET /api/alerts/elderly/:elderlyId', alertsRes);

    // Send manual SOS alert
    const manualAlertRes = await request('POST', '/api/alerts/manual', {
      elderlyId,
      description: 'Senior pressed SOS Panic Button on wearable'
    }, parentToken);
    assert(manualAlertRes.status === 201 && manualAlertRes.data?.status === 'success', 'Send manual SOS alert POST /api/alerts/manual', manualAlertRes);

    // -------------------------------------------------------------
    // SECTION 10: Clinical Notes (Doctor Workflow)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 10: Clinical Notes (Doctor Workflow) ---');
    const createNoteRes = await request('POST', '/api/clinical-notes', {
      elderlyId,
      title: 'Routine Geriatric Assessment',
      noteContent: 'Routine geriatric assessment completed. Blood pressure stable at 125/80 mmHg. Maintain current medication dosage.'
    }, doctorToken);
    assert(createNoteRes.status === 201, 'Doctor creates clinical note POST /api/clinical-notes', createNoteRes);

    // View clinical notes
    const getNotesRes = await request('GET', `/api/clinical-notes/elderly/${elderlyId}`, undefined, doctorToken);
    assert(getNotesRes.status === 200 && getNotesRes.data?.count >= 1, 'View clinical notes GET /api/clinical-notes/elderly/:elderlyId', getNotesRes);

    // -------------------------------------------------------------
    // SECTION 11: Comprehensive Health Reports
    // -------------------------------------------------------------
    console.log('\n--- SECTION 11: Comprehensive Health Reports ---');
    const genReportRes = await request('POST', '/api/reports/generate', {
      elderlyId,
      period: 'weekly',
      title: 'Weekly Geriatric Health Summary'
    }, parentToken);
    assert(genReportRes.status === 201 && !!genReportRes.data?.data?.report_id, 'Generate health report POST /api/reports/generate', genReportRes);
    reportId = genReportRes.data?.data?.report_id;

    // List reports
    const listReportsRes = await request('GET', `/api/reports/elderly/${elderlyId}`, undefined, parentToken);
    assert(listReportsRes.status === 200 && listReportsRes.data?.count >= 1, 'List reports GET /api/reports/elderly/:elderlyId', listReportsRes);

    // View report
    const viewReportRes = await request('GET', `/api/reports/${reportId}`, undefined, parentToken);
    assert(viewReportRes.status === 200 && !!viewReportRes.data?.data?.content, 'View report GET /api/reports/:id', viewReportRes);

    // Download report
    const dlReportRes = await request('GET', `/api/reports/${reportId}/download`, undefined, parentToken);
    assert(dlReportRes.status === 200 && typeof dlReportRes.text === 'string' && dlReportRes.text.includes('ELDERGUARD SUMMARY REPORT'), 'Download report GET /api/reports/:id/download', dlReportRes);

    // -------------------------------------------------------------
    // SECTION 12: Admin Dashboard
    // -------------------------------------------------------------
    console.log('\n--- SECTION 12: Admin Dashboard ---');
    const adminLoginRes = await request('POST', '/api/auth/admin/login', {
      email: 'admin@elderguard.com',
      password: 'admin123456'
    });
    assert(adminLoginRes.status === 200 && !!adminLoginRes.data?.token, 'Admin login POST /api/auth/admin/login', adminLoginRes);
    adminToken = adminLoginRes.data?.token;

    // Admin get parents list
    const adminParentsRes = await request('GET', '/api/admin/parents', undefined, adminToken);
    assert(adminParentsRes.status === 200 && adminParentsRes.data?.total >= 1, 'Admin lists parents GET /api/admin/parents', adminParentsRes);

    // Admin get parent details
    const adminParentDetailRes = await request('GET', `/api/admin/parents/${parentId}`, undefined, adminToken);
    assert(adminParentDetailRes.status === 200 && adminParentDetailRes.data?.data?.user_id === parentId, 'Admin views parent details GET /api/admin/parents/:id', adminParentDetailRes);

    // Admin deactivates parent
    const deactRes = await request('PATCH', `/api/admin/parents/${parentId}/deactivate`, undefined, adminToken);
    assert(deactRes.status === 200 && (deactRes.data?.new_status === 'inactive' || deactRes.data?.data?.status === 'inactive'), 'Admin deactivates parent PATCH /api/admin/parents/:id/deactivate', deactRes);

    // Admin reactivates parent
    const actRes = await request('PATCH', `/api/admin/parents/${parentId}/activate`, undefined, adminToken);
    assert(actRes.status === 200 && (actRes.data?.new_status === 'active' || actRes.data?.data?.status === 'active'), 'Admin reactivates parent PATCH /api/admin/parents/:id/activate', actRes);

    // Admin gets system stats
    const sysStatsRes = await request('GET', '/api/admin/system-stats', undefined, adminToken);
    assert(sysStatsRes.status === 200 && (sysStatsRes.data?.data?.parents?.total >= 1 || sysStatsRes.data?.data?.total_parents >= 1), 'Admin gets system stats GET /api/admin/system-stats', sysStatsRes);

    // -------------------------------------------------------------
    // SECTION 13: Clinical Prescriptions & Dual Notifications & Parent Management
    // -------------------------------------------------------------
    console.log('\n--- SECTION 13: Prescriptions, Dual Notifications & Parent Management ---');
    let prescriptionId = 0;

    // Doctor creates prescription
    const createPrescriptionRes = await request('POST', '/api/prescriptions', {
      elderly_id: elderlyId,
      medication_name: 'Amlodipine Besylate',
      dosage: '5mg Tablet',
      frequency: 'Once daily in the morning',
      scheduled_time: '08:00 AM',
      instructions: 'Administer with a glass of water after breakfast'
    }, doctorToken);
    assert(createPrescriptionRes.status === 201 && createPrescriptionRes.data?.data?.prescription_id, 'Doctor creates prescription POST /api/prescriptions', createPrescriptionRes);
    prescriptionId = createPrescriptionRes.data?.data?.prescription_id;

    // Verify PARENT received prescription notification
    const parentNotifsRes = await request('GET', '/api/notifications', undefined, parentToken);
    const parentHasPrescriptionNotif = parentNotifsRes.data?.data?.some((n: any) =>
      n.title?.toLowerCase().includes('prescription') || n.message?.toLowerCase().includes('amlodipine')
    );
    assert(parentNotifsRes.status === 200 && parentHasPrescriptionNotif, 'Parent received prescription notification GET /api/notifications', parentNotifsRes);

    // Verify CAREGIVER received prescription notification
    const caregiverNotifsRes = await request('GET', '/api/notifications', undefined, caregiverToken);
    const caregiverHasPrescriptionNotif = caregiverNotifsRes.data?.data?.some((n: any) =>
      n.title?.toLowerCase().includes('medication') || n.message?.toLowerCase().includes('amlodipine')
    );
    assert(caregiverNotifsRes.status === 200 && caregiverHasPrescriptionNotif, 'Caregiver received prescription notification GET /api/notifications', caregiverNotifsRes);

    // Caregiver lists prescriptions for elderly
    const listPrescriptionsRes = await request('GET', `/api/prescriptions/elderly/${elderlyId}`, undefined, caregiverToken);
    assert(listPrescriptionsRes.status === 200 && listPrescriptionsRes.data?.data?.length >= 1, 'Caregiver views prescriptions GET /api/prescriptions/elderly/:elderlyId', listPrescriptionsRes);

    // Caregiver marks medication dose as administered ("Done" button)
    const administerRes = await request('PATCH', `/api/prescriptions/${prescriptionId}/administer`, {
      administered_by: 'Caregiver Amara'
    }, caregiverToken);
    assert(administerRes.status === 200 && !!administerRes.data?.data?.last_administered_at, 'Caregiver clicks Done to administer prescription PATCH /api/prescriptions/:id/administer', administerRes);

    // Doctor updates prescription status
    const updatePrescriptionRes = await request('PATCH', `/api/prescriptions/${prescriptionId}/status`, {
      status: 'completed'
    }, doctorToken);
    assert(updatePrescriptionRes.status === 200 && updatePrescriptionRes.data?.data?.status === 'completed', 'Doctor updates prescription status PATCH /api/prescriptions/:id/status', updatePrescriptionRes);

    // Parent updates Caregiver profile
    const updateCaregiverRes = await request('PUT', `/api/users/caregivers/${caregiverId}`, {
      fullName: 'Amara Biya',
      phoneNumber: '+237699452310'
    }, parentToken);
    assert(updateCaregiverRes.status === 200 && updateCaregiverRes.data?.data?.full_name === 'Amara Biya', 'Parent updates Caregiver profile PUT /api/users/caregivers/:id', updateCaregiverRes);

    // Parent updates Doctor profile
    const updateDoctorRes = await request('PUT', `/api/users/doctors/${doctorId}`, {
      fullName: 'Dr. Jean-Paul Mbarga',
      phoneNumber: '+237655891234'
    }, parentToken);
    assert(updateDoctorRes.status === 200 && updateDoctorRes.data?.data?.full_name === 'Dr. Jean-Paul Mbarga', 'Parent updates Doctor profile PUT /api/users/doctors/:id', updateDoctorRes);

    // -------------------------------------------------------------
    // SECTION 14: Clean-up Deletions
    // -------------------------------------------------------------
    console.log('\n--- SECTION 14: Clean-up Operations ---');
    const delActRes = await request('DELETE', `/api/activities/${activityId}`, undefined, parentToken);
    assert(delActRes.status === 200, 'Delete activity DELETE /api/activities/:id', delActRes);

    const delReminderRes = await request('DELETE', `/api/reminders/${reminderId}`, undefined, parentToken);
    assert(delReminderRes.status === 200, 'Delete reminder DELETE /api/reminders/:id', delReminderRes);

    const delElderlyRes = await request('DELETE', `/api/elderly/${elderlyId}`, undefined, parentToken);
    assert(delElderlyRes.status === 200, 'Delete elderly profile DELETE /api/elderly/:id', delElderlyRes);

  } catch (err: any) {
    console.error('💥 Test suite execution error:', err);
    failedTests++;
  } finally {
    server.close();
    console.log('\n===============================================================');
    console.log(`   TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED   `);
    console.log('===============================================================');
    process.exit(failedTests > 0 ? 1 : 0);
  }
}

runTests();
