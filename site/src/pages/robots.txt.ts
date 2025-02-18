import type { APIRoute } from 'astro'

export const get: APIRoute = function get({ site }) {
  const isProduction = import.meta.env.PROD
  const isNetlify = import.meta.env.NETLIFY === 'true'

  const allowCrawling = !isNetlify && isProduction

  return {
    body: `# www.robotstxt.org${allowCrawling ? '\n# Allow crawling of all content' : ''}
User-agent: *
Disallow: ${allowCrawling ? '' : '/'}
Sitemap: ${new URL('sitemap-index.xml', site)}
`,
  }
}
