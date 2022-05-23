import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '~/controllers/auth.controller'

const router = Router()

router.post(
  '/registration',
  body('email')
    .isEmail()
    .withMessage('invalid'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('invalid:small')
    .isLength({ max: 30 })
    .withMessage('invalid:huge'),
  body('passwordConfirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('invalid')
      }

      return true
    }),
  AuthController.registration
)

router.post('/login', AuthController.login)
router.get('/refresh', AuthController.refresh)

export default router
