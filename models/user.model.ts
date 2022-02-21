import { model, Schema } from 'mongoose'
import { UserModel } from '~/types/user.types'

// export interface IUser extends UserModel {
//   _id: Types.ObjectId
// }

const UserSchema: Schema<UserModel> = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  }
})

export const User = model<UserModel>('users', UserSchema)
