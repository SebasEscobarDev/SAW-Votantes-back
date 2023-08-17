import ApprovedNum from '../models/Factory/ApprovedNumFactory.js'
import { config as dotenv } from 'dotenv'
import { handleSequelizeError } from './handleError/sequalizeError.js'
dotenv()

export const getApprovedNums = async (req, res, next) => {
  // paginacion
  const options = {}
  options.results = req.query.results ?? 10
  options.page = req.query.page ?? 1
  let totalItems, approvedNums
  try {
    totalItems = await ApprovedNum.totalItems()
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting Count Approved Nums.',
      description,
      error
    })
  }
  try {
    approvedNums = await ApprovedNum.getApprovedNums(options)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting All Approved Nums.',
      description,
      error
    })
  }
  const lastPage = Math.ceil(totalItems / options.results)
  const response = {
    data: approvedNums,
    total: totalItems,
    page: options.page,
    perPage: options.results,
    lastPage
  }
  return res.status(200).json(response)
}

export const getApprovedNum = async (req, res, next) => {
  try {
    const approvedNum = await ApprovedNum.getApprovedNum(req.params.id)
    return res.status(200).json(approvedNum)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while getting Approved Num.',
      description,
      error
    })
  }
}

export const createApprovedNum = async (req, res, next) => {
  try {
    const approvedNum = await ApprovedNum.createApprovedNum(req.body)
    return res.status(200).json(approvedNum)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Creating Approved Num.',
      description,
      error
    })
  }
}

export const updateApprovedNum = async (req, res, next) => {
  try {
    const approvedNum = await ApprovedNum.updateApprovedNum(req.body)
    return res.status(200).json(approvedNum)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while updating Approved Num.',
      description,
      error
    })
  }
}

export const deleteApprovedNum = async (req, res, next) => {
  try {
    const approvedNum = await ApprovedNum.deleteApprovedNum(req.body)
    return res.status(200).json(approvedNum)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while deleting Approved Num.',
      description,
      error
    })
  }
}
