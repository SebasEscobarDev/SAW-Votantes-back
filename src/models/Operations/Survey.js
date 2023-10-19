/* eslint-disable camelcase */
import SurveyModel from '../ORM/Survey.js'
import moment from 'moment'

class Survey {
  async totalItems () {
    return await SurveyModel.count().catch(e => {
      console.log(e)
    })
  }

  async getAll ({ results, page }) {
    return await SurveyModel.findAll({
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['id', 'ASC']
      ],
      raw: true
    }).catch(e => { console.log(e) })
  }

  async getItem (id) {
    return await SurveyModel.findOne({
      where: { id },
      raw: true
    }).catch(e => { console.log(e) })
  }

  async deleteItem (id) {
    return await SurveyModel.destroy({
      where: { id }
    }).catch(e => { console.log(e) })
  }

  /* Solo se actualizan metodos CREATE Y UPDATE */

  async createItem ({ code, txtInicio, txtWelcome, txtYes, txtNo, info, txtEnd }) {
    if (info) info = JSON.stringify(info)
    return await SurveyModel.create({
      code,
      txtInicio,
      txtWelcome,
      txtYes,
      txtNo,
      info,
      txtEnd,
      created_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      raw: true
    }).catch(e => { console.log(e) })
  }

  async updateItem ({ id, code, txtInicio, txtWelcome, txtYes, txtNo, info, txtEnd }) {
    if (info) info = JSON.stringify(info)
    const updated_at = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    const updateInfo = {
      ...(code && { code }),
      ...(txtInicio && { txtInicio }),
      ...(txtWelcome && { txtWelcome }),
      ...(txtYes && { txtYes }),
      ...(txtNo && { txtNo }),
      ...(info && { info }),
      ...(txtEnd && { txtEnd }),
      ...(updated_at && { updated_at })
    }
    return await SurveyModel.update(updateInfo, {
      where: { id },
      raw: true
    }).catch(e => { console.log(e) })
  }
}

export default Survey
