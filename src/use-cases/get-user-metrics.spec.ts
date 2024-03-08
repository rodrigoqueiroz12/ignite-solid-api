import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get user metrics use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins from metrics', async () => {
    await checkInsRepository.create({
      userId: 'user-1',
      gymId: 'gym-1',
    })

    await checkInsRepository.create({
      userId: 'user-1',
      gymId: 'gym-1',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-1',
    })

    expect(checkInsCount).toBe(2)
  })
})
