import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
  },
	esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment'
  },
  define: {
    'process.env': {}
  }
})
