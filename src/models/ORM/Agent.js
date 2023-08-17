import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/db.js'

class Agent extends Model {}
Agent.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullphone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [3, 255]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 255]
    }
  },
  receive: DataTypes.STRING,
  active: DataTypes.BOOLEAN,
  created_at: DataTypes.STRING,
  updated_at: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Agent',
  tableName: 'Agents',
  timestamps: false,
  underscored: true
})

export default Agent
