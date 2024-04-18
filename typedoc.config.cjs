/** @type {import('typedoc').TypeDocOptions} */

// see: https://typedoc.org/options/

module.exports = {
  tsconfig: './tsconfig.json',
  excludePrivate: true,
  excludeInternal: true,
  plugin: [
    '@mxssfd/typedoc-theme'
  ],
  theme: 'my-theme',

  entryPoints: [
    './src/index.ts'
    // './src/keys/index.ts'
  ],
  // entryPointStrategy: 'expand',

  out: './docs'
}
