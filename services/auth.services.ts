import { ApiError } from '~/exceptions/api-errors'
import { User } from '~/models/user.model'
import { Authentication } from '~/types/auth.types'
import bcrypt from 'bcrypt'
import { UserDTO } from '~/dtos/user.dto'
import tokenService from './token.service'

class AuthService {
  async registration({ email, password }: Authentication) {
    const candidate = await User.findOne({ email })

    if (candidate) {
      throw ApiError.BadRequest('Пользователь с таким email уже существует')
    }

    const hashPassword = await bcrypt.hash(password, 3)
    const user = await User.create({ email, password: hashPassword })
    const userDTO = new UserDTO(user)
    const tokens = tokenService.generateTokens({ ...userDTO })
    
    await tokenService.saveToken(userDTO.id, tokens.refreshToken)

    return { ...tokens, user: userDTO }
  }

  async login({ email, password }: Authentication) {
    const dbUser = await User.findOne({ email })

    if (!dbUser) {
      throw ApiError.BadRequest('Пользователя с указанной парой логин/пароль не существует')
    }

    const isPasswordsEquals = await bcrypt.compare(password, dbUser.password)

    if (!isPasswordsEquals) {
      throw ApiError.BadRequest('Пользователя с указанной парой логин/пароль не существует')
    }

    const userDTO = new UserDTO(dbUser)
    const tokens = tokenService.generateTokens({ ...userDTO })

    await tokenService.saveToken(userDTO.id, tokens.refreshToken)

    return { ...tokens, user: userDTO }
  }
}

export default new AuthService()
