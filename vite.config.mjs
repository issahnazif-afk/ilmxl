import { defineConfig } from 'vite';

// GitHub Pages serves the site at /ilmxl/. Set ILMXL_BASE=/ for a custom domain.
export default defineConfig({
  base: process.env.ILMXL_BASE || '/ilmxl/',
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
});
