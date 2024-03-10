import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Me E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get the user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password: 'password',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'john.doe@mail.com',
      password: 'password',
    })

    const { token } = authResponse.body

    const meResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(meResponse.statusCode).toBe(200)
    expect(meResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'john.doe@mail.com',
      }),
    )
  })
})
