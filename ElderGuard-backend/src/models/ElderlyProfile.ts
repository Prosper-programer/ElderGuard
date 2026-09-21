import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ElderlyProfileAttributes {
  elderly_id: number;
  parent_id: number;
  caregiver_id?: number | null;
  doctor_id?: number | null;
  full_name: string;
  date_of_birth: string | Date;
  gender: string;
  address: string;
  emergency_contact: string;
  medical_information?: string | null;
  doctor_name?: string | null;
  doctor_phone?: string | null;
  doctor_specialty?: string | null;
  doctor_hospital?: string | null;
  doctor_email?: string | null;
  created_at?: Date;
}

export interface ElderlyProfileCreationAttributes
  extends Optional<ElderlyProfileAttributes, 'elderly_id' | 'caregiver_id' | 'doctor_id' | 'medical_information' | 'doctor_name' | 'doctor_phone' | 'doctor_specialty' | 'doctor_hospital' | 'doctor_email' | 'created_at'> {}

export class ElderlyProfile
  extends Model<ElderlyProfileAttributes, ElderlyProfileCreationAttributes>
  implements ElderlyProfileAttributes {
  declare elderly_id: number;
  declare parent_id: number;
  declare caregiver_id: number | null;
  declare doctor_id: number | null;
  declare full_name: string;
  declare date_of_birth: string | Date;
  declare gender: string;
  declare address: string;
  declare emergency_contact: string;
  declare medical_information: string | null;
  declare doctor_name: string | null;
  declare doctor_phone: string | null;
  declare doctor_specialty: string | null;
  declare doctor_hospital: string | null;
  declare doctor_email: string | null;
  declare created_at: Date;
}

ElderlyProfile.init(
  {
    elderly_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    caregiver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    emergency_contact: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    medical_information: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    doctor_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    doctor_phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    doctor_specialty: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    doctor_hospital: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    doctor_email: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'elderly_profiles',
    timestamps: false,
  }
);

export default ElderlyProfile;
