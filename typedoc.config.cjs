/** @type {import('typedoc').TypeDocOptions} */

// see: https://typedoc.org/options/

module.exports = {
  entryPoints: ['./src'],
  entryPointStrategy: 'expand',
  plugin: [
    'typedoc-plugin-markdown'
  ],
  excludePrivate: true,
  excludeInternal: true,
  out: 'docs'
}
