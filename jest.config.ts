import type { Config } from 'jest'
import { defaults } from 'jest-config'

const config: Config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 200000,
  modulePathIgnorePatterns: [],
  verbose: false,
  forceExit: true,
  silent: true,
}

export default config
