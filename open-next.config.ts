import { defineCloudflareConfig } from '@opennextjs/cloudflare'

// Pages are rendered on each request (they read the CMS), so no Next.js cache storage is needed
export default defineCloudflareConfig({})
