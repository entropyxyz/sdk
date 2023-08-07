import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['core/index.ts'],
    replaceNodeEnv: true,
    format: ['esm'],
    external: ['dotenv', 'node:fs', 'fs', '**/*.test.ts', 'core/utils.ts'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es6',
    minify: options.minify,
    watch: options.watch,
  }
})
