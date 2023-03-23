import type { Config } from 'jest'
import { defaults } from 'jest-config'

const config: Config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 100000,
  modulePathIgnorePatterns: ['examples/'],
  verbose: false,
  forceExit: true,
  silent: false,
}

export default config
