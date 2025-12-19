import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'LaptopWebshop',

  projectId: 'uomw3xpf',
  dataset: 'production',

   studio: {
    basePath: '/',
    outputPath: 'dist', // hagyd így, ne legyen a gyökér/../
  },

vite: {
  server: {
    host: "0.0.0.0",
    port: 3333,
    allowedHosts: ["wellcomp.hu", "www.wellcomp.hu", "localhost", "127.0.0.1"],
  },
  preview: {
    host: "0.0.0.0",
    port: 3333,
    strictPort: true,
    allowedHosts: ["wellcomp.hu", "www.wellcomp.hu", "localhost", "127.0.0.1"],
  },
},

  schema: { types: schemaTypes },
  plugins: [structureTool(), visionTool()],
},
})
