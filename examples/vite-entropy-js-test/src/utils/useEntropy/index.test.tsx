import { renderHook } from '@testing-library/react-hooks'
import { useEntropy } from './useEntropy'
import Entropy from '../../../../../core'
import { vi, expect } from 'vitest'

describe('useEntropy', () => {
  it('returns the entropy, error, and loading state', async () => {
    const seed = 'my-random-seed'
    const { result } = renderHook(() => useEntropy({ seed }))

    expect(result.current.entropy).toBeUndefined()
    expect(result.current.error).toBeUndefined()
    expect(result.current.loading).toBe(true)
  })

  it('sets the error state if Entropy.setup throws an error', async () => {
    const seed = 'my-random-seed'
    const errorMessage = 'Something went wrong'
    vi.spyOn(Entropy, 'setup').mockRejectedValueOnce(new Error(errorMessage))
    const { result, waitForNextUpdate } = renderHook(() => useEntropy({ seed }))

    expect(result.current.entropy).toBeUndefined()
    expect(result.current.error).toBeUndefined()
    expect(result.current.loading).toBe(true)

    await waitForNextUpdate()

    expect(result.current.entropy).toBeUndefined()
    expect(result.current.error).toBe(errorMessage)
    expect(result.current.loading).toBe(false)
  })
})
