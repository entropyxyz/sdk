import reactLogo from './assets/react.svg'
import './App.css'
import { useEntropy } from './utils/useEntropy/useEntropy'
import { ALICE } from './utils/entropy-utils'
import { readKey } from '../../../core/utils'
import React from 'react'

function App() {
  const [keyShares, setKeyShares] = React.useState<Uint8Array[]>([])
  React.useEffect(() => {
    async function setupKeyShares() {
      const thresholdKey0 = await readKey('./0')
      const thresholdKey1 = await readKey('./1')
      setKeyShares([thresholdKey0, thresholdKey1])
    }
    setupKeyShares()
  }, [])
  const { entropy, register } = useEntropy({ seed: ALICE.SEED, keyShares })

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
      <button
        onClick={() =>
          register({
            freeTx: true,
            constraintModificationAccount:
              '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
          })
        }
      >
        Register
      </button>
      <p className='read-the-docs'></p>
    </div>
  )
}

export default App
