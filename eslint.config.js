import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

// WIP: https://typescript-eslint.io/getting-started/typed-linting

export default tseslint.config(
  {
    ignores: [
      'eslint.config.js', // :D
      'dist/**/*.js',
      'docs/**/*.js',
      'substrate-generated-types/**/*.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  prettierConfig,
)
