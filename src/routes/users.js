import { Router } from 'express'
import { body } from 'express-validator'
import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  login
} from '../controllers/users.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
const router = Router()

router.get('/', getUsers)

router.get('/:id', validateToken, getUser)

router.post('/', [
  body([
    'name',
    'email',
    'password',
    'birth_date'
  ], 'field is required.').notEmpty().escape().trim().isLength({ min: 3 }),
  body('connected', 'field is required.').isBoolean()
], validateFields, createUser)
// ruta protegida
router.patch('/', validateToken, updateUser)

// delete protegida
router.delete('/', validateToken, deleteUser)

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
