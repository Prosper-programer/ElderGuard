import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface LocationAttributes {
  location_id: number;
  elderly_id: number;
  latitude: number;
  longitude: number;
  timestamp?: Date;
}

export interface LocationCreationAttributes
  extends Optional<LocationAttributes, 'location_id' | 'timestamp'> {}

export class Location extends Model<LocationAttributes, LocationCreationAttributes> implements LocationAttributes {
  declare location_id: number;
  declare elderly_id: number;
  declare latitude: number;
  declare longitude: number;
  declare timestamp: Date;
}

Location.init(
  {
    location_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    elderly_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'locations',
    timestamps: false,
  }
);

export default Location;
