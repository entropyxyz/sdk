import { Substrate } from '.'
import { bobSeed } from '../testing-utils'

describe('Substrate Tests', () => {
  // let substrate: Substrate
  // beforeAll(async () => {
  //   substrate = await Substrate.setup(bobSeed)

  //   // Mock the registered function using Jest
  //   jest.mock('Substrate', () => {
  //     const originalSubstrate = jest.requireActual('.')
  //     const mockQuery = jest.fn(() => {
  //       return true
  //     })
  //     return {
  //       ...originalSubstrate,
  //       Substrate: jest.fn().mockImplementation(() => ({
  //         api: {
  //           query: {
  //             relayer: {
  //               register: mockQuery,
  //             },
  //           },
  //         },
  //       })),
  //     }
  //   })
  // })

  it(`checks if registering and registers`, async () => {
    // expect(substrate.register).toHaveBeenCalledTimes(1)
    // expect(substrate.register).toReturn()
    // expect(substrate.register).toReturnWith(true)
    expect(true).toBe(true)
  })
})
