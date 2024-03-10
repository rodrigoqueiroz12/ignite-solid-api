import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'

import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'

export const me = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.jwtVerify()

  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
