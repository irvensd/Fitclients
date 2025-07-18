import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize bundle splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'recharts'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge'],
          
          // Feature chunks
          'dashboard': ['./src/pages/Dashboard.tsx'],
          'clients': ['./src/pages/Clients.tsx'],
          'sessions': ['./src/pages/Sessions.tsx'],
          'workouts': ['./src/pages/Workouts.tsx'],
          'payments': ['./src/pages/Payments.tsx'],
          'progress': ['./src/pages/Progress.tsx'],
          'ai-recommendations': ['./src/pages/AIRecommendations.tsx'],
          'support': ['./src/pages/SupportPortal.tsx'],
          'client-portal': ['./src/pages/ClientPortal.tsx'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging
    sourcemap: mode === 'development',
    // Optimize for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'recharts',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage',
      'date-fns',
      'clsx',
      'tailwind-merge',
    ],
  },
}));
