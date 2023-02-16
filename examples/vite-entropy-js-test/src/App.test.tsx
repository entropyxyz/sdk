import { render, screen } from './utils/test-utils'
import App from './App'

it('Should return posts when clicking fetch button', async () => {
  render(<App />)

  expect(
    screen.getByRole('heading', {
      name: 'Entropy.js SDK',
      level: 1,
    })
  ).toBeDefined()
})
