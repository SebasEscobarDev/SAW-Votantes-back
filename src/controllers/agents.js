import Agent from '../models/Factory/AgentFactory.js'
import { config as dotenv } from 'dotenv'
import { handleSequelizeError } from './handleError/sequalizeError.js'
dotenv()

export const getAgents = async (req, res, next) => {
  // paginacion
  const options = {}
  options.results = req.query.results ?? 10
  options.page = req.query.page ?? 1
  let totalItems, agents
  try {
    totalItems = await Agent.totalItems()
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting Count All Items.',
      description,
      error
    })
  }

  try {
    agents = await Agent.getAgents(options)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting All Agents.',
      description,
      error
    })
  }
  const lastPage = Math.ceil(totalItems / options.results)
  const response = {
    data: agents,
    total: totalItems,
    page: options.page,
    perPage: options.results,
    lastPage
  }
  return res.status(200).json(response)
}

export const getAgent = async (req, res, next) => {
  try {
    const agent = await Agent.getAgent(req.params.id)
    return res.status(200).json(agent)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while getting Agent.',
      description,
      error
    })
  }
}

export const createAgent = async (req, res, next) => {
  try {
    const agent = await Agent.createAgent(req.body)
    return res.status(200).json(agent)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Creating Agent.',
      description,
      error
    })
  }
}

export const updateAgent = async (req, res, next) => {
  try {
    const agent = await Agent.updateAgent(req.body)
    return res.status(200).json(agent)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while updating agent.',
      description,
      error
    })
  }
}

export const deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.deleteAgent(req.body)
    return res.status(200).json(agent)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while deleting agent.',
      description,
      error
    })
  }
}

// export const sendContacts = async (req, res, next) => {
//   try {
//     const sendContacts = await Agent.sendContacts(req.body)
//     return res.status(200).json(sendContacts)
//   } catch (error) {
//     return res.status(500).json({
//       message: 'Error while sendContacts to agent.',
//       error: error.message
//     })
//   }
// }
