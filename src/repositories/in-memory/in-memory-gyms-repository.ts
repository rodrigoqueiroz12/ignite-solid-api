import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(gymId: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === gymId)

    if (!gym) return null

    return gym
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.items.push(gym)

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await this.items
      .filter((item) =>
        item.title
          .trim()
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()),
      )
      .slice((page - 1) * 20, page * 20)

    return gyms
  }
}
