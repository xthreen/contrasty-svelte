import { join } from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { partytownVite } from '@builder.io/partytown/utils'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      svelte(),
      partytownVite({
            debug: true,
            dest: join(__dirname, 'dist', '~partytown')
      })
  ],
})
