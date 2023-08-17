import Contact from '../models/Factory/ContactFactory.js'
import { config as dotenv } from 'dotenv'
import { handleSequelizeError } from './handleError/sequalizeError.js'
dotenv()

export const getContacts = async (req, res, next) => {
  // paginacion
  const options = {}
  options.results = req.query.results ?? 10
  options.page = req.query.page ?? 1
  let totalItems, contacts
  try {
    totalItems = await Contact.totalItems()
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting total Items.',
      description,
      error
    })
  }
  try {
    contacts = await Contact.getContacts(options)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Getting all Contacts.',
      description,
      error
    })
  }
  const lastPage = Math.ceil(totalItems / options.results)
  const response = {
    data: contacts,
    total: totalItems,
    page: options.page,
    perPage: options.results,
    lastPage
  }
  return res.status(200).json(response)
}

export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.getContact(req.params.id)
    return res.status(200).json(contact)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while getting Contact.',
      description,
      error
    })
  }
}

export const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.createContact(req.body)
    return res.status(200).json(contact)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while Creating Contact.',
      description,
      error
    })
  }
}

export const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.updateContact(req.body)
    return res.status(200).json(contact)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while updating Contact.',
      description,
      error
    })
  }
}

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.deleteContact(req.body)
    return res.status(200).json(contact)
  } catch (e) {
    const { description, error } = handleSequelizeError(e)
    return res.status(500).json({
      message: 'Error while deleting contact.',
      description,
      error
    })
  }
}
