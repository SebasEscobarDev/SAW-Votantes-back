import { Router } from 'express'
import { body } from 'express-validator'
import {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact
} from '../controllers/contacts.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
const router = Router()

router.get('/', validateToken, getContacts)

router.get('/:id', validateToken, getContact)

router.post('/', [
  body([
    'from',
    'device_type',
    'country_code',
    'full_phone',
    'formatted_phone',
    'name',
    'pushname',
    'avatar',
    'historial'
  ], 'field is required.').notEmpty().escape().trim().isLength({ min: 3 })
], validateToken, validateFields, createContact)

router.patch('/', validateToken, updateContact)

router.delete('/', validateToken, deleteContact)

export default router
