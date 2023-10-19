import { Router } from 'express'
import { body } from 'express-validator'
import {
  getAll,
  createItem,
  getItem,
  updateItem,
  deleteItem
} from '../controllers/surveys.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
const router = Router()

router.get('/', validateToken, getAll)

router.get('/:id', validateToken, getItem)

router.post('/', [
  body([
    'code',
    'txtInicio',
    'txtWelcome',
    'txtYes',
    'txtNo',
    'txtEnd'
  ], 'field is required.').notEmpty().escape().trim()
], validateToken, validateFields, createItem)

router.patch('/', validateToken, updateItem)

router.delete('/', validateToken, deleteItem)

export default router
