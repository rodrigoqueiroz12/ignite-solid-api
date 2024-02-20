import { hash } from 'bcryptjs'

import { prisma } from '@/lib/prisma'

interface RegisterUseCaseProps {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  private usersRepository: any

  constructor(usersRepository: any) {
    this.usersRepository = usersRepository
  }

  async execute({ name, email, password }: RegisterUseCaseProps) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new Error('E-mail already exists')
    }

    const passwordHash = await hash(password, 6)

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })
  }
}
