import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Authenticate E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password: 'password',
    })

    const authRes = await request(app.server).post('/sessions').send({
      email: 'john.doe@mail.com',
      password: 'password',
    })

    expect(authRes.statusCode).toBe(200)
    expect(authRes.body).toEqual({
      token: expect.any(String),
    })
  })
})
