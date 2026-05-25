import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'reefbreak',
      formats: ['es', 'umd'],
      // Produces dist/reefbreak.mjs (ESM) and dist/reefbreak.umd.js (UMD).
      fileName: (format) => (format === 'es' ? 'reefbreak.mjs' : 'reefbreak.umd.js'),
    },
  },
});
