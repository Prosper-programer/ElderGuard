import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface IoTDeviceAttributes {
  device_id: number;
  elderly_id?: number | null;
  device_name: string;
  last_connection?: Date | null;
  status: 'connected' | 'disconnected';
  created_at?: Date;
}

export interface IoTDeviceCreationAttributes
  extends Optional<IoTDeviceAttributes, 'device_id' | 'elderly_id' | 'last_connection' | 'status' | 'created_at'> {}

export class IoTDevice
  extends Model<IoTDeviceAttributes, IoTDeviceCreationAttributes>
  implements IoTDeviceAttributes {
  declare device_id: number;
  declare elderly_id: number | null;
  declare device_name: string;
  declare last_connection: Date | null;
  declare status: 'connected' | 'disconnected';
  declare created_at: Date;
}

IoTDevice.init(
  {
    device_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    elderly_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    device_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_connection: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('connected', 'disconnected'),
      allowNull: false,
      defaultValue: 'disconnected',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'iot_devices',
    timestamps: false,
  }
);

export default IoTDevice;
