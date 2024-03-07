import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in use case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-1',
      title: 'gym',
      description: null,
      latitude: -14.239424,
      longitude: -53.186502,
      phone: null,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -14.239424,
      userLongitude: -53.186502,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice a day', async () => {
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-01',
      userLatitude: -14.239424,
      userLongitude: -53.186502,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-1',
        userId: 'user-01',
        userLatitude: -14.239424,
        userLongitude: -53.186502,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice, but in a day in different day', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 0, 0, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -14.239424,
      userLongitude: -53.186502,
    })

    vi.setSystemTime(new Date(2024, 0, 2, 0, 0, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -14.239424,
      userLongitude: -53.186502,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-2',
      title: 'gym',
      description: null,
      latitude: -0.710781,
      longitude: -47.701232,
      phone: null,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-2',
        userLatitude: -0.626525,
        userLongitude: -47.6381069,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
