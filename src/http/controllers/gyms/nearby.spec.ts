import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby gyms E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '99 9 9999-9999',
        latitude: -5.1239528,
        longitude: -42.8045741,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description',
        phone: '99 9 9999-9999',
        latitude: -27.0610928,
        longitude: -49.5229501,
      })

    const res = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({ latitude: -5.1239528, longitude: -42.8045741 })

    expect(res.statusCode).toBe(200)
    expect(res.body.gyms).toHaveLength(1)
    expect(res.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
