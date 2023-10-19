import VoterModel from '../Operations/Voter.js'
const voter = new VoterModel()

class Voter {
  static async totalItems () {
    return await voter.totalItems()
  }

  static async getAll (options) {
    return await voter.getAll(options)
  }

  static async getItem (id) {
    return await voter.getItem(id)
  }

  static async getByPhone (phone) {
    return await voter.getByPhone(phone)
  }

  static async createItem (body) {
    return await voter.createItem(body)
  }

  static async updateItem (body) {
    return await voter.updateItem(body)
  }

  static async deleteItem (id) {
    return await voter.deleteItem(id)
  }
}

export default Voter
