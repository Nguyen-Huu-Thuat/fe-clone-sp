import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/https'

const authApi = {
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body),

  login: (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body),

  logout: () => http.post('/logout')
}

export default authApi
