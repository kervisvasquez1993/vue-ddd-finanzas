export interface UserResponse {
  id: string
  name: string
  email: string
}

export interface LoginResponse {
  accessToken: string
  user: UserResponse
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}
