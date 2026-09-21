import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserAttributes {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  password?: string;
  role: 'parent' | 'caregiver' | 'doctor';
  status: 'active' | 'inactive';
  created_at?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'user_id' | 'status' | 'created_at'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare user_id: number;
  declare full_name: string;
  declare email: string;
  declare phone_number: string;
  declare password: string;
  declare role: 'parent' | 'caregiver' | 'doctor';
  declare status: 'active' | 'inactive';
  declare created_at: Date;
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('parent', 'caregiver', 'doctor'),
      allowNull: false,
      defaultValue: 'parent',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
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
    tableName: 'users',
    timestamps: false,
  }
);

export default User;
