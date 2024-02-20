import { hash } from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

interface RegisterUseCaseProps {
  name: string
  email: string
  password: string
}

export const registerUseCase = async ({
  name,
  email,
  password,
}: RegisterUseCaseProps) => {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('E-mail already exists')
  }

  const passwordHash = await hash(password, 6)

  const prismaUsersRepository = new PrismaUsersRepository()

  prismaUsersRepository.create({
    name,
    email,
    password_hash: passwordHash,
  })
}
