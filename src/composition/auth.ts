import { loginUseCaseFactory, registerUseCaseFactory } from '@/aplication/use-cases/auth'
import { authRepository } from '@/infrastructure/repositories/auth'

export const loginUseCase = loginUseCaseFactory(authRepository)
export const registerUseCase = registerUseCaseFactory(authRepository)
