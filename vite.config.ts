import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { securityPlugin } from "./vite-security-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      react(),
      securityPlugin() // Add security plugin
    ],
    server: {
      port: 3000,
      strictPort: true,
      host: "localhost",
      // Security: Configure middleware to block sensitive paths
      middlewareMode: false,
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
          secure: false,
        },
      },
      // Security: Block access to sensitive files during development
      fs: {
        deny: [
          '.env*',
          'package*.json',
          'yarn.lock',
          'tsconfig*.json',
          'vite.config.*',
          'webpack.config.*',
          '**/.git/**',
          '**/node_modules/**',
          '**/*.bak',
          '**/*.backup',
          '**/*.old',
          '**/*.tmp',
          '**/*.temp'
        ]
      }
    },
    preview: {
      port: 3000,
      host: true, // 👈 ensures it binds to 0.0.0.0
      allowedHosts: ["qatalyst.tech", "staging-stage012.qatalyst.tech"],
    },
    // Load environment variables from .env file
    envDir: ".",
    envPrefix: ["VITE_", "STORAGE_", "CONTAINER_", "AZURE_", "SAS_"],
    build: {
      chunkSizeWarningLimit: 4000,
    },
  };
});
