import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { Authentication } from '~/types/auth.types'
import authServices from '~/services/auth.services'

export class AuthController {
  static async registration(req: Request, res: Response) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        throw errors.array()
      }
      
      const { email, password }: Authentication = req.body
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
      res.status(400).json(error)
    }
  }

  static async login(req: Request, res: Response, next: (error: unknown) => void) {
    try {
      const { email, password }: Authentication = req.body
      const userData = await authServices.login({ email, password })

      res.cookie(
        'refreshToken',
        userData?.refreshToken,
        {
          maxAge: 30 * 24 + 60 * 60 * 1000,
          httpOnly: true ,
          secure: process.env['NODE_ENV'] === 'production'
        }
      )

      res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  static async refresh(req: Request, res: Response, next: (error: unknown) => void) {
    try {
      const { refreshToken } = req.cookies
      const userData = await authServices.refresh(refreshToken)

      res.cookie(
        'refreshToken',
        userData?.refreshToken,
        {
          maxAge: 30 * 24 + 60 * 60 * 1000,
          httpOnly: true ,
          secure: process.env['NODE_ENV'] === 'production'
        }
      )

      res.json(userData)
    } catch (error) {
      next(error)
    }
  }
}
