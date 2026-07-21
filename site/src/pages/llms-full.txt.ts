import type { APIRoute } from 'astro'
import { getConfig } from '@libs/config'
import { getLlmsSections } from '@libs/llms'

// Strip leading MDX `import ... from '...'` statements so the concatenated
// output reads as prose. Shortcode tags (e.g. `<Example>`, `<Callout>`) are
// left inline — full fidelity isn't achievable from raw MDX without rendering,
// but the content stays highly usable for ingestion.
function cleanBody(body: string): string {
  return body.replace(/^import\s.+?\n/gm, '').trim()
}

// Generates `/llms-full.txt`, the full text of the documentation concatenated
// into a single file for direct ingestion by LLMs. See https://llmstxt.org/.
export const GET: APIRoute = function GET({ site }) {
  const { title, description } = getConfig()
  const sections = getLlmsSections()

  const lines: string[] = [`# ${title}`, '', `> ${description}`, '']

  for (const section of sections) {
    for (const page of section.pages) {
      const url = new URL(page.path, site)
      const body = cleanBody(page.body)

      lines.push('---', '', `# ${page.title}`, '', `Source: ${url}`, '', page.description, '')

      if (body.length > 0) {
        lines.push(body, '')
      }
    }
  }

  return new Response(`${lines.join('\n').trimEnd()}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  })
}
