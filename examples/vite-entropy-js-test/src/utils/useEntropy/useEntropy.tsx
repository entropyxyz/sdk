import React from 'react'
// For example app, it makes sense to import from the root of the package
// At least just to double check for sanity that we didn't break anything
import Entropy from '../../../../../core'
import { readKey } from '../readKey'
import { CONSTRAINT } from '../entropy-utils'

/**
 * @alpha
 *
 * @remarks
 * This is an alpha version of the useEntropy hook.
 *
 * @param {string} seed - The seed to use for entropy generation.
 * @return {*} {{@link Entropy} | undefined | string | boolean}
 */
export function useEntropy({ seed }: { seed: string }) {
  const [entropy, setEntropy] = React.useState<Entropy>()
  const [error, setError] = React.useState<string>()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [thresholdKeys, setThresholdKeys] = React.useState<Uint8Array[]>([])

  React.useEffect(() => {
    async function setup() {
      try {
        const result = await Entropy.setup(seed)
        setLoading(false)
        setEntropy(result)
        const key1 = await readKey('../../utils/test-keys/0')
        const key2 = await readKey('../../utils/test-keys/1')
        setThresholdKeys([key1, key2])
      } catch (error: unknown) {
        if (error instanceof Error) {
          setLoading(false)
          setError(error.message)
          console.error(error.message)
        }
      }
    }
    setup()
  }, [])
  const register = React.useCallback(async () => {
    if (entropy) {
      const [thresholdKey, thresholdKey2] = thresholdKeys
      const res = await entropy.register({
        keyShares: [thresholdKey, thresholdKey2],
        constraintModificationAccount: CONSTRAINT.modificationAccount,
        freeTx: false,
      })
    }
  }, [])
  // const register = React.useCallback(async () => {
  //   await readKey('../../utils/')

  //   const [thresholdKey, thresholdKey2] = thresholdKeys
  //   if (entropy?.entropy?.register) {
  //     entropy.entropy?.register({
  //       keyShares: [thresholdKey, thresholdKey2],
  //       constraintModificationAccount: CONSTRAINT.modificationAccount,
  //       freeTx: false,
  //     })
  //   }
  //   //   }
  //   // }
  // }, [])

  return { entropy, error, loading, register }
}
