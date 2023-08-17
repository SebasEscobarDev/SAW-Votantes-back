import { Router } from 'express'
import { body } from 'express-validator'
import {
  getAgents,
  createAgent,
  getAgent,
  updateAgent,
  deleteAgent
} from '../controllers/agents.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
const router = Router()

router.get('/', validateToken, getAgents)

router.get('/:id', validateToken, getAgent)

router.post('/', [
  body([
    'fullphone',
    'name',
    'receive'
  ], 'field is required.').notEmpty().escape().trim().isLength({ min: 3 }),
  body('active', 'Receive field is required.').notEmpty().isLength({ min: 1 })
], validateToken, validateFields, createAgent)

router.patch('/', validateToken, updateAgent)

router.delete('/', validateToken, deleteAgent)

export default router
