import type { HTMLAttributes } from 'astro/types'
import { getConfig } from '@libs/config'
import { getVersionedDocsPath } from '@libs/path'

export function getVersionedBsCssProps(direction: 'rtl' | undefined) {
  let bsCssLinkHref = '/dist/css/bootstrap'

  if (direction === 'rtl') {
    bsCssLinkHref = `${bsCssLinkHref}.rtl`
  }

  if (import.meta.env.PROD) {
    bsCssLinkHref = `${bsCssLinkHref}.min`
  }

  bsCssLinkHref = `${bsCssLinkHref}.css`

  const bsCssLinkProps: HTMLAttributes<'link'> = {
    href: getVersionedDocsPath(bsCssLinkHref),
    rel: 'stylesheet'
  }

  if (import.meta.env.PROD) {
    bsCssLinkProps.integrity = direction === 'rtl' ? getConfig().cdn.css_rtl_hash : getConfig().cdn.css_hash
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
    src: getVersionedDocsPath(bsJsScriptSrc)
  }

  if (import.meta.env.PROD) {
    bsJsLinkProps.integrity = getConfig().cdn.js_bundle_hash
  }

  return bsJsLinkProps
}
