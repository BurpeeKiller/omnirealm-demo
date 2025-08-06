import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'dates/index': 'src/dates/index.ts',
    'strings/index': 'src/strings/index.ts',
    'numbers/index': 'src/numbers/index.ts',
    'arrays/index': 'src/arrays/index.ts',
    'react/index': 'src/react/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
});