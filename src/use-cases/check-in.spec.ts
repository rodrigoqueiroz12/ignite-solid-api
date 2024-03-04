import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInUseCase } from './check-in'

let checkInRepository: InMemoryCheckInsRepository
let gymRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in use case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymRepository)

    gymRepository.items.push({
      id: 'gym-1',
      title: 'gym',
      description: '',
      latitude: new Decimal(-14.239424),
      longitude: new Decimal(-53.186502),
      phone: '',
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
    ).rejects.toBeInstanceOf(Error)
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
    gymRepository.items.push({
      id: 'gym-2',
      title: 'gym',
      description: '',
      latitude: new Decimal(-0.710781),
      longitude: new Decimal(-47.701232),
      phone: '',
    })

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-2',
        userLatitude: -0.626525,
        userLongitude: -47.6381069,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
