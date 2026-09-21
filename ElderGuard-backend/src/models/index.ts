import { sequelize } from '../config/database';
import User from './User';
import Admin from './Admin';
import ElderlyProfile from './ElderlyProfile';
import IoTDevice from './IoTDevice';
import DailyActivity from './DailyActivity';
import Location from './Location';
import Reminder from './Reminder';
import Notification from './Notification';
import Alert from './Alert';
import Geofence from './Geofence';
import Report from './Report';
import ClinicalNote from './ClinicalNote';
import Prescription from './Prescription';

// Associations

// Parent User <-> ElderlyProfiles
User.hasMany(ElderlyProfile, { foreignKey: 'parent_id', as: 'elderlyProfiles' });
ElderlyProfile.belongsTo(User, { foreignKey: 'parent_id', as: 'parent' });

// Caregiver User <-> ElderlyProfiles
User.hasMany(ElderlyProfile, { foreignKey: 'caregiver_id', as: 'assignedProfiles' });
ElderlyProfile.belongsTo(User, { foreignKey: 'caregiver_id', as: 'caregiver' });

// Doctor User <-> ElderlyProfiles
User.hasMany(ElderlyProfile, { foreignKey: 'doctor_id', as: 'patientProfiles' });
ElderlyProfile.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctorUser' });

// ElderlyProfile <-> IoTDevice
ElderlyProfile.hasOne(IoTDevice, { foreignKey: 'elderly_id', as: 'device' });
IoTDevice.belongsTo(ElderlyProfile, { foreignKey: 'elderly_id', as: 'elderly' });

// ElderlyProfile <-> DailyActivity
ElderlyProfile.hasMany(DailyActivity, { foreignKey: 'elderly_id', as: 'activities' });
DailyActivity.belongsTo(ElderlyProfile, { foreignKey: 'elderly_id', as: 'elderly' });

// ElderlyProfile <-> Location
ElderlyProfile.hasMany(Location, { foreignKey: 'elderly_id', as: 'locations' });
Location.belongsTo(ElderlyProfile, { foreignKey: 'elderly_id', as: 'elderly' });

// ElderlyProfile <-> Reminder
ElderlyProfile.hasMany(Reminder, { foreignKey: 'elderly_id', as: 'reminders' });
Reminder.belongsTo(ElderlyProfile, { foreignKey: 'elderly_id', as: 'elderly' });

// ElderlyProfile <-> Alert
ElderlyProfile.hasMany(Alert, { foreignKey: 'elderly_id', as: 'alerts' });
Alert.belongsTo(ElderlyProfile, { foreignKey: 'elderly_id', as: 'elderly' });

// ElderlyProfile <-> Geofence
ElderlyProfile.hasOne(Geofence, { foreignKey: 'elderly_id', as: 'geofence' });
Geofence.belongsTo(ElderlyProfile, { foreignKey: 'elderly_id', as: 'elderly' });

// ElderlyProfile <-> Report
ElderlyProfile.hasMany(Report, { foreignKey: 'elderly_id', as: 'reports' });
Report.belongsTo(ElderlyProfile, { foreignKey: 'elderly_id', as: 'elderly' });

// ElderlyProfile <-> ClinicalNote
ElderlyProfile.hasMany(ClinicalNote, { foreignKey: 'elderly_id', as: 'clinicalNotes' });
ClinicalNote.belongsTo(ElderlyProfile, { foreignKey: 'elderly_id', as: 'elderly' });

// Doctor User <-> ClinicalNote
User.hasMany(ClinicalNote, { foreignKey: 'doctor_id', as: 'writtenNotes' });
ClinicalNote.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctor' });

// ElderlyProfile <-> Prescription
ElderlyProfile.hasMany(Prescription, { foreignKey: 'elderly_id', as: 'prescriptions' });
Prescription.belongsTo(ElderlyProfile, { foreignKey: 'elderly_id', as: 'elderly' });

// Doctor User <-> Prescription
User.hasMany(Prescription, { foreignKey: 'doctor_id', as: 'prescriptions' });
Prescription.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctor' });

// User <-> Notification
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export {
  sequelize,
  User,
  Admin,
  ElderlyProfile,
  IoTDevice,
  DailyActivity,
  Location,
  Reminder,
  Notification,
  Alert,
  Geofence,
  Report,
  ClinicalNote,
  Prescription,
};

export default {
  sequelize,
  User,
  Admin,
  ElderlyProfile,
  IoTDevice,
  DailyActivity,
  Location,
  Reminder,
  Notification,
  Alert,
  Geofence,
  Report,
  ClinicalNote,
  Prescription,
};
