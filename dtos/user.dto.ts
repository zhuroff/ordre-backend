import { Types } from 'mongoose'
import { UserModel } from '~/types/user.types'

export interface IUserDTO {
  email: string
  id: Types.ObjectId
}

export class UserDTO implements IUserDTO {
  email
  id

  constructor(model: UserModel & { _id: Types.ObjectId }) {
    this.email = model.email
    this.id = model._id
  }
}
