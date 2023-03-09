import React from 'react'
// For example app, it makes sense to import from the root of the package
// At least just to double check for sanity that we didn't break anything
import Entropy from '../../../../../core'
import { readKey } from '../../../../../core/utils'

/**
 * @alpha
 *
 * @remarks
 * This is an alpha version of the useEntropy hook.
 *
 * @param {string} seed - The seed to use for entropy generation.
 * @return {*} {{@link Entropy} | undefined | string | boolean}
 */
export function useEntropy({
  seed,
  keyShares,
}: {
  seed: string
  keyShares: Uint8Array[]
}) {
  const [entropy, setEntropy] = React.useState<Entropy>()
  const [error, setError] = React.useState<string>()
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    async function setup() {
      try {
        const result = await Entropy.setup(seed)
        setLoading(false)
        setEntropy(result)
      } catch (error: unknown) {
        if (error instanceof Error) {
          setLoading(false)
          setError(error.message)
          console.error(error.message)
        }
      }
    }

    setup()

    return () => {
      if (entropy) {
        entropy.substrate.api.disconnect()
      }
    }
  }, [])

  const register = async ({
    initialConstraints,
    constraintModificationAccount,
    freeTx,
  }: {
    initialConstraints?: string
    constraintModificationAccount: string
    freeTx?: boolean | undefined
  }) => {
    if (!entropy) {
      throw new Error('Entropy is not initialized')
    }

    await entropy.register({
      keyShares: keyShares,
      constraintModificationAccount,
      initialConstraints,
      freeTx: freeTx ?? false,
    })
  }

  return { entropy, error, loading, register }
}
