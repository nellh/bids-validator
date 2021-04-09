import path from 'path'
import * as esbuild from 'esbuild'
import GlobalsPlugin from 'esbuild-plugin-globals'

// Node.js target build
await esbuild.build({
  entryPoints: [path.resolve('index.js'), path.resolve('cli.js')],
  outdir: path.resolve('dist', 'commonjs'),
  target: 'node12',
  bundle: true,
  sourcemap: true,
  platform: 'node',
})

// Browser target build
await esbuild.build({
  entryPoints: [path.resolve('index.js')],
  outdir: path.resolve('dist', 'esm'),
  bundle: true,
  sourcemap: true,
  format: 'esm',
  define: {
    global: 'globalThis',
    window: 'globalThis',
    crypto: 'globalThis',
    os: 'globalThis',
    timers: 'globalThis',
    process: JSON.stringify({
      env: {},
      argv: [],
      stdout: '',
      stderr: '',
      stdin: '',
      version: 'v12.14.1',
    }),
    external: ['pluralize'],
  },
  plugins: [
    GlobalsPlugin({
      crypto: 'globalThis',
      os: 'globalThis',
      timers: 'globalThis',
      process: 'globalThis',
    }),
  ],
})
