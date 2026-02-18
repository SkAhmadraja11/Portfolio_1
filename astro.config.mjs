import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://SkAhmadraja11.github.io',
  base: '/Portfolio_1/',
  output: 'static',
  trailingSlash: 'always',
  build: {
    assets: '_astro'
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-three': ['three'],
            'vendor-gsap': ['gsap'],
          }
        }
      }
    }
  }
});
