import type { HTMLAttributes } from 'astro/types'
import * as htmlparser2 from 'htmlparser2'
import { getData } from './data'

const placeholderRegex = /<Placeholder\s+([^>]+)\/>/g
const closeButtonRegex = /<CloseButton\s*([^>]*?)\/>/g

// Close button SVG icon
const CLOSE_BUTTON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="none">
      <path fill="currentcolor" d="M12 0a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4zm-.646 4.646a.5.5 0 0 0-.707 0L8 7.293 5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.647a.5.5 0 1 0 .708.707L8 8.707l2.647 2.646a.5.5 0 1 0 .707-.707L8.707 8l2.646-2.646a.5.5 0 0 0 0-.708z"/>
    </svg>`

/**
 * Generates all the placeholder attributes and options required to render a placeholder.
 * @see src/components/shortcodes/Placeholder.astro
 */
export function getPlaceholder(userOptions: Partial<PlaceholderOptions>): Placeholder {
  const options = getOptionsWithDefaults(userOptions)
  const { class: className, height, markup, text, title, width } = options

  const showText = text !== false
  const showTitle = title !== false

  const placeholderClassList = ['bd-placeholder-img', className].join(' ')
  const placeholderRole = showTitle || showText ? 'img' : undefined
  const placeholderAriaHidden = !showText && !showTitle ? 'true' : undefined

  const placeholderLabel =
    showText || showTitle
      ? `${showTitle ? title : ''}${showTitle && showText ? ': ' : ''}${showText ? text : ''}`
      : undefined

  const optionsWithVisibilities = { ...options, showText, showTitle }

  if (markup === 'img') {
    return {
      type: 'img',
      options: optionsWithVisibilities,
      props: {
        alt: placeholderLabel,
        class: placeholderClassList,
        height,
        src: getPlaceholderSrc(showTitle, showText, options),
        width
      }
    }
  }

  return {
    type: 'svg',
    options: optionsWithVisibilities,
    props: {
      'aria-hidden': placeholderAriaHidden,
      'aria-label': placeholderLabel,
      class: placeholderClassList,
      height,
      preserveAspectRatio: 'xMidYMid slice',
      role: placeholderRole,
      width,
      xmlns: 'http://www.w3.org/2000/svg'
    }
  }
}

/**
 * Renders a CloseButton component to its HTML string representation.
 * Supports optional `dismiss` and `class` attributes.
 */
function renderCloseButtonToString(attributes: Record<string, string>): string {
  const dismiss = attributes.dismiss
  const extraClass = attributes.class
  const dismissAttr = dismiss ? ` data-bs-dismiss="${dismiss}"` : ''
  const classValue = extraClass ? `btn-close ${extraClass}` : 'btn-close'

  return `<button type="button" class="${classValue}"${dismissAttr} aria-label="Close">
      ${CLOSE_BUTTON_SVG}
    </button>`
}

/**
 * Replaces placeholders described using the `<Placeholder />` component in HTML markup with the expected HTML content.
 * Also replaces `<CloseButton />` components with the full close button HTML.
 *
 * This is useful to render examples that have a pretty large set of constraints:
 *
 *  - The provided HTML code is not valid MDX (e.g. unclosed void elements like <img>) but can contain the
 *      `<Placeholder />` Astro component. This means that we cannot use an Astro slot for example that requires valid
 *      MDX.
 *  - The provided HTML code cannot be parsed in a forgiving way with XML mode enabled (to not lose the structure due
 *      to self-closing MDX or Astro components) and serialized back to a string while closing all known void elements
 *      in order to render it as MDX using `@mdx-js/mdx` & `astro/jsx-runtime`. This works perfectly (tested) but the
 *      DOM needs to contains the exact same HTML markup (even indentation) provided to the example as it is used on the
 *      client to send the example to StackBlitz with the same indentation as the original example.
 *
 * If you are not sure if you need to use this function, you probably don't.
 */
export function replacePlaceholdersInHtml(html: string) {
  // Replace CloseButton components
  html = html.replace(closeButtonRegex, (match) => {
    const document = htmlparser2.parseDocument(match, { xmlMode: true })
    const closeButtonElement = document.firstChild

    if (
      document.children.length > 1 ||
      !closeButtonElement ||
      closeButtonElement.type !== htmlparser2.ElementType.Tag ||
      closeButtonElement.name !== 'CloseButton'
    ) {
      throw new Error('Invalid CloseButton element.')
    }

    return renderCloseButtonToString(closeButtonElement.attribs as Record<string, string>)
  })

  // Replace Placeholder components
  return html.replace(placeholderRegex, (match) => {
    const document = htmlparser2.parseDocument(match, { xmlMode: true })
    const placeholderElement = document.firstChild

    if (
      document.children.length > 1 ||
      !placeholderElement ||
      placeholderElement.type !== htmlparser2.ElementType.Tag ||
      placeholderElement.name !== 'Placeholder'
    ) {
      throw new Error('Invalid placeholder element.')
    }

    const placeholder = getPlaceholder(sanitizeHtmlAttributesFromMdx(placeholderElement.attribs))

    return renderPlaceholderToString(placeholder)
  })
}

function renderPlaceholderToString(placeholder: Placeholder) {
  let placeholderStr = `<${placeholder.type}`

  for (const [key, value] of Object.entries(placeholder.props)) {
    if (value === undefined) {
      continue
    }

    placeholderStr = `${placeholderStr} ${key}="${value}"`
  }

  if (placeholder.type === 'img') {
    return `${placeholderStr} />`
  }

  placeholderStr = `${placeholderStr}>`

  if (placeholder.options.showTitle) {
    placeholderStr = `${placeholderStr}<title>${placeholder.options.title}</title>`
  }

  placeholderStr = `${placeholderStr}<rect width="100%" height="100%" fill="${placeholder.options.background}" />`

  if (placeholder.options.showText) {
    placeholderStr = `${placeholderStr}<text x="50%" y="50%" fill="${placeholder.options.color}" dy=".3em">${placeholder.options.text}</text>`
  }

  return `${placeholderStr}</${placeholder.type}>`
}

function getOptionsWithDefaults(options: Partial<PlaceholderOptions>) {
  const optionsWithDefaults = Object.assign(
    {},
    {
      background: '#adb5bd',
      color: '#e9ecef',
      height: '180',
      markup: 'svg',
      title: 'Placeholder',
      width: '100%'
    },
    options
  )

  if (optionsWithDefaults.text === undefined) {
    optionsWithDefaults.text = `${optionsWithDefaults.width}x${optionsWithDefaults.height}`
  }

  return optionsWithDefaults as PlaceholderOptions
}

function getPlaceholderSrc(
  showTitle: boolean,
  showText: boolean,
  { background, color, text, title }: PlaceholderOptions
) {
  // Sanitize the background and text colors by removing the leading hash if any.
  const bgColor = background.replace(/^#/, '')
  const textColor = color.replace(/^#/, '')

  // Build the raw SVG string first
  let svg = `<svg style='font-size: 1.125rem; font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"; -webkit-user-select: none; -moz-user-select: none; user-select: none; text-anchor: middle;' width='200' height='200' xmlns='http://www.w3.org/2000/svg'>`

  if (showTitle) {
    svg += `<title>${title}</title>`
  }

  svg += `<rect width='100%' height='100%' fill='#${bgColor}'></rect>`

  if (showText) {
    svg += `<text x='50%' y='50%' fill='#${textColor}' dy='.3em'>${text}</text>`
  }

  svg += `</svg>`

  const encodedSvg = encodeURIComponent(svg)

  return `data:image/svg+xml,${encodedSvg}`
}

function sanitizeHtmlAttributesFromMdx(attributes: Record<string, unknown>) {
  const sanitizedAttributes: typeof attributes = {}

  for (const [key, value] of Object.entries(attributes)) {
    if (value === undefined) {
      continue
    } else if (value === '{false}') {
      sanitizedAttributes[key] = false
    } else if (value === '{true}') {
      sanitizedAttributes[key] = true
    } else {
      sanitizedAttributes[key] = value
    }
  }

  return sanitizedAttributes
}

export interface PlaceholderOptions {
  /**
   * The SVG background color.
   * @default "#868e96"
   */
  background: string
  /**
   * CSS classes to append to `bd-placeholder-img` for the `svg` or `img` elements.
   */
  class?: string
  /**
   * The text color (foreground).
   * @default "#dee2e6"
   */
  color: string
  /**
   * The placeholder height.
   * @default "180"
   */
  height: string
  /**
   * If it should render `svg` or `img` tags.
   * @default "svg"
   */
  markup: 'img' | 'svg'
  /**
   * The text to show in the image. You can explicitly pass the `false` boolean value (and not the string "false") to
   * hide the text.
   * @default "${width}x{$height)"
   */
  text: string | false
  /**
   * Used in the SVG `title` tag. You can explicitly pass the `false` boolean value (and not the string "false") to
   * hide the title.
   * @default "Placeholder"
   */
  title: string | false
  /**
   * The placeholder width.
   * @default "100%"
   */
  width: string
}

interface PlaceholderVisibilities {
  showText: boolean
  showTitle: boolean
}

type Placeholder =
  | {
      type: 'img'
      options: PlaceholderOptions & PlaceholderVisibilities
      props: HTMLAttributes<'img'>
    }
  | {
      type: 'svg'
      options: PlaceholderOptions & PlaceholderVisibilities
      props: HTMLAttributes<'svg'>
    }
