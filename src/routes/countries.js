import { Router } from 'express'
import { body } from 'express-validator'
import {
  getCountries,
  createCountry,
  getCountry,
  updateCountry,
  deleteCountry
} from '../controllers/countries.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
const router = Router()

router.get('/', validateToken, getCountries)

router.get('/:id', validateToken, getCountry)

router.post('/', [
  body(['name', 'country_code'], 'Field is required.').notEmpty().escape().trim().isLength({ min: 1 })
], validateToken, validateFields, createCountry)

router.patch('/', validateToken, updateCountry)

router.delete('/', validateToken, deleteCountry)

export default router
