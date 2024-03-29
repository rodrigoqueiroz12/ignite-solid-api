import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Me E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get the user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)

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
