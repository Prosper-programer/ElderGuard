import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ClinicalNoteAttributes {
  note_id: number;
  elderly_id: number;
  doctor_id: number;
  title: string;
  note_content: string;
  recommendations?: string | null;
  created_at?: Date;
}

export interface ClinicalNoteCreationAttributes
  extends Optional<ClinicalNoteAttributes, 'note_id' | 'recommendations' | 'created_at'> {}

export class ClinicalNote
  extends Model<ClinicalNoteAttributes, ClinicalNoteCreationAttributes>
  implements ClinicalNoteAttributes {
  declare note_id: number;
  declare elderly_id: number;
  declare doctor_id: number;
  declare title: string;
  declare note_content: string;
  declare recommendations: string | null;
  declare created_at: Date;
}

ClinicalNote.init(
  {
    note_id: {
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
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    note_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recommendations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'clinical_notes',
    timestamps: false,
  }
);

export default ClinicalNote;
