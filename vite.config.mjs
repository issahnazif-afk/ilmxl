import { defineConfig } from 'vite';

// The accounts server address. A web app deployed from a Google Workspace account is copied as
// https://script.google.com/a/macros/<domain>/s/<id>/exec; the same app answers at /macros/s/<id>/exec, so the
// domain is dropped and never reaches the public site.
if (process.env.VITE_ILMXL_SERVER) {
  process.env.VITE_ILMXL_SERVER = process.env.VITE_ILMXL_SERVER.trim().replace(/^https:\/\/script\.google\.com\/a\/macros\/[^/]+\/s\//, 'https://script.google.com/macros/s/');
}

// GitHub Pages serves the site at /ilmxl/. Set ILMXL_BASE=/ for a custom domain.
export default defineConfig({
  base: process.env.ILMXL_BASE || '/ilmxl/',
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
  worker: { format: 'es' },   // the voice worker (src/app/voice-worker.mjs) loads Kokoro in its own chunks
});
