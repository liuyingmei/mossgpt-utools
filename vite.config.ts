import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'vite'
import { replaceCodePlugin } from 'vite-plugin-replace'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'
import { viteDelDev } from './vite.del-dev'
import { vitePluginPreload } from './vite.preload'

export default defineConfig(({ command }) => {
  const prePlugins =
    command === 'serve'
      ? [
          copy({
            hook: 'buildStart',
            verbose: false,
            targets: [
              {
                src: 'public/*',
                dest: 'dist',
              },
            ],
          }),
        ]
      : [viteDelDev()]

  const introduction = fs.readFileSync('./introduction.md', {
    encoding: 'utf-8',
  })

  return {
    base: './',
    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: '',
        },
      ],
    },
    plugins: [
      ...prePlugins,
      wasm(),
      topLevelAwait(),
      replaceCodePlugin({
        replacements: [
          {
            from: '__INTRODUCTION__',
            to: `\`${introduction.replace(/`/g, '\\`')}\``,
          },
        ],
      }),
      vitePluginPreload(
        './src/preload.ts',
        command === 'serve' ? 'buildStart' : 'writeBundle'
      ),
      react(),
    ],
  }
})

