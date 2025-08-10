import { AstroError } from 'astro/errors'
import type { Element, ElementContent, Text } from 'hast'
import { type Child, h, s } from 'hastscript'
import { select } from 'hast-util-select'
import { fromHtml } from 'hast-util-from-html'
import { toString } from 'hast-util-to-string'
import { rehype } from 'rehype'
import { CONTINUE, SKIP, visit } from 'unist-util-visit'
import { Icons, type StarlightIcon } from './Icons'
import { definitions } from './file-tree-icons'

declare module 'vfile' {
  interface DataMap {
    directoryLabel: string
  }
}

const folderIcon = makeSVGIcon(Icons['seti:folder'])
const defaultFileIcon = makeSVGIcon(Icons['seti:default'])

/**
 * Process the HTML for a file tree to create the necessary markup for each file and directory
 * including icons.
 * @param html Inner HTML passed to the `<FileTree>` component.
 * @param directoryLabel The localized label for a directory.
 * @returns The processed HTML for the file tree.
 */
export function processFileTree(html: string, directoryLabel: string) {
  const file = fileTreeProcessor.processSync({ data: { directoryLabel }, value: html })

  return file.toString()
}

/** Rehype processor to extract file tree data and turn each entry into its associated markup. */
const fileTreeProcessor = rehype()
  .data('settings', { fragment: true })
  .use(function fileTree() {
    return (tree: Element, file) => {
      const { directoryLabel } = file.data

      validateFileTree(tree)

      visit(tree, 'element', (node) => {
        // Strip nodes that only contain newlines.
        node.children = node.children.filter(
          (child) => child.type === 'comment' || child.type !== 'text' || !/^\n+$/.test(child.value)
        )

        // Skip over non-list items.
        if (node.tagName !== 'li') return CONTINUE

        const [firstChild, ...otherChildren] = node.children

        // Keep track of comments associated with the current file or directory.
        const comment: Child[] = []

        // Extract text comment that follows the file name, e.g. `README.md This is a comment`
        if (firstChild?.type === 'text') {
          const [filename, ...fragments] = firstChild.value.split(' ')
          firstChild.value = filename || ''
          const textComment = fragments.join(' ').trim()
          if (textComment.length > 0) {
            comment.push(fragments.join(' '))
          }
        }

        // Comments may not always be entirely part of the first child text node,
        // e.g. `README.md This is an __important__ comment` where the `__important__` and `comment`
        // nodes would also be children of the list item node.
        const subTreeIndex = otherChildren.findIndex((child) => child.type === 'element' && child.tagName === 'ul')
        const commentNodes = subTreeIndex > -1 ? otherChildren.slice(0, subTreeIndex) : [...otherChildren]
        otherChildren.splice(0, subTreeIndex > -1 ? subTreeIndex : otherChildren.length)
        comment.push(...commentNodes)

        const firstChildTextContent = firstChild ? toString(firstChild) : ''

        // Decide a node is a directory if it ends in a `/` or contains another list.
        const isDirectory =
          /\/\s*$/.test(firstChildTextContent) ||
          otherChildren.some((child) => child.type === 'element' && child.tagName === 'ul')
        // A placeholder is a node that only contains 3 dots or an ellipsis.
        const isPlaceholder = /^\s*(\.{3}|…)\s*$/.test(firstChildTextContent)
        // A node is highlighted if its first child is bold text, e.g. `**README.md**`.
        const isHighlighted = firstChild?.type === 'element' && firstChild.tagName === 'strong'

        // Create an icon for the file or directory (placeholder do not have icons).
        const icon = h('span', isDirectory ? folderIcon : getFileIcon(firstChildTextContent))
        if (isDirectory) {
          // Add a screen reader only label for directories before the icon so that it is announced
          // as such before reading the directory name.
          icon.children.unshift(h('span', { class: 'visually-hidden' }, directoryLabel))
        }

        // Add classes and data attributes to the list item node.
        node.properties.class = isDirectory ? 'directory' : 'file'
        if (isPlaceholder) node.properties.class += ' empty'

        // Create the tree entry node that contains the icon, file name and comment which will end up
        // as the list item’s children.
        const treeEntryChildren: Child[] = [
          h('span', { class: isHighlighted ? 'highlighted' : '' }, [isPlaceholder ? null : icon, firstChild])
        ]

        if (comment.length > 0) {
          treeEntryChildren.push(makeText(' '), h('span', { class: 'comment' }, ...comment))
        }

        const treeEntry = h('span', { class: 'tree-entry' }, ...treeEntryChildren)

        if (isDirectory) {
          const hasContents = otherChildren.length > 0

          node.children = [
            h('details', { open: hasContents }, [
              h('summary', treeEntry),
              ...(hasContents ? otherChildren : [h('ul', h('li', '…'))])
            ])
          ]

          // Continue down the tree.
          return CONTINUE
        }

        node.children = [treeEntry, ...otherChildren]

        // Files can’t contain further files or directories, so skip iterating children.
        return SKIP
      })
    }
  })

