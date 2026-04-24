/**
 * Bootstrap class ordering definition.
 *
 * Classes are grouped by category following Bootstrap's architecture:
 * 1. Layout (containers, grid, columns)
 * 2. Components (alphabetical by component name)
 * 3. Helpers
 * 4. Utilities (following the order in scss/_utilities.scss)
 *
 * Within each group, classes are ordered to match Bootstrap's source order.
 * Responsive prefixes (sm, md, lg, xl, xxl) are handled separately —
 * a responsive variant always sorts after its base class but before the
 * next category.
 */

// Bootstrap breakpoints in order
export const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', 'xxl']

// Regex that matches a Bootstrap responsive infix: e.g. "d-md-flex" → infix "md"
const RESPONSIVE_RE = new RegExp(`^(.+?)-(${BREAKPOINTS.join('|')})-(.+)$`)

/**
 * Ordered class prefixes/patterns.
 *
 * Each entry is a string that will be matched as a prefix against the
 * "base" class (with responsive infix stripped). The position in this
 * array determines sort order.
 *
 * The ordering follows Bootstrap's import stack (bootstrap.scss) and,
 * for utilities, the key order of the $utilities map in _utilities.scss.
 */
export const CLASS_ORDER = [
  // ── Layout ──────────────────────────────────────────────────
  // Containers
  'container-fluid',
  'container-sm',
  'container-md',
  'container-lg',
  'container-xl',
  'container-xxl',
  'container',
  // Grid: rows
  'row',
  'row-cols-',
  // Grid: columns
  'col-auto',
  'col-1', 'col-2', 'col-3', 'col-4', 'col-5', 'col-6',
  'col-7', 'col-8', 'col-9', 'col-10', 'col-11', 'col-12',
  'col',
  'offset-',
  'g-', 'gx-', 'gy-',

  // ── Reboot / Typography ─────────────────────────────────────
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'lead',
  'display-',
  'list-unstyled',
  'list-inline',
  'list-inline-item',
  'initialism',
  'blockquote',
  'blockquote-footer',

  // ── Images ──────────────────────────────────────────────────
  'img-fluid',
  'img-thumbnail',
  'figure',
  'figure-img',
  'figure-caption',

  // ── Tables ──────────────────────────────────────────────────
  'table',
  'table-',
  'caption-top',

  // ── Forms ───────────────────────────────────────────────────
  'form-label',
  'col-form-label',
  'form-text',
  'form-control',
  'form-control-',
  'form-select',
  'form-select-',
  'form-check',
  'form-check-',
  'form-switch',
  'form-floating',
  'form-range',
  'input-group',
  'input-group-',
  'valid-feedback',
  'valid-tooltip',
  'invalid-feedback',
  'invalid-tooltip',
  'was-validated',

  // ── Buttons ─────────────────────────────────────────────────
  'btn',
  'btn-',
  'btn-close',
  'btn-close-',

  // ── Transitions ─────────────────────────────────────────────
  'fade',
  'collapse',
  'collapsing',
  'show',

  // ── Dropdown ────────────────────────────────────────────────
  'dropdown',
  'dropdown-',
  'dropup',
  'dropend',
  'dropstart',

  // ── Button group ────────────────────────────────────────────
  'btn-group',
  'btn-group-',
  'btn-toolbar',

  // ── Nav ─────────────────────────────────────────────────────
  'nav',
  'nav-',
  'tab-content',
  'tab-pane',

  // ── Navbar ──────────────────────────────────────────────────
  'navbar',
  'navbar-',

  // ── Card ────────────────────────────────────────────────────
  'card',
  'card-',

  // ── Accordion ───────────────────────────────────────────────
  'accordion',
  'accordion-',

  // ── Breadcrumb ──────────────────────────────────────────────
  'breadcrumb',
  'breadcrumb-item',

  // ── Pagination ──────────────────────────────────────────────
  'pagination',
  'pagination-',
  'page-item',
  'page-link',

  // ── Badge ───────────────────────────────────────────────────
  'badge',

  // ── Alert ───────────────────────────────────────────────────
  'alert',
  'alert-',

  // ── Progress ────────────────────────────────────────────────
  'progress',
  'progress-',
  'progress-bar',
  'progress-bar-',

  // ── List group ──────────────────────────────────────────────
  'list-group',
  'list-group-',

  // ── Toasts ──────────────────────────────────────────────────
  'toast',
  'toast-',

  // ── Modal ───────────────────────────────────────────────────
  'modal',
  'modal-',

  // ── Tooltip ─────────────────────────────────────────────────
  'tooltip',
  'tooltip-',

  // ── Popover ─────────────────────────────────────────────────
  'popover',
  'popover-',

  // ── Carousel ────────────────────────────────────────────────
  'carousel',
  'carousel-',

  // ── Spinners ────────────────────────────────────────────────
  'spinner-border',
  'spinner-border-',
  'spinner-grow',
  'spinner-grow-',

  // ── Offcanvas ───────────────────────────────────────────────
  'offcanvas',
  'offcanvas-',

  // ── Placeholders ────────────────────────────────────────────
  'placeholder',
  'placeholder-',

  // ── Helpers ─────────────────────────────────────────────────
  'clearfix',
  'link-',
  'icon-link',
  'icon-link-',
  'ratio',
  'ratio-',
  'fixed-top',
  'fixed-bottom',
  'sticky-top',
  'sticky-bottom',
  'hstack',
  'vstack',
  'stretched-link',
  'text-truncate',
  'vr',
  'visually-hidden',
  'visually-hidden-focusable',

  // ── Utilities (order follows scss/_utilities.scss $utilities map) ──

  // Vertical align
  'align-',

  // Float
  'float-',

  // Object fit
  'object-fit-',

  // Opacity
  'opacity-',

  // Overflow
  'overflow-',

  // Display
  'd-',

  // Shadow
  'shadow',
  'shadow-',

  // Focus ring
  'focus-ring',
  'focus-ring-',

  // Position
  'position-',
  'top-',
  'bottom-',
  'start-',
  'end-',
  'translate-middle',
  'translate-middle-',

  // Border
  'border',
  'border-',

  // Sizing
  'w-',
  'mw-',
  'vw-',
  'min-vw-',
  'h-',
  'mh-',
  'vh-',
  'min-vh-',

  // Flex
  'flex-',
  'justify-content-',
  'align-items-',
  'align-content-',
  'align-self-',
  'order-',

  // Spacing — margin
  'm-', 'mx-', 'my-', 'mt-', 'me-', 'mb-', 'ms-',

  // Spacing — padding
  'p-', 'px-', 'py-', 'pt-', 'pe-', 'pb-', 'ps-',

  // Gap
  'gap-',
  'row-gap-',
  'column-gap-',

  // Typography
  'font-monospace',
  'fs-',
  'fst-',
  'fw-',
  'lh-',
  'text-decoration-',
  'text-',

  // Color
  'text-opacity-',

  // Link utilities
  'link-opacity-',
  'link-offset-',
  'link-underline',
  'link-underline-',

  // Background
  'bg-',
  'bg-opacity-',
  'bg-gradient',

  // Interaction
  'user-select-',
  'pe-none',
  'pe-auto',

  // Border radius
  'rounded',
  'rounded-',

  // Visibility
  'visible',
  'invisible',

  // Z-index
  'z-',
]

