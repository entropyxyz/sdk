import reactLogo from './assets/react.svg'
import './App.css'
import { useEntropy } from './utils/useEntropy/useEntropy'
import {
  ALICE,
  CHARLIE,
  non_whitelisted_test_tx_req,
} from './utils/entropy-utils'
import { readKey } from './utils/readKey'
import React from 'react'
const thresholdKeyPath = './utils/test-keys/0'
const thresholdKey2Path = './utils/test-keys/1'

function App() {
  const entropy = useEntropy({ seed: ALICE.SEED })
  const [thresholdKeys, setThresholdKeys] = React.useState<Uint8Array[]>([])
  console.log('entropy', entropy)
  React.useEffect(() => {
    async function setup() {
      try {
        const thresholdKey = await readKey(thresholdKeyPath)
        const thresholdKey2 = await readKey(thresholdKey2Path)
        setThresholdKeys([thresholdKey, thresholdKey2])
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message)
        }
      }
    }
    setup()
  }, [])
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
      <button
        onClick={() => {
          entropy.register({
            keyShares: thresholdKeys,
            constraintModificationAccount: CHARLIE.STASHED_ADDRESS,
            freeTx: false,
          })
        }}
      >
        register
      </button>
      <button
        onClick={() => {
          entropy.sign({
            tx: non_whitelisted_test_tx_req,
            freeTx: false,
            retries: 3,
          })
        }}
      >
        sign
      </button>
    </div>
  )
}

export default App
