import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  private checkInsRepository: CheckInsRepository
  private gymsRepository: GymsRepository

  constructor(
    checkInsRepository: CheckInsRepository,
    gymsRepository: GymsRepository,
  ) {
    this.checkInsRepository = checkInsRepository
    this.gymsRepository = gymsRepository
  }

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error()
    }

    const checkIn = await this.checkInsRepository.create({
      userId,
      gymId,
    })

    return {
      checkIn,
    }
  }
}
