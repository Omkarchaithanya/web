import { defineConfig, loadEnv } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve(__dirname), '');

  return {
    root: 'src',
    publicDir: '../public',
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html'),
          about: resolve(__dirname, 'src/about/index.html'),
          blog: resolve(__dirname, 'src/blog/index.html'),
          'blog-bio': resolve(__dirname, 'src/blog/posts/blog-bio-mimicry.html'),
          'blog-smart': resolve(__dirname, 'src/blog/posts/blog-smart-cities.html'),
          faq: resolve(__dirname, 'src/faq/index.html'),
          login: resolve(__dirname, 'src/login/index.html'),
          monitoring: resolve(__dirname, 'src/monitoring/index.html'),
          technology: resolve(__dirname, 'src/technology/index.html'),
          'cookie-policy': resolve(__dirname, 'src/legal/cookie-policy.html'),
          disclaimer: resolve(__dirname, 'src/legal/disclaimer.html'),
          environmental: resolve(__dirname, 'src/legal/environmental-statement.html'),
          intellectual: resolve(__dirname, 'src/legal/intellectual-property.html'),
          privacy: resolve(__dirname, 'src/legal/privacy-policy.html'),
          terms: resolve(__dirname, 'src/legal/terms.html'),
        },
      },
    },
    plugins: [
      tailwindcss(),
      handlebars({
        partialDirectory: resolve(__dirname, 'src/shared/partials'),
        context: {
          SITE_URL: env.VITE_SITE_URL || '',
          CONTACT_EMAIL: env.VITE_CONTACT_EMAIL || '',
          PRIVACY_EMAIL: env.VITE_PRIVACY_EMAIL || '',
          SOCIAL_TWITTER: env.VITE_SOCIAL_TWITTER || '',
          SOCIAL_GITHUB: env.VITE_SOCIAL_GITHUB || '',
          SOCIAL_LINKEDIN: env.VITE_SOCIAL_LINKEDIN || '',
          SOCIAL_INSTAGRAM: env.VITE_SOCIAL_INSTAGRAM || '',
          SOCIAL_YOUTUBE: env.VITE_SOCIAL_YOUTUBE || '',
        },
      }),
    ],
  };
});
