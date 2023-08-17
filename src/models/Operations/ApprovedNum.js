/* eslint-disable camelcase */
import moment from 'moment'
import ApprovedNumModel from '../ORM/ApprovedNum.js'

class ApprovedNum {
  async totalItems () {
    return await ApprovedNumModel.count()
  }

  async getApprovedNums ({ results, page }) {
    return await ApprovedNumModel.findAll({
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['id', 'ASC']
      ],
      raw: true
    }).catch(e => {
      console.log(e)
    })
  }

  async getApprovedNum (id) {
    return await ApprovedNumModel.findOne({
      where: { id },
      raw: true
    }).catch(e => {
      console.log(e)
    })
  }

  async createApprovedNum ({ fullphone }) {
    return await ApprovedNumModel.create({
      fullphone
    },
    {
      raw: true
    }
    ).catch(e => {
      console.log(e)
    })
  }

  async updateApprovedNum ({ id, fullphone }) {
    const updated_at = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    const response = {
      ...(fullphone && { fullphone }),
      ...(updated_at && { updated_at })
    }
    console.log(response)
    return await ApprovedNumModel.update(response, {
      where: { id },
      raw: true
    }).catch(e => {
      console.log(e)
    })
  }

  async deleteApprovedNum ({ id }) {
    return await ApprovedNumModel.destroy({
      where: { id }
    }).catch(e => {
      console.log(e)
    })
  }
}

export default ApprovedNum
