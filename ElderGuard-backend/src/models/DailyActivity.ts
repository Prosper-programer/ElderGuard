import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface DailyActivityAttributes {
  activity_id: number;
  elderly_id: number;
  name: string;
  date: string | Date;
  start_time: string;
  end_time: string;
  description?: string | null;
  status: 'pending' | 'completed';
  created_at?: Date;
}

export interface DailyActivityCreationAttributes
  extends Optional<DailyActivityAttributes, 'activity_id' | 'description' | 'status' | 'created_at'> {}

export class DailyActivity
  extends Model<DailyActivityAttributes, DailyActivityCreationAttributes>
  implements DailyActivityAttributes {
  public activity_id!: number;
  public elderly_id!: number;
  public name!: string;
  public date!: string | Date;
  public start_time!: string;
  public end_time!: string;
  public description!: string | null;
  public status!: 'pending' | 'completed';
  public created_at!: Date;
}

DailyActivity.init(
  {
    activity_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    elderly_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'daily_activities',
    timestamps: false,
  }
);

export default DailyActivity;
