import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '~/controllers/auth.controller'

const router = Router()

router.post(
  '/registration',
  body('email').isLength({ min: 3, max: 30 }),
  body('password').isLength({ min: 8, max: 30 }),
  AuthController.registration
)

router.post('/login', AuthController.login)
router.get('/refresh', AuthController.refresh)

export default router
