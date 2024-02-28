import { randomUUID } from 'node:crypto'

import { CheckIn, Prisma } from '@prisma/client'

import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID() as string,
      userId: data.userId,
      gymId: data.gymId,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findUserByIdOnDate(userId: string, date: Date) {
    const checkInOnSameDay = this.items.find(
      (checkIn) => checkIn.userId === userId,
    )

    if (!checkInOnSameDay) {
      return null
    }

    return checkInOnSameDay
  }
}
