/* eslint-disable camelcase */
import AgentModel from '../ORM/Agent.js'
import ContactModel from '../ORM/Contact.js'
import CountryModel from '../ORM/Country.js'
import moment from 'moment'

class Agent {
  async totalItems () {
    return await AgentModel.count().catch(e => {
      console.log(e)
    })
  }

  async getAgents ({ results, page }) {
    return AgentModel.findAll({
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['id', 'ASC']
      ],
      raw: true,
      include: [
        {
          model: ContactModel,
          attributes: ['country_code', 'pushname']
        },
        {
          model: CountryModel,
          attributes: ['country_code', 'name']
        }
      ]
    }).catch(e => {
      console.log(e)
    })
  }

  async getActiveAgents () {
    return AgentModel.findAll({
      where: { active: 1 },
      order: [
        ['id', 'ASC']
      ],
      raw: true,
      include: [
        {
          model: CountryModel,
          attributes: ['country_code', 'name']
        }
      ]
    }).catch(e => {
      console.log(e)
    })
  }

  async getAgent (id) {
    return AgentModel.findOne({
      where: { id },
      raw: true,
      include: [
        {
          model: ContactModel,
          attributes: ['country_code', 'pushname']
        },
        {
          model: CountryModel,
          attributes: ['country_code', 'name']
        }
      ]
    }).catch(e => {
      console.log(e)
    })
  }

  async createAgent (body) {
    body.active = (body.active) ? 1 : 0
    return AgentModel.create({
      fullphone: body.fullphone,
      name: body.name,
      receive: body.receive,
      active: body.active,
      created_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    }, { raw: true }).catch(e => {
      console.log(e)
    })
  }

  async updateAgent (body) {
    const { id, fullphone, name, receive } = body
    let { active } = body
    if (!active) {
      active = 0
    }
    const updated_at = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    const response = {
      ...(fullphone && { fullphone }),
      ...(name && { name }),
      ...(receive && { receive }),
      ...(active !== undefined && { active }),
      ...(updated_at && { updated_at })
    }
    console.log(response)
    return await AgentModel.update(response, {
      where: { id },
      raw: true
    }).catch(e => {
      console.log(e)
    })
  }

  async deleteAgent ({ id }) {
    return await AgentModel.destroy({
      where: { id },
      raw: true
    }).catch(e => {
      console.log(e)
    })
  }

  /**
    * @param [object]   body
    * @param    [int]      body.agent_id
    * @param    [object]   body.contacts
    * @return Array
    */
  // async sendContacts (body) {
  //   let msj = ''
  //   const historialArray = []
  //   const historial = {
  //     date: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
  //     agent_id: body.agent_id
  //   }
  //   historialArray.push(historial)

  //   body.contacts.map(async (contact, i) => {
  //     const searchContact = await ContactSend.findOne({
  //       where: { id: contact },
  //       raw: true
  //     }).catch(e => { throw e })

  //     if (searchContact === null) {
  //       const createContactSend = await ContactSend.create({
  //         historial: historialArray,
  //         contact_id: contact,
  //         agent_id: body.agent_id,
  //         created_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
  //         updated_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
  //       }, {
  //         raw: true
  //       }).catch(e => { throw e })

  //       if (createContactSend) {
  //         msj = `Se ha registrado ${i} contactos del agente ${body.agent_id}`
  //       } else {
  //         msj = `No se pudo registrar ${i} contactos del agente ${body.agent_id}`
  //       }
  //     } else {
  //       const oldHistorial = JSON.parse(searchContact.historial)
  //       oldHistorial.push(historial)

  //       searchContact.historial = JSON.stringify(oldHistorial)
  //       searchContact.agent_id = body.agent_id
  //       searchContact.updated_at = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
  //       const saveContact = await searchContact.save()
  //       if (saveContact) {
  //         msj = `Se ha registrado ${i} contactos del agente ${body.agent_id}`
  //       }
  //     }
  //   })
  //   return msj
  // }
}

export default Agent
