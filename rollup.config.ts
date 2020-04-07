import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'

const pkg = require('./package.json')

const libraryName = 'axios'

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // 声明它的外部依赖，可以不被打包进去。
  external: [],
  // 监听文件的变化，重新编译，只有在编译的时候开启 --watch 才生效。
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // 编译 TypeScript 文件, useTsconfigDeclarationDir 表示使用 tsconfig.json 文件中定义的 declarationDir
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
}
