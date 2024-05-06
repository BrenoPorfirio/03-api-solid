import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('shoud be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .get('/gyms')
      .set('/Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: 'Some description',
        phone: '1199999999',
        latitude: -27.0610928,
        longitude: -49.5229501,
      })

    await request(app.server)
      .get('/gyms')
      .set('/Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym',
        description: 'Some description',
        phone: '1199999999',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -27.0610928,
        longitude: -49.5229501,
      })
      .set('/Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym',
      }),
    ])
  })
})
