import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/db.js'

class AgentCountry extends Model {}
AgentCountry.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  sequelize,
  modelName: 'AgentCountry',
  tableName: 'Agents_Countries',
  timestamps: false,
  underscored: true
})

export default AgentCountry
