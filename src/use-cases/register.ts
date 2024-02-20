import { hash } from 'bcryptjs'

import type { UsersRepository } from '@/repositories/users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseProps {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async execute({ name, email, password }: RegisterUseCaseProps) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })
  }
}
