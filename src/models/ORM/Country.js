import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/db.js'

class Country extends Model {}
Country.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  country_code: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Country',
  tableName: 'Countries',
  timestamps: false,
  underscored: true
})

export default Country