/** Make a text node with the pass string as its contents. */
function makeText(value = ''): Text {
  return { type: 'text', value }
}

/** Make a node containing an SVG icon from the passed HTML string. */
function makeSVGIcon(svgString: string) {
  return s(
    'svg',
    {
      width: 16,
      height: 16,
      class: 'tree-icon',
      'aria-hidden': 'true',
      viewBox: '0 0 24 24'
    },
    fromHtml(svgString, { fragment: true })
  )
}

/** Return the icon for a file based on its file name. */
function getFileIcon(fileName: string) {
  const name = getFileIconName(fileName)
  if (!name) return defaultFileIcon
  if (name in Icons) {
    const path = Icons[name as StarlightIcon]
    return makeSVGIcon(path)
  }
  return defaultFileIcon
}

/** Return the icon name for a file based on its file name. */
function getFileIconName(fileName: string) {
  let icon: string | undefined = definitions.files[fileName]
  if (icon) return icon
  icon = getFileIconTypeFromExtension(fileName)
  if (icon) return icon
  for (const [partial, partialIcon] of Object.entries(definitions.partials)) {
    if (fileName.includes(partial)) return partialIcon
  }
  return icon
}

/**
 * Get an icon from a file name based on its extension.
 * Note that an extension in Seti is everything after a dot, so `README.md` would be `.md` and
 * `name.with.dots` will try to look for an icon for `.with.dots` and then `.dots` if the first one
 * is not found.
 */
function getFileIconTypeFromExtension(fileName: string) {
  const firstDotIndex = fileName.indexOf('.')
  if (firstDotIndex === -1) return
  let extension = fileName.slice(firstDotIndex)
  while (extension !== '') {
    const icon = definitions.extensions[extension]
    if (icon) return icon
    const nextDotIndex = extension.indexOf('.', 1)
    if (nextDotIndex === -1) return
    extension = extension.slice(nextDotIndex)
  }
  return
}

/** Validate that the user provided HTML for a file tree is valid. */
function validateFileTree(tree: Element) {
  const rootElements = tree.children.filter(isElementNode)
  const [rootElement] = rootElements

  if (rootElements.length === 0) {
    throwFileTreeValidationError(
      'The `<FileTree>` component expects its content to be a single unordered list but found no child elements.'
    )
  }

  if (rootElements.length !== 1) {
    throwFileTreeValidationError(
      `The \`<FileTree>\` component expects its content to be a single unordered list but found multiple child elements: ${rootElements
        .map((element) => `\`<${element.tagName}>\``)
        .join(' - ')}.`
    )
  }

  if (!rootElement || rootElement.tagName !== 'ul') {
    throwFileTreeValidationError(
      `The \`<FileTree>\` component expects its content to be an unordered list but found the following element: \`<${rootElement?.tagName}>\`.`
    )
  }

  const listItemElement = select('li', rootElement)

  if (!listItemElement) {
    throwFileTreeValidationError(
      'The `<FileTree>` component expects its content to be an unordered list with at least one list item.'
    )
  }
}

function isElementNode(node: ElementContent): node is Element {
  return node.type === 'element'
}

/** Throw a validation error for a file tree linking to the documentation. */
function throwFileTreeValidationError(message: string): never {
  throw new AstroError(
    message,
    'To learn more about the `<FileTree>` component, see https://starlight.astro.build/components/file-tree/'
  )
}

export interface Definitions {
  files: Record<string, string>
  extensions: Record<string, string>
  partials: Record<string, string>
}
