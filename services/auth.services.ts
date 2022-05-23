import { ApiError } from '~/exceptions/api-errors'
import { User } from '~/models/user.model'
import { Registration, Authentication } from '~/types/auth.types'
import { UserDTO } from '~/dtos/user.dto'
import bcrypt from 'bcrypt'
import tokenService from './token.service'

class AuthService {
  async registration({ email, password }: Registration) {
    const candidate = await User.findOne({ email })

    if (candidate) {
      throw ApiError.BadRequest('user:exist')
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
      throw ApiError.BadRequest('user:unexist')
    }

    const isPasswordsEquals = await bcrypt.compare(password, dbUser.password)

    if (!isPasswordsEquals) {
      throw ApiError.BadRequest('user:unexist')
    }

    const userDTO = new UserDTO(dbUser)
    const tokens = tokenService.generateTokens({ ...userDTO })

    await tokenService.saveToken(userDTO.id, tokens.refreshToken)

    return { ...tokens, user: userDTO }
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }

    const userData = tokenService.validateRefreshToken(refreshToken)
    const dbToken = await tokenService.findToken(refreshToken)

    if (!userData || !dbToken) {
      throw ApiError.UnauthorizedError()
    }

    const dbUser = await User.findById(userData['id'])

    if (!dbUser) {
      throw ApiError.UnauthorizedError()
    }

    const userDTO = new UserDTO(dbUser)
    const tokens = tokenService.generateTokens({ ...userDTO })

    await tokenService.saveToken(userDTO.id, tokens.refreshToken)

    return { ...tokens, user: userDTO }
  }
}

export default new AuthService()
