import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'

const assetExtensions = [
  '**/*.glb',
  '**/*.gltf',
  '**/*.png',
  '**/*.jpg',
  '**/*.svg',
  '**/*.mp4',
  '**/*.webm',
]

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
  },
  preview: {
    https: true,
  },
  plugins: [react(), basicSsl()],
  assetsInclude: assetExtensions,
})
