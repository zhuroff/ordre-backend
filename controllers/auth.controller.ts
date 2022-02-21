import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { ApiError } from '~/exceptions/api-errors'
import authServices from '~/services/auth.services'

export class AuthController {
  static async registration(req: Request, res: Response, next: (error: unknown) => void) {
    try {
      const errors = validationResult(req)
      console.log(errors)

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
      }

      const { email, password } = req.body
      const userData = await authServices.registration({ email, password })

      res.cookie(
        'refreshToken',
        userData?.refreshToken,
        {
          maxAge: 30 * 24 + 60 * 60 * 1000,
          httpOnly: true ,
          secure: process.env['NODE_ENV'] === 'production'
        }
      )

      res.status(201).json(userData)
    } catch (error) {
      next(error)
    }
  }
}
