// sanity.cli.ts
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  project: { basePath: '/studio' },
 api: {
    projectId: 'uomw3xpf',
    dataset: 'production',
  },
  vite: {
    server: {
      host: '0.0.0.0',
      port: 3333,
      strictPort: true,
      allowedHosts: ['wellcomp.hu', '.wellcomp.hu'],
    },
    preview: {
      host: '0.0.0.0',
      port: 3333,
      strictPort: true,
      allowedHosts: ['wellcomp.hu', '.wellcomp.hu'],
    },
  },
})
