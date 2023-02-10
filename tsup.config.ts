import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  const platform = options.platform === 'node' ? 'node' : 'browser'
  return {
    entry: ['core/index.ts'],
    replaceNodeEnv: true,
    format: ['esm', 'cjs'],
    external: ['dotenv', 'node:fs', 'fs', '**/*.test.ts', 'core/utils.ts'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es6',
    minify: options.minify,
    outDir: `dist/${platform}`,
    watch: options.watch,
    platform,
  }
})
