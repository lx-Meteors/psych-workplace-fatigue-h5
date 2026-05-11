import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 项目站为 /<仓库名>/；本地与 Vercel 根域名部署不设 VITE_BASE_PATH 即可用 '/'
  base: process.env.VITE_BASE_PATH || '/',
})
