import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
  const enableSingle = process.env.SINGLE_FILE === 'true';
  return {
  // Use a relative base so the site works when opened from the filesystem or any subpath
  base: './',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
  // Treat the existing `assets/` folder as the public directory to copy as-is to dist
  publicDir: 'assets',
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
  // We'll handle single-file post processing via a custom script instead of a plugin
    };
});
