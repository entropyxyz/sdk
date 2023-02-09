import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['core/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es6',
  minify: options.minify,
  watch: options.watch,
}))
