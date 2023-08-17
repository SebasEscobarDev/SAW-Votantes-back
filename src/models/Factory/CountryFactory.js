import CountryModel from '../Operations/Country.js'
const country = new CountryModel()

class Country {
  static async totalItems () {
    return await country.totalItems()
  }

  static async getCountries (options) {
    return await country.getCountries(options)
  }

  static async getCountry (id) {
    return await country.getCountry(id)
  }

  static async createCountry (body) {
    return await country.createCountry(body)
  }

  static async updateCountry (body) {
    return await country.updateCountry(body)
  }

  static async deleteCountry (body) {
    return await country.deleteCountry(body)
  }
}

export default Country
