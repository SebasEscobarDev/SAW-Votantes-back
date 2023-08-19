import Survey from '../models/Factory/SurveyFactory.js'
import { handleSequelizeError } from './handleError/sequalizeError.js'

export const getAll = async (req, res, next) => {
  // paginacion
  const options = {}
  options.results = req.query.results ?? 10
  options.page = req.query.page ?? 1
  let totalItems, items
  try {
    totalItems = await Survey.totalItems()
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting total Items.',
      description,
      error
    })
  }
  try {
    items = await Survey.getAll(options)
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
    const item = await Survey.getItem(req.params.id)
    return res.status(200).json(item)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while getting Survey.',
      description,
      error
    })
  }
}

export const createItem = async (req, res, next) => {
  try {
    const item = await Survey.createItem(req.body)
    return res.status(200).json(item)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Creating Survey.',
      description,
      error
    })
  }
}

export const updateItem = async (req, res, next) => {
  try {
    const item = await Survey.updateItem(req.body)
    return res.status(200).json(item)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while updating Survey.',
      description,
      error
    })
  }
}

export const deleteItem = async (req, res, next) => {
  try {
    const item = await Survey.deleteItem(req.body.id)
    return res.status(200).json(item)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while deleting Survey.',
      description,
      error
    })
  }
}
