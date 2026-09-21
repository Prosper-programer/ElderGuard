import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface NotificationAttributes {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  date_time?: Date;
  status: 'unread' | 'read';
}

export interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, 'notification_id' | 'date_time' | 'status'> {}

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes {
  declare notification_id: number;
  declare user_id: number;
  declare title: string;
  declare message: string;
  declare date_time: Date;
  declare status: 'unread' | 'read';
}

Notification.init(
  {
    notification_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('unread', 'read'),
      allowNull: false,
      defaultValue: 'unread',
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: false,
  }
);

export default Notification;
