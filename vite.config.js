import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement en fonction du mode (développement ou production)
  const env = loadEnv(mode, process.cwd());

  // Identifier le fichier .env lu
  const envFile = mode === 'development' ? '.env' : `.env.${mode}`;
  console.log(`Loading environment variables from ${envFile}`);
  
  // Log the loaded environment variables for verification
  console.log(env);

  return {
    plugins: [react()],
    build: {
      // Chemin où les fichiers de production seront générés
      outDir: resolve(__dirname, './server/dist'),
    },
    define: {
      'process.env': env
    }
  };
});
