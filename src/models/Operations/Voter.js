/* eslint-disable camelcase */
import VoterModel from '../ORM/Voter.js'
import SurveyModel from '../ORM/Survey.js'
import moment from 'moment'

class Voter {
  async totalItems () {
    return await VoterModel.count().catch(e => {
      console.log(e)
    })
  }

  async getAll ({ results, page }) {
    return await VoterModel.findAll({
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['id', 'ASC']
      ],
      raw: true
    }).catch(e => { console.log(e) })
  }

  async getItem (id) {
    return await VoterModel.findOne({
      where: { id },
      raw: true
    }).catch(e => { console.log(e) })
  }

  async getByPhone (phone) {
    return await VoterModel.findOne({
      where: { phone: '' + phone },
      raw: true,
      include: SurveyModel
    }).catch(e => { console.log(e) })
  }

  async deleteItem (id) {
    return await VoterModel.destroy({
      where: { id }
    }).catch(e => { console.log(e) })
  }

  /* Solo se actualizan metodos CREATE Y UPDATE */

  async createItem ({ from, phone, step, vote, info, survey_id }) {
    if (info) info = JSON.stringify(info)
    VoterModel.findOne({
      where: { phone: '' + phone }
    })
      .then(async (voter) => {
        if (voter) {
          if (from) voter.from = from
          if (step) voter.step = step
          if (vote) voter.vote = vote
          if (info) voter.info = info
          if (survey_id) voter.survey_id = survey_id
          voter.updated_at = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
          return await voter.save()
        } else {
          return await VoterModel.create({
            from,
            phone,
            step,
            vote,
            info,
            created_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
            survey_id
          },
          {
            raw: true
          }).catch(e => { console.log(e) })
        }
      })
  }

  async updateItem ({ id, from, phone, step, vote, info, survey_id }) {
    if (info) info = JSON.stringify(info)
    const updated_at = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    const updateInfo = {
      ...(from && { from }),
      ...(phone && { phone }),
      ...(step && { step }),
      ...((vote === 0 || vote === 1) && { vote }),
      ...(info && { info }),
      ...(updated_at && { updated_at }),
      ...(survey_id && { survey_id })
    }
    return await VoterModel.update(updateInfo, {
      where: { id },
      raw: true
    }).catch(e => { console.log(e) })
  }
}

export default Voter
