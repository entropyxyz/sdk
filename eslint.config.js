import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

const errorLater = new Date() > new Date('2024-06-10') ? 'error' : 'off'
// NOTE: (mix) someone is gonna get a nasty surpise *next* month :D

export default tseslint.config(
  // new .eslintignore
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'docs/**',
      'substrate-generated-types/**',
      'eslint.config.js' // :D
    ]
  },

  // base
  eslint.configs.recommended,

  // typed linting
  // - https://typescript-eslint.io/getting-started/typed-linting
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
        // WARN: import.meta.dirname is only present for ESM files in Node.js >=20.11.0 / >= 21.2.0.
      }
    }
  },

  // relax any rules
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': errorLater,
      '@typescript-eslint/no-unsafe-argument': errorLater,
      '@typescript-eslint/no-unsafe-assignment': errorLater,
      '@typescript-eslint/no-unsafe-call': errorLater,
      '@typescript-eslint/no-unsafe-member-access': errorLater,
      '@typescript-eslint/no-unsafe-return': errorLater,
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'warn'
    }
  },

  // chill ts rules our in tests
  {
    files: ['tests/**/*.ts'],
    ...tseslint.configs.disableTypeChecked
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': errorLater
    }
  }
)
