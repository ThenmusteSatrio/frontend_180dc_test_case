import api from './api'

import type {RegisterPayload, LoginPayload} from '@/types/auth'

export const register = async (payload: RegisterPayload) => {
  const response = await api.post('/auth/register',
    {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      confirmPassword: payload.confirmPassword
    },
  )
  return response.data
}

export const login = async (payload: LoginPayload) => {
  const response = await api.post('/auth/login', payload)
  return response.data
}