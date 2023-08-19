import Voter from '../models/Factory/VoterFactory.js'
import { handleSequelizeError } from './handleError/sequalizeError.js'

export const getAll = async (req, res, next) => {
  // paginacion
  const options = {}
  options.results = req.query.results ?? 10
  options.page = req.query.page ?? 1
  let totalItems, items
  try {
    totalItems = await Voter.totalItems()
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting total Items.',
      description,
      error
    })
  }
  try {
    items = await Voter.getAll(options)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting all Votes.',
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
    const item = await Voter.getItem(req.params.id)
    return res.status(200).json(item)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while getting Voter.',
      description,
      error
    })
  }
}

export const createItem = async (req, res, next) => {
  try {
    const item = await Voter.createItem(req.body)
    return res.status(200).json(item)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Creating Voter.',
      description,
      error
    })
  }
}

export const updateItem = async (req, res, next) => {
  try {
    const item = await Voter.updateItem(req.body)
    return res.status(200).json(item)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while updating Voter.',
      description,
      error
    })
  }
}

export const deleteItem = async (req, res, next) => {
  try {
    const item = await Voter.deleteItem(req.body.id)
    return res.status(200).json(item)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while deleting Voter.',
      description,
      error
    })
  }
}
