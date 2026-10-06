export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: number | string
  username: string
  password: string
  name: string
  role: string
}
