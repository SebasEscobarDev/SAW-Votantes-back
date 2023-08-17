import User from '../models/Factory/UserFactory.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config as dotenv } from 'dotenv'
import { handleSequelizeError } from './handleError/sequalizeError.js'
dotenv()

export const getUsers = async (req, res, next) => {
  // paginacion
  const options = {}
  options.results = req.query.results ?? 10
  options.page = req.query.page ?? 1
  let totalItems, users
  try {
    totalItems = await User.totalItems()
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting All Users.',
      description,
      error
    })
  }
  try {
    users = await User.getUsers(options)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting All Users.',
      description,
      error
    })
  }
  const lastPage = Math.ceil(totalItems / options.results)
  const response = {
    data: users,
    total: totalItems,
    page: options.page,
    perPage: options.results,
    lastPage
  }
  return res.status(200).json(response)
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.getUser(req.params.id)
    return res.status(200).json(user)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while getting User.',
      description,
      error
    })
  }
}

export const createUser = async (req, res, next) => {
  try {
    const user = await User.createUser(req.body)
    return res.status(200).json(user)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Creating user.',
      description,
      error
    })
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.updateUser(req.body)
    return res.status(200).json(user)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while updating user.',
      description,
      error
    })
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.deleteUser(req.body)
    return res.status(200).json(user)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while deleting user.',
      description,
      error
    })
  }
}

// LOGIN POST
export const login = async (req, res) => {
  try {
    const user = await User.login(req.body.email)
    if (user.email !== req.body.email) {
      return res.status(422).json({
        message: 'Invalid Email'
      })
    }
    const passMatch = await bcrypt.compare(req.body.password, user.password)
    if (!passMatch) {
      return res.status(422).json({
        message: 'Incorrect password'
      })
    }
    if (user.connected) {
      return res.status(422).json({
        message: 'User is connected, please close the current session.'
      })
    }
    // await User.updateUser(user.id, {connected: 1});
    // const token = jwt.sign({id:user.id},'secret',{ expiresIn: '24h' });
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '24h' })
    return res.json({
      token,
      user
    })
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Internal server error',
      description,
      error
    })
  }
}
