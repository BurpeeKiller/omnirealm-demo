import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'components/index': 'src/components/index.ts',
    'services/index': 'src/services/index.ts',
    'utils/index': 'src/utils/index.ts',
    'types/index': 'src/types/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
});
