import Country from '../models/Factory/CountryFactory.js'
import { config as dotenv } from 'dotenv'
import { handleSequelizeError } from './handleError/sequalizeError.js'
dotenv()

export const getCountries = async (req, res, next) => {
  // paginacion
  const options = {}
  options.results = req.query.results ?? 10
  options.page = req.query.page ?? 1
  let totalItems, countries
  try {
    totalItems = await Country.totalItems()
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting Count Countries.',
      description,
      error
    })
  }
  try {
    countries = await Country.getCountries(options)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting All Countries.',
      description,
      error
    })
  }
  const lastPage = Math.ceil(totalItems / options.results)
  const response = {
    data: countries,
    total: totalItems,
    page: options.page,
    perPage: options.results,
    lastPage
  }
  return res.status(200).json(response)
}

export const getCountry = async (req, res, next) => {
  try {
    const contry = await Country.getCountry(req.params.id)
    return res.status(200).json(contry)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while getting Country.',
      description,
      error
    })
  }
}

export const createCountry = async (req, res, next) => {
  try {
    const country = await Country.createCountry(req.body)
    return res.status(200).json(country)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Creating Country.',
      description,
      error
    })
  }
}

export const updateCountry = async (req, res, next) => {
  try {
    const country = await Country.updateCountry(req.body)
    return res.status(200).json(country)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while updating Country.',
      description,
      error
    })
  }
}

export const deleteCountry = async (req, res, next) => {
  try {
    const country = await Country.deleteCountry(req.body)
    return res.status(200).json(country)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while deleting Country.',
      description,
      error
    })
  }
}
