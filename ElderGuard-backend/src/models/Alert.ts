import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AlertAttributes {
  alert_id: number;
  elderly_id: number;
  notification_id?: number | null;
  description: string;
  date_time?: Date;
}

export interface AlertCreationAttributes
  extends Optional<AlertAttributes, 'alert_id' | 'notification_id' | 'date_time'> {}

export class Alert extends Model<AlertAttributes, AlertCreationAttributes> implements AlertAttributes {
  public alert_id!: number;
  public elderly_id!: number;
  public notification_id!: number | null;
  public description!: string;
  public date_time!: Date;
}

Alert.init(
  {
    alert_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    elderly_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notification_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'alerts',
    timestamps: false,
  }
);

export default Alert;
