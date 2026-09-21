import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ReminderAttributes {
  reminder_id: number;
  elderly_id: number;
  title: string;
  date: string | Date;
  time: string;
  description?: string | null;
  type: string;
  status: 'active' | 'completed' | 'dismissed';
  created_at?: Date;
}

export interface ReminderCreationAttributes
  extends Optional<ReminderAttributes, 'reminder_id' | 'description' | 'type' | 'status' | 'created_at'> {}

export class Reminder extends Model<ReminderAttributes, ReminderCreationAttributes> implements ReminderAttributes {
  declare reminder_id: number;
  declare elderly_id: number;
  declare title: string;
  declare date: string | Date;
  declare time: string;
  declare description: string | null;
  declare type: string;
  declare status: 'active' | 'completed' | 'dismissed';
  declare created_at: Date;
}

Reminder.init(
  {
    reminder_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    elderly_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'medication',
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'dismissed'),
      allowNull: false,
      defaultValue: 'active',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'reminders',
    timestamps: false,
  }
);

export default Reminder;
