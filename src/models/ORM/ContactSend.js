import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/db.js'

class ContactSend extends Model {}
ContactSend.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  historial: DataTypes.JSON
}, {
  sequelize,
  modelName: 'ContactSend',
  tableName: 'contacts_sends',
  timestamps: false,
  underscored: true
})

export default ContactSend