/**
 * Build a map from prefix → order index for fast lookups.
 * Longer prefixes are matched first (most specific wins).
 */
function buildOrderMap() {
  const map = new Map()
  for (const [index, prefix] of CLASS_ORDER.entries()) {
    map.set(prefix, index)
  }
  return map
}

export const ORDER_MAP = buildOrderMap()

/**
 * Return the sort key for a single class name.
 *
 * The key is a tuple [categoryIndex, breakpointIndex] where
 * categoryIndex comes from CLASS_ORDER and breakpointIndex is
 * 0 for the base class or 1-5 for sm..xxl.
 *
 * Unknown classes get categoryIndex = Infinity so they sort last
 * (preserving their relative order among themselves via stable sort).
 */
export function classKey(className) {
  let base = className
  let breakpointIdx = 0

  // Try to extract a responsive infix
  const match = className.match(RESPONSIVE_RE)
  if (match) {
    // Reconstruct the base form without the infix, e.g. "d-md-flex" → "d-flex"
    base = `${match[1]}-${match[3]}`
    breakpointIdx = BREAKPOINTS.indexOf(match[2]) + 1
  }

  // Find the best (longest) matching prefix
  let bestIdx = -1
  let bestLen = 0

  for (const [prefix, idx] of ORDER_MAP) {
    // Exact match or prefix match (prefix ends with '-')
    if (base === prefix || (prefix.endsWith('-') && base.startsWith(prefix))) {
      if (prefix.length > bestLen) {
        bestLen = prefix.length
        bestIdx = idx
      }
    }
  }

  const categoryIndex = bestIdx === -1 ? Infinity : bestIdx
  return [categoryIndex, breakpointIdx]
}

/**
 * Sort an array of class names according to Bootstrap's recommended order.
 *
 * Uses a stable sort so that classes in the same category and breakpoint
 * tier keep their original relative order, and unknown classes stay in
 * their original position relative to each other (appended at the end).
 */
export function sortClasses(classes) {
  // Annotate each class with its original index for stable sorting
  const annotated = classes.map((cls, i) => ({
    cls,
    key: classKey(cls),
    orig: i
  }))

  annotated.sort((a, b) => {
    // Primary: category index
    if (a.key[0] !== b.key[0]) return a.key[0] - b.key[0]
    // Secondary: breakpoint index
    if (a.key[1] !== b.key[1]) return a.key[1] - b.key[1]
    // Tertiary: preserve original order
    return a.orig - b.orig
  })

  return annotated.map((entry) => entry.cls)
}
