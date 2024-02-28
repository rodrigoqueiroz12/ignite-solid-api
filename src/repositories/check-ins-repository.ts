import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedUpdateInput): Promise<CheckIn>

  findUserByIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
