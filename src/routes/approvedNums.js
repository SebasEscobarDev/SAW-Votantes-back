import { Router } from 'express'
import { body } from 'express-validator'
import {
  getApprovedNums,
  getApprovedNum,
  createApprovedNum,
  updateApprovedNum,
  deleteApprovedNum
} from '../controllers/approvedNums.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
const router = Router()

router.get('/', validateToken, getApprovedNums)

router.get('/:id', validateToken, getApprovedNum)

router.post('/', [
  body(['fullphone'], 'Field is required.').notEmpty().escape().trim().isLength({ min: 7 })
], validateToken, validateFields, createApprovedNum)

router.patch('/', [
  body(['fullphone'], 'Field is required.').notEmpty().escape().trim().isLength({ min: 7 })
], validateToken, updateApprovedNum)

router.delete('/', validateToken, deleteApprovedNum)

export default router
