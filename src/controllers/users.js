import User from '../models/Factory/UserFactory.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config as dotenv } from 'dotenv'
import { handleSequelizeError } from './handleError/sequalizeError.js'
dotenv()

export const getAll = async (req, res, next) => {
  // paginacion
  const options = {}
  options.results = req.query.results ?? 10
  options.page = req.query.page ?? 1
  let totalItems, items
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
    items = await User.getAll(options)
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
    data: items,
    total: totalItems,
    page: options.page,
    perPage: options.results,
    lastPage
  }
  return res.status(200).json(response)
}

export const getItem = async (req, res, next) => {
  try {
    const item = await User.getItem(req.params.id)
    return res.status(200).json(item)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while getting User.',
      description,
      error
    })
  }
}

export const createItem = async (req, res, next) => {
  try {
    const item = await User.createItem(req.body)
    return res.status(200).json(item)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Creating user.',
      description,
      error
    })
  }
}

export const updateItem = async (req, res, next) => {
  try {
    const item = await User.updateItem(req.body)
    return res.status(200).json(item)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while updating user.',
      description,
      error
    })
  }
}

export const deleteItem = async (req, res, next) => {
  try {
    const user = await User.deleteItem(req.body.id)
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
