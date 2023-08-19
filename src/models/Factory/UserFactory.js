import UserModel from '../Operations/User.js'
const user = new UserModel()

class User {
  static async totalItems () {
    return await user.totalItems()
  }

  static async login (email) {
    return await user.login(email)
  }

  static async getAll (options) {
    return await user.getAll(options)
  }

  static async getItem (id) {
    return await user.getItem(id)
  }

  static async createItem (body) {
    return await user.createItem(body)
  }

  static async updateItem (body) {
    return await user.updateItem(body)
  }

  static async deleteItem (id) {
    return await user.deleteItem(id)
  }
}

export default User
