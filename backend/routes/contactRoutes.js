import express from 'express'
import { body } from 'express-validator'
import { handleContact } from '../controllers/contactController.js'

const router = express.Router()

router.post('/api/contact', [
  body('name').isLength({ min: 1 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').isLength({ min: 5 }).trim().escape()
], handleContact)

export default router
