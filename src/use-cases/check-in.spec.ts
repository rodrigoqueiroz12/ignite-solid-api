import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { CheckInUseCase } from './check-in'

let checkInRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in use case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice a day', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 0, 0, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice, but in a day in different day', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 0, 0, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })

    vi.setSystemTime(new Date(2024, 0, 2, 0, 0, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
