import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { authenticate } from './authenticate'
import { me } from './me'
import { register } from './register'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  /* Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, me)
}
