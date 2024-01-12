import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: [`src/index.ts`, 'src/keys/index.ts', 'src/utils/index.ts', 'src/utils/crypto.ts'],
    replaceNodeEnv: true,
    format: ['esm', 'cjs'],
    dts: true,
    // todo: env var for this?
    sourcemap: false,
    clean: true,
    target: 'es2022',
    minify: options.minify,
    watch: options.watch,
  }
})
