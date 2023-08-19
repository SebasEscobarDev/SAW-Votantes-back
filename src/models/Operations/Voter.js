/* eslint-disable camelcase */
import VoterModel from '../ORM/Voter.js'
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

  async deleteItem (id) {
    return await VoterModel.destroy({
      where: { id }
    }).catch(e => { console.log(e) })
  }

  /* Solo se actualizan metodos CREATE Y UPDATE */

  async createItem ({ from, phone, frmPhone, vote, info }) {
    VoterModel.findOne({
      where: { phone: '' + phone }
    })
      .then(async (voter) => {
        if (voter) {
          if (from) voter.from = from
          if (vote) voter.vote = vote
          if (info) voter.info = JSON.stringify(info)
          voter.updated_at = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
          return await voter.save()
        } else {
          return await VoterModel.create({
            from,
            phone,
            frmPhone,
            vote,
            info,
            created_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
          },
          {
            raw: true
          }).catch(e => { console.log(e) })
        }
      })
  }

  async updateItem (body) {
    const { id, from, phone, frmPhone, vote, info } = body
    const updated_at = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    const updateInfo = {
      ...(from && { from }),
      ...(phone && { phone }),
      ...(frmPhone && { frmPhone }),
      ...(vote && { vote }),
      ...(info && { info }),
      ...(updated_at && { updated_at })
    }
    return await VoterModel.update(updateInfo, {
      where: { id },
      raw: true
    }).catch(e => { console.log(e) })
  }
}

export default Voter
