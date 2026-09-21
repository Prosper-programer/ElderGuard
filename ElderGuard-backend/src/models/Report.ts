import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ReportAttributes {
  report_id: number;
  elderly_id: number;
  parent_id: number;
  title: string;
  period: string;
  generated_date?: Date;
  content: string;
}

export interface ReportCreationAttributes
  extends Optional<ReportAttributes, 'report_id' | 'generated_date'> {}

export class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
  public report_id!: number;
  public elderly_id!: number;
  public parent_id!: number;
  public title!: string;
  public period!: string;
  public generated_date!: Date;
  public content!: string;
}

Report.init(
  {
    report_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    elderly_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    period: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    generated_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'reports',
    timestamps: false,
  }
);

export default Report;
