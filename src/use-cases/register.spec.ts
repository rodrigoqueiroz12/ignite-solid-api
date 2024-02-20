/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { RegisterUseCase } from './register'

describe('Register use case', () => {
  it('should has user password upon registration', async () => {
    const registerUseCase = new RegisterUseCase({
      async findByEmail(_) {
        return null
      },

      async create({ name, email, password_hash }) {
        return {
          name,
          email,
          id: 'sasd',
          created_at: new Date(),
          password_hash,
        }
      },
    })

    const { user } = await registerUseCase.execute({
      name: 'Rodrigo',
      email: 'teste@teste1.com',
      password: '12345678',
    })

    const isPasswordCorrectlyHashed = await compare(
      '12345678',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
