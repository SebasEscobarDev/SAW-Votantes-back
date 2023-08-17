/* eslint-disable camelcase */
import ContactModel from '../ORM/Contact.js'
import moment from 'moment'
import { Op, literal } from 'sequelize'
import AgentModel from '../ORM/Agent.js'

class Contact {
  async totalItems () {
    return await ContactModel.count().catch(e => {
      console.log(e)
    })
  }

  async getContacts ({ results, page }) {
    return await ContactModel.findAll({
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['id', 'ASC']
      ],
      raw: true,
      include: {
        model: AgentModel,
        attributes: ['name']
      }
    }).catch(e => {
      console.log(e)
    })
  }

  async getContact (id) {
    return await ContactModel.findOne({
      where: { id },
      raw: true,
      include: {
        model: AgentModel
      }
    }).catch(e => {
      console.log(e)
    })
  }

  async getUnsentContacts () {
    return await ContactModel.findAll({
      attributes: ['id', 'country_code', 'full_phone', 'formatted_phone', 'pushname'],
      where: {
        id: {
          [Op.notIn]: literal('(SELECT DISTINCT contact_id FROM contacts_sends)')
        }
      },
      raw: true
    }).catch(e => {
      console.log(e)
    })
  }

  async createContact (body) {
    ContactModel.findOne({
      where: { full_phone: '' + body.full_phone }
    })
      .then(async (existingContact) => {
        if (existingContact) {
          const oldHistorial = JSON.parse(existingContact.historial)
          oldHistorial.push(body.historial)
          existingContact.device_type = body.device_type
          existingContact.pushname = body.pushname
          existingContact.historial = JSON.stringify(oldHistorial)
          existingContact.updated_at = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
          return await existingContact.save()
        } else {
          return await ContactModel.create({
            from: body.from,
            device_type: body.device_type,
            country_code: body.country_code,
            full_phone: body.full_phone,
            formatted_phone: body.formatted_phone,
            name: body.name,
            pushname: body.pushname,
            avatar: body.avatar,
            historial: body.historial,
            created_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
          },
          {
            raw: true
          }).catch(e => {
            console.log(e)
          })
        }
      })
  }

  async updateContact (body) {
    const { id, from, device_type, country_code, full_phone, formatted_phone, name, pushname, avatar, historial } = body
    const updated_at = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    const response = {
      ...(from && { from }),
      ...(device_type && { device_type }),
      ...(country_code && { country_code }),
      ...(full_phone && { full_phone }),
      ...(formatted_phone && { formatted_phone }),
      ...(name && { name }),
      ...(pushname && { pushname }),
      ...(avatar && { avatar }),
      ...(historial && { historial }),
      ...(updated_at && { updated_at })
    }
    console.log(response)
    return await ContactModel.update(response, {
      where: { id },
      raw: true
    }).catch(e => {
      console.log(e)
    })
  }

  async deleteContact ({ id }) {
    return await ContactModel.destroy({
      where: { id }
    }).catch(e => {
      console.log(e)
    })
  }
}

export default Contact
