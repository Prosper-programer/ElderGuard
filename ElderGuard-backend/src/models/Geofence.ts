import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface GeofenceAttributes {
  geofence_id: number;
  elderly_id: number;
  center_latitude: number;
  center_longitude: number;
  radius: number;
  is_enabled: boolean;
  created_at?: Date;
}

export interface GeofenceCreationAttributes
  extends Optional<GeofenceAttributes, 'geofence_id' | 'is_enabled' | 'created_at'> {}

export class Geofence extends Model<GeofenceAttributes, GeofenceCreationAttributes> implements GeofenceAttributes {
  declare geofence_id: number;
  declare elderly_id: number;
  declare center_latitude: number;
  declare center_longitude: number;
  declare radius: number;
  declare is_enabled: boolean;
  declare created_at: Date;
}

Geofence.init(
  {
    geofence_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    elderly_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    center_latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    center_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    radius: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'geofences',
    timestamps: false,
  }
);

export default Geofence;
