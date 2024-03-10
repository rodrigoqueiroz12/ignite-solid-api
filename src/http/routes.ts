import { FastifyInstance } from 'fastify'

import { authenticate } from './controllers/authenticate'
import { me } from './controllers/me'
import { register } from './controllers/register'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  /* Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, me)
}
