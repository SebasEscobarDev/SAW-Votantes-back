import SurveyModel from '../Operations/Survey.js'
const survey = new SurveyModel()

class Survey {
  static async totalItems () {
    return await survey.totalItems()
  }

  static async getAll (options) {
    return await survey.getAll(options)
  }

  static async getItem (id) {
    return await survey.getItem(id)
  }

  static async createItem (body) {
    return await survey.createItem(body)
  }

  static async updateItem (body) {
    return await survey.updateItem(body)
  }

  static async deleteItem (id) {
    return await survey.deleteItem(id)
  }
}

export default Survey
