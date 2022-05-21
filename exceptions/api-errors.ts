import { ValidationError } from 'express-validator'

export class ApiError extends Error {
  status: number
  message: string
  errors: ValidationError[]

  constructor(
    status: number,
    message: string,
    errors: ValidationError[] = []
  ) {
    super(message)

    this.status = status
    this.message = message
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ApiError(401, 'user:unauth')
  }

  static BadRequest(message: string, errors?: ValidationError[]) {
    return new ApiError(400, message, errors)
  }
}
