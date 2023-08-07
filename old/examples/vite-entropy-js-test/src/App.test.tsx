import { render, screen } from './utils/test-utils'
import App from './App'

it.skip('Should return App with entropy hook', async () => {
  render(<App />)

  expect(
    screen.getByRole('heading', {
      name: 'Entropy.js SDK',
      level: 1,
    })
  ).toBeDefined()
})
