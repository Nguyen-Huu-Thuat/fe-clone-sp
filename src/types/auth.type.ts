import { User } from './user.type'
import { SuccessResponse } from './utils.type'

export type AuthResponse = SuccessResponse<{
  refresh_token: string
  access_token: string
  expires: string
  user: User
  expires_refresh_token: string
}>

export type RefreshTokenResponse = SuccessResponse<{ access_token: string }>
