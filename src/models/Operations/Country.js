/* eslint-disable camelcase */
import moment from 'moment'
import CountryModel from '../ORM/Country.js'

class Country {
  async totalItems () {
    return await CountryModel.count().catch(e => {
      console.log(e)
    })
  }

  async getCountries ({ results, page }) {
    return await CountryModel.findAll({
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

  async getCountry (id) {
    return await CountryModel.findOne({
      where: { id },
      raw: true
    }).catch(e => {
      console.log(e)
    })
  }

  async createCountry (body) {
    return await CountryModel.create({
      name: body.name,
      country_code: body.country_code
    },
    {
      raw: true
    }
    ).catch(e => {
      console.log(e)
    })
  }

  async updateCountry (body) {
    const { id, name, country_code } = body
    const updated_at = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    const response = {
      ...(name && { name }),
      ...(country_code && { country_code }),
      ...(updated_at && { updated_at })
    }
    console.log(response)
    return await CountryModel.update(response, {
      where: { id },
      raw: true
    }).catch(e => {
      console.log(e)
    })
  }

  async deleteCountry ({ id }) {
    return await CountryModel.destroy({
      where: { id }
    }).catch(e => {
      console.log(e)
    })
  }
}

export default Country
