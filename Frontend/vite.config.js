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
          about: resolve(__dirname, 'src/pages/about.html'),
          blog: resolve(__dirname, 'src/pages/blog.html'),
          'blog-bio': resolve(__dirname, 'src/pages/blog-bio-mimicry.html'),
          'blog-smart': resolve(__dirname, 'src/pages/blog-smart-cities.html'),
          'case-study': resolve(__dirname, 'src/pages/case-study.html'),
          faq: resolve(__dirname, 'src/pages/faq.html'),
          login: resolve(__dirname, 'src/pages/login.html'),
          monitoring: resolve(__dirname, 'src/pages/monitoring.html'),
          technology: resolve(__dirname, 'src/pages/technology.html'),
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
        partialDirectory: resolve(__dirname, 'src/partials'),
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
