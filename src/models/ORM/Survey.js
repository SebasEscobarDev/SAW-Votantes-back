import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/db.js'

class Survey extends Model {}
Survey.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [3, 255]
    }
  },
  txtInicio: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  txtWelcome: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  txtYes: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  txtNo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  info: {
    type: DataTypes.JSON,
    allowNull: true
  },
  txtEnd: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: DataTypes.STRING,
  updated_at: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Survey',
  tableName: 'Surveys',
  timestamps: false,
  underscored: true
})

export default Survey
