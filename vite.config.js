import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: false, // Assets are already at root
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['fuse.js'],
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
