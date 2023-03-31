import reactLogo from './assets/react.svg'
import './App.css'
import { useEntropy } from './utils/useEntropy/useEntropy'
import { ALICE, CONSTRAINT, tx } from './utils/entropy-utils'
import React from 'react'
import { readKey } from './utils/readKey'

function App() {
  const entropy = useEntropy({ seed: ALICE.SEED })
  const [thresholdKeys, setThresholdKey] = React.useState<Uint8Array[]>([])
  const [error, setError] = React.useState<Error | null>(null)
  console.log('entropy', entropy)
  React.useEffect(() => {
    async function getThresholdKeys() {
      const keys = []
      try {
        for (let i = 0; i < 2; i++) {
          keys.push(readKey(`../utils/test-keys/${i}`))
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log('error', e)
          setError(e)
        }
      }

      const thresholdKeys = await Promise.all(keys)
      setThresholdKey(thresholdKeys)
    }
    getThresholdKeys()
  }, [])
  return (
    <div className='App'>
      <div>
        <a href='https://vitejs.dev' target='_blank' rel='noreferrer'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
        <a href='https://reactjs.org' target='_blank' rel='noreferrer'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Entropy.js SDK</h1>
      <div className='card'>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <button
          onClick={() => {
            const [thresholdKey, thresholdKey2] = thresholdKeys
            try {
              entropy.entropy?.register({
                keyShares: [thresholdKey, thresholdKey2],
                constraintModificationAccount: CONSTRAINT.modificationAccount,
                freeTx: false,
              })
            } catch (e) {
              if (e instanceof Error) {
                console.error('register failed')
                console.error('error', e)
              }
            }
          }}
        >
          register user
        </button>

        <button
          onClick={async () => {
            if (!entropy.entropy) return
            try {
              const signature = await entropy.entropy.sign(tx, false, 10)
              console.info('signature passed!', signature)
            } catch (e) {
              console.error('error', e)
            }
          }}
        >
          sign transaction
        </button>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
