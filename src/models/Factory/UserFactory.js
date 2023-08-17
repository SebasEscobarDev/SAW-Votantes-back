import UserModel from '../Operations/User.js'
const user = new UserModel()

class User {
  static async totalItems () {
    return await user.totalItems()
  }

  static async login (email) {
    return await user.login(email)
  }

  static async getUsers (options) {
    return await user.getUsers(options)
  }

  static async getUser (id) {
    return await user.getUser(id)
  }

  static async createUser (body) {
    return await user.createUser(body)
  }

  static async updateUser (body) {
    return await user.updateUser(body)
  }

  static async deleteUser (body) {
    return await user.deleteUser(body)
  }
}

export default User
