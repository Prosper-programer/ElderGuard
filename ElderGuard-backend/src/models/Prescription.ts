import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PrescriptionAttributes {
  prescription_id: number;
  elderly_id: number;
  doctor_id: number;
  medication_name: string;
  dosage: string;
  frequency: string;
  scheduled_time: string;
  instructions?: string | null;
  status: 'active' | 'completed' | 'discontinued';
  last_administered_at?: Date | null;
  last_administered_by?: string | null;
  created_at?: Date;
}

export interface PrescriptionCreationAttributes
  extends Optional<
    PrescriptionAttributes,
    'prescription_id' | 'instructions' | 'status' | 'last_administered_at' | 'last_administered_by' | 'created_at'
  > {}

export class Prescription
  extends Model<PrescriptionAttributes, PrescriptionCreationAttributes>
  implements PrescriptionAttributes {
  declare prescription_id: number;
  declare elderly_id: number;
  declare doctor_id: number;
  declare medication_name: string;
  declare dosage: string;
  declare frequency: string;
  declare scheduled_time: string;
  declare instructions: string | null;
  declare status: 'active' | 'completed' | 'discontinued';
  declare last_administered_at: Date | null;
  declare last_administered_by: string | null;
  declare created_at: Date;
}

Prescription.init(
  {
    prescription_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    elderly_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    medication_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    dosage: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    frequency: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    scheduled_time: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'discontinued'),
      allowNull: false,
      defaultValue: 'active',
    },
    last_administered_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_administered_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'prescriptions',
    timestamps: false,
  }
);

export default Prescription;
