/** @type {import('typedoc').TypeDocOptions} */

// see: https://typedoc.org/options/

module.exports = {
  tsconfig: './tsconfig.json',
  excludePrivate: true,
  excludeInternal: true,
  validation: {
    notExported: true,
    invalidLink: true,
    notDocumented: true,
  },
  plugin: [
    '@mxssfd/typedoc-theme',
    'typedoc-plugin-rename-defaults',
    // 'typedoc-plugin-missing-exports'
  ],
  /* typedoc-plugin-missing-exports config */
  // internalModule: 'internal',
  // placeInternalsInOwningModule: true,

  theme: 'my-theme',

  // NOTE: entryPoints reflects pakcage.json "exports"
  entryPoints: [
    'src/index.ts',
    'src/keys/index.ts',
    'src/keys/utils.ts',
    'src/utils/crypto.ts',
    'src/utils/index.ts',
  ],
  // entryPointStrategy: 'expand',

  out: './docs',
}
