import { defineConfig } from 'vite';
import { resolve } from 'path';

const pages = ['index', 'about', 'services', 'contact', 'privacy', 'terms'];

export default defineConfig({
  root: '.',
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(__dirname, `${p}.html`)]))
    }
  }
});
