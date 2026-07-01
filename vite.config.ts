import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Lightweight SPA. ml.js and pdf.js are loaded from CDN (see index.html) so the
// heavy ML/data libraries stay out of the app bundle.
export default defineConfig({
  base: './',
  plugins: [react()],
});
