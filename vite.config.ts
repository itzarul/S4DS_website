import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: '0.0.0.0', port: 3001, strictPort: true },
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        team: 'team.html',
        events: 'events.html',
        gallery: 'gallery.html',
        publication: 'publication.html',
      },
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'three';
          if (/\/node_modules\/(gsap|lenis)\//.test(id)) return 'motion';
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
        },
      },
    },
  },
});
