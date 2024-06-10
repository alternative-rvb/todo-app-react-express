import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement en fonction du mode (développement ou production)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    build: {
      // Chemin où les fichiers de production seront générés
      outDir: resolve(__dirname, './server/dist'),
    },
    server: {
      proxy: {
        // Utiliser la variable d'environnement pour configurer le proxy
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
