import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  let path = `src/index.ts`
  if (process.env.BUILD) path = `src/${process.env.BUILD}/index.ts`
  return {
    entry: [path],
    replaceNodeEnv: true,
    format: ['esm'],
    external: ['dotenv', 'node:fs', 'fs', '**/*.test.ts', 'core/utils.ts'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2022',
    minify: options.minify,
    watch: options.watch,
  }
})
