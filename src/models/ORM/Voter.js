import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/db.js'
import Survey from './Survey.js'

class Voter extends Model {}
Voter.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  from: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  step: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  vote: DataTypes.BOOLEAN,
  info: {
    type: DataTypes.JSON,
    allowNull: true
  },
  created_at: DataTypes.STRING,
  updated_at: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Voter',
  tableName: 'Voters',
  timestamps: false,
  underscored: true
})

Voter.belongsTo(Survey, { foreignKey: 'survey_id' })

export default Voter
