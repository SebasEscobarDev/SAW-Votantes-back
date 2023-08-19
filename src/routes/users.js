import { Router } from 'express'
import { body } from 'express-validator'
import {
  getAll,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  login
} from '../controllers/users.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
const router = Router()

router.get('/', getAll)

router.get('/:id', validateToken, getItem)

router.post('/', [
  body([
    'name',
    'email',
    'password',
    'birth_date'
  ], 'field is required.').notEmpty().escape().trim().isLength({ min: 3 })
], validateFields, createItem)
// ruta protegida
router.patch('/', validateToken, updateItem)

// delete protegida
router.delete('/', validateToken, deleteItem)

// LOGIN
router.post('/login', [
  body('email', 'Invalid Email Number')
    .notEmpty()
    .trim(),
  body('password', 'The Password must be of minimum 4 characters length')
    .notEmpty()
    .trim()
    .isLength({ min: 4 })
], validateFields, login)

export default router
