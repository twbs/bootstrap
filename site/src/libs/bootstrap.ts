import type { HTMLAttributes } from 'astro/types'
import { getVersionedDocsPath } from '@libs/path'

export function getVersionedBsCssProps() {
  let bsCssLinkHref = '/dist/css/bootstrap'

  if (import.meta.env.PROD) {
    bsCssLinkHref = `${bsCssLinkHref}.min`
  }

  bsCssLinkHref = `${bsCssLinkHref}.css`

  const bsCssLinkProps: HTMLAttributes<'link'> = {
    href: getVersionedDocsPath(bsCssLinkHref),
    rel: 'stylesheet'
  }

  return bsCssLinkProps
}

export function getVersionedBsJsProps() {
  let bsJsScriptSrc = '/dist/js/bootstrap.bundle'

  if (import.meta.env.PROD) {
    bsJsScriptSrc = `${bsJsScriptSrc}.min`
  }

  bsJsScriptSrc = `${bsJsScriptSrc}.js`

  const bsJsLinkProps: HTMLAttributes<'script'> = {
    type: 'module',
    src: getVersionedDocsPath(bsJsScriptSrc)
  }

  return bsJsLinkProps
}
