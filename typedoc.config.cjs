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
    '@mxssfd/typedoc-theme',
    'typedoc-plugin-rename-defaults',
    'typedoc-plugin-merge-modules',
    // 'typedoc-plugin-missing-exports',
  ],
  /* typedoc-plugin-missing-exports:*/
  // internalModule: 'internal',
  // placeInternalsInOwningModule: true,

  /* typedoc-plugin-merge-modules: */
  mergeModulesRenameDefaults: true,
  mergeModulesMergeMode: 'project',

  theme: 'my-theme',
}
