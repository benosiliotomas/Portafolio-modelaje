import path from 'path';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE_URL, PUBLIC_PATHS } from './site.config';
import { buildRobots, buildSitemap } from './lib/seo';

// Fills %SITE_URL% in the HTML pages and emits robots.txt and sitemap.xml at build time,
// so switching to a custom domain is a one-line change in site.config.ts.
const siteUrlPlugin = (): Plugin => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL.replace(/\/+$/, '')),
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(SITE_URL) });
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(SITE_URL, PUBLIC_PATHS) });
  },
  // Mirror vercel.json in the dev server: /contenido is served from contenido.html
  // (cleanUrls) and the old /ugc address redirects to it.
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const [path, query = ''] = (req.url ?? '').split('?');
      if (path === '/ugc') {
        res.statusCode = 308;
        res.setHeader('Location', `/contenido${query ? `?${query}` : ''}`);
        res.end();
        return;
      }
      if (path === '/contenido') req.url = `/contenido.html${query ? `?${query}` : ''}`;
      next();
    });
  },
});

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), siteUrlPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        contenido: path.resolve(__dirname, 'contenido.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
