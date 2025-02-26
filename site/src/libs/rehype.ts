import type { Root } from 'hast'
import type { Plugin } from 'unified'
import { SKIP, visit } from 'unist-util-visit'

// A rehype plugin to apply CSS classes to tables rendered in markdown (or MDX) files when wrapped in a `<BsTable />`
// component.
export const rehypeBsTable: Plugin<[], Root> = function () {
  return function rehypeBsTablePlugin(ast) {
    visit(ast, 'element', (node, _index, parent) => {
      if (node.tagName !== 'table' || parent?.type !== 'mdxJsxFlowElement' || parent.name !== 'BsTable') {
        return SKIP
      }

      const classAttribute = parent.attributes.find(
        (attribute) => attribute.type === 'mdxJsxAttribute' && attribute.name === 'class'
      )

      if (classAttribute && typeof classAttribute.value !== 'string') {
        return SKIP
      }

      const tableClass = typeof classAttribute?.value === 'string' ? classAttribute.value : 'table'

      if (!node.properties) {
        node.properties = {}
      }

      node.properties = {
        ...node.properties,
        class: tableClass
      }
    })
  }
}
