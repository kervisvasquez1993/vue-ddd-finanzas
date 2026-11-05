import { loginUseCaseFactory, registerUseCaseFactory } from '@/modules/auth/aplication/use-cases'
import { authRepository } from '@/modules/auth/infrastructure/repositories'

export const loginUseCase = loginUseCaseFactory(authRepository)
export const registerUseCase = registerUseCaseFactory(authRepository)
