import type { APIRoute } from 'astro'
import { getConfig } from '@libs/config'
import { getLlmsSections } from '@libs/llms'

// Generates `/llms.txt`, a curated index of the docs for LLMs, following the
// llmstxt.org format: an H1 title, a blockquote summary, then grouped lists of
// links with descriptions. See https://llmstxt.org/.
export const GET: APIRoute = function GET({ site }) {
  const { title, description } = getConfig()
  const sections = getLlmsSections()

  const lines: string[] = [`# ${title}`, '', `> ${description}`, '']

  lines.push(
    `The full text of the documentation is available at [${new URL('llms-full.txt', site)}](${new URL('llms-full.txt', site)}).`,
    ''
  )

  for (const section of sections) {
    lines.push(`## ${section.heading}`, '')

    for (const page of section.pages) {
      const url = new URL(page.path, site)
      lines.push(`- [${page.title}](${url}): ${page.description}`)
    }

    lines.push('')
  }

  return new Response(`${lines.join('\n').trimEnd()}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  })
}
