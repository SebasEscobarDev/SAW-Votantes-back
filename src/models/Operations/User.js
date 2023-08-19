/* eslint-disable camelcase */
import UserModel from '../ORM/User.js'
import moment from 'moment'
import bcrypt from 'bcryptjs'

const ARRAY_ATTRIBUTES = ['id', 'name', 'email', 'birth_date', 'connected', 'created_at', 'updated_at']

class User {
  async totalItems () {
    return await UserModel.count().catch(e => { console.log(e) })
  }

  async login (email) {
    return await UserModel.findOne({
      where: { email },
      raw: true
    }).catch(e => { console.log(e) })
  }

  async getAll ({ results, page }) {
    return await UserModel.findAll({
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['id', 'ASC']
      ],
      attributes: ARRAY_ATTRIBUTES,
      raw: true
    }).catch(e => { console.log(e) })
  }

  async getItem (id) {
    return await UserModel.findOne({
      where: { id },
      attributes: ARRAY_ATTRIBUTES,
      raw: true
    }).catch(e => { console.log(e) })
  }

  async deleteItem (id) {
    return await UserModel.destroy({
      where: { id }
    }).catch(e => { console.log(e) })
  }

  async createItem (body) {
    const hashPass = await bcrypt.hash(body.password, 12)
    return await UserModel.create({
      name: body.name,
      email: body.email,
      password: hashPass,
      birth_date: moment(body.birth_date, 'DD-MM-YYYY').utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
      created_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      raw: true
    }
    ).catch(e => { console.log(e) })
  }

  async updateItem (body) {
    let { id, name, email, password, birth_date } = body
    const updated_at = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')

    if (password) {
      const hashPass = await bcrypt.hash(password, 12)
      password = hashPass
    }
    if (birth_date) {
      birth_date = moment(birth_date, 'DD-MM-YYYY').utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    }

    const updateInfo = {
      ...(name && { name }),
      ...(email && { email }),
      ...(password && { password }),
      ...(birth_date && { birth_date }),
      ...(updated_at && { updated_at })
    }
    return await UserModel.update(updateInfo, {
      where: { id },
      raw: true
    }).catch(e => { console.log(e) })
  }
}

export default User
