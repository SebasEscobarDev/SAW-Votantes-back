import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/db.js'

class ApprovedNum extends Model {}
ApprovedNum.init({
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
  }
}, {
  sequelize,
  modelName: 'ApprovedNum',
  tableName: 'Approved_Nums',
  timestamps: false,
  underscored: true
})

export default ApprovedNum
