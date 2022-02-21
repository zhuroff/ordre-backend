import { model, Schema, Types } from 'mongoose'

interface AuthToken {
  user: Types.ObjectId
  refreshToken: string
}

const TokenSchema: Schema<AuthToken> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  refreshToken: {
    type: String,
    required: true
  }
})

export const Token = model<AuthToken>('tokens', TokenSchema)
