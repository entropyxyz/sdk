/** @type {import('typedoc').TypeDocOptions} */

// see: https://typedoc.org/options/

module.exports = {
  // NOTE: entryPoints reflects pakcage.json "exports"
  entryPoints: [
    'src/index.ts',
    'src/keys/index.ts',
  ],
  // entryPointStrategy: 'expand',

  out: './docs',

  tsconfig: './tsconfig.json',
  excludePrivate: true,
  // excludeInternal: true,
  validation: {
    notExported: true,
    invalidLink: true,
    notDocumented: true,
  },
  plugin: [
    'typedoc-plugin-markdown'
  ],
  /* typedoc-plugin-missing-exports:*/
  // internalModule: 'internal',
  // placeInternalsInOwningModule: true,
}
