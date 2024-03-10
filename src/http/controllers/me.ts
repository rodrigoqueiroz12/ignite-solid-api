import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'

export const me = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.jwtVerify()

  return reply.status(200).send()
}
