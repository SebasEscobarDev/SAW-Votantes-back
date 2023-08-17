import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/db.js'

class Contact extends Model {}
Contact.init({
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
  device_type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  country_code: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  full_phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [3, 255]
    }
  },
  formatted_phone: {
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
      len: [1, 255]
    }
  },
  pushname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  historial: DataTypes.JSON,
  created_at: DataTypes.STRING,
  updated_at: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Contact',
  tableName: 'Contacts',
  timestamps: false,
  underscored: true
})

export default Contact
