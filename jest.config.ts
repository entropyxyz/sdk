import type { Config } from 'jest'
import { defaults } from 'jest-config'

const config: Config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 200000,
  modulePathIgnorePatterns: ['examples/'],
  verbose: true,
  forceExit: true,
  silent: false,
}

export default config
