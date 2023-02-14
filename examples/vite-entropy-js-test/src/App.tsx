import reactLogo from './assets/react.svg'
import './App.css'
import { useEntropy } from './utils/useEntropy/useEntropy'
import { ALICE } from './utils/entropy-utils'
import React from 'react'

function App() {
  const entropy = useEntropy({ seed: ALICE.SEED })
  console.log('entropy', entropy)
  return (
    <div className='App'>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
        <a href='https://reactjs.org' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Entropy.js SDK</h1>
      <div className='card'>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
