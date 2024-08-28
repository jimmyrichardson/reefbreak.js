import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname + '/index.js'),
      name: 'reefbreak',
    },
    outDir: 'dist',
    // rollupOptions: {
    //   input: {
    //     reefbreak: resolve(__dirname + '/index.js'),
    //   },
    //   output: {
    //     entryFileNames: 'reefbreak.min.js',
    //     format: 'es',
    //   },
    // },
  },
});