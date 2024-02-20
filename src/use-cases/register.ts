import { User } from '@prisma/client'
import { hash } from 'bcryptjs'

import type { UsersRepository } from '@/repositories/users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseProps {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseProps): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })

    return {
      user,
    }
  }
}
