/** @type {import('typedoc').TypeDocOptions} */

// see: https://typedoc.org/options/

module.exports = {
  tsconfig: './tsconfig.json',
  excludePrivate: true,
  excludeInternal: true,
  validation: {
    notExported: true,
    invalidLink: true,
    notDocumented: true
  },
  plugin: [
    '@mxssfd/typedoc-theme',
    'typedoc-plugin-rename-defaults'
  ],
  theme: 'my-theme',

  entryPoints: [
    'src/index.ts',
    // 'src/keys/index.ts',
    // 'src/utils/index.ts',
    // 'src/utils/crypto.ts'
  ],
  // entryPointStrategy: 'expand',

  out: './docs'
}
