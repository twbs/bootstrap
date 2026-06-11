// Central WCAG criterion catalog.
//
// SPIKE NOTE — provenance & maintenance:
// The canonical metadata for each criterion (title, level, version, and the
// "Understanding" URL) is derived from the W3C WCAG 2.2 specification. Rather
// than hand-maintaining this map long-term, it is intended to be *generated*
// from an OSS serialization of the standard — `wcag-as-json`
// (https://github.com/tenon-io/wcag-as-json, MIT-licensed, covers WCAG 2.2) or
// the official W3C JSON serialization in w3c/wcag. There is no OSS source that
// maps *components* to criteria, so the per-component selection + notes (see
// each page's `accessibility` frontmatter) is authored by us — that mapping is
// the bespoke, value-add half of this feature.
//
// The `summary` field below is our own terse one-liner (not the spec's verbose
// "Understanding" prose) so it reads well inside the toolbar menu.

export type WcagLevel = 'A' | 'AA' | 'AAA'

export interface WcagCriterion {
  /** Human-readable criterion name, e.g. "Identify Input Purpose". */
  title: string
  /** Conformance level. */
  level: WcagLevel
  /** WCAG version the criterion was introduced in. */
  version: '2.0' | '2.1' | '2.2'
  /** Link to the W3C "Understanding" page. */
  url: string
  /** Our terse, menu-friendly gloss of what the criterion requires. */
  summary: string
}

export const wcagCriteria = {
  '1.1.1': {
    title: 'Non-text Content',
    level: 'A',
    version: '2.0',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html',
    summary: 'Non-text content has a text alternative (e.g. alt text), or is marked decorative so it can be ignored.'
  },
  '1.3.1': {
    title: 'Info and Relationships',
    level: 'A',
    version: '2.0',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html',
    summary: 'Structure and relationships conveyed visually are also exposed programmatically (lists, labels, groups).'
  },
  '1.3.5': {
    title: 'Identify Input Purpose',
    level: 'AA',
    version: '2.1',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html',
    summary: 'Programmatically identify a field’s purpose (e.g. autocomplete tokens) so it can be autofilled.'
  },
  '1.4.1': {
    title: 'Use of Color',
    level: 'A',
    version: '2.0',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html',
    summary: 'Color is never the only means of conveying information, indicating an action, or distinguishing a state.'
  },
  '1.4.3': {
    title: 'Contrast (Minimum)',
    level: 'AA',
    version: '2.0',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
    summary: 'Text and meaningful UI have at least a 4.5:1 contrast ratio against their background.'
  },
  '1.4.11': {
    title: 'Non-text Contrast',
    level: 'AA',
    version: '2.1',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html',
    summary: 'UI components and meaningful graphics have at least a 3:1 contrast ratio against adjacent colors.'
  },
  '1.4.13': {
    title: 'Content on Hover or Focus',
    level: 'AA',
    version: '2.1',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html',
    summary: 'Content shown on hover/focus is dismissable, hoverable, and persistent until dismissed.'
  },
  '2.1.1': {
    title: 'Keyboard',
    level: 'A',
    version: '2.0',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html',
    summary: 'All functionality is operable through a keyboard, without requiring specific timings.'
  },
  '2.1.2': {
    title: 'No Keyboard Trap',
    level: 'A',
    version: '2.0',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html',
    summary: 'Keyboard focus can always be moved away from a component using only the keyboard.'
  },
  '2.2.1': {
    title: 'Timing Adjustable',
    level: 'A',
    version: '2.0',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html',
    summary: 'Users can turn off, adjust, or extend any time limit before it expires.'
  },
  '2.4.3': {
    title: 'Focus Order',
    level: 'A',
    version: '2.0',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html',
    summary: 'Focusable elements receive focus in an order that preserves meaning and operability.'
  },
  '2.4.7': {
    title: 'Focus Visible',
    level: 'AA',
    version: '2.0',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html',
    summary: 'Any keyboard-focusable element has a visible focus indicator.'
  },
  '2.5.3': {
    title: 'Label in Name',
    level: 'A',
    version: '2.1',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html',
    summary: 'A control’s accessible name contains the visible label text.'
  },
  '3.3.2': {
    title: 'Labels or Instructions',
    level: 'A',
    version: '2.0',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html',
    summary: 'Provide labels or instructions when content requires user input.'
  },
  '3.3.7': {
    title: 'Redundant Entry',
    level: 'A',
    version: '2.2',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html',
    summary: 'Don’t force users to re-enter information already provided in the same process.'
  },
  '3.3.8': {
    title: 'Accessible Authentication (Minimum)',
    level: 'AA',
    version: '2.2',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html',
    summary: 'Don’t block copy/paste or autofill of codes and passwords; allow a cognitive function test alternative.'
  },
  '4.1.2': {
    title: 'Name, Role, Value',
    level: 'A',
    version: '2.0',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
    summary: 'Controls expose a correct name, role, state, and value to assistive technologies.'
  },
  '4.1.3': {
    title: 'Status Messages',
    level: 'AA',
    version: '2.1',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html',
    summary: 'Status messages can be conveyed to assistive technologies without receiving focus (e.g. aria-live).'
  }
} as const satisfies Record<string, WcagCriterion>

export type WcagCriterionId = keyof typeof wcagCriteria

export const wcagCriterionIds = Object.keys(wcagCriteria) as WcagCriterionId[]

/** Status of a criterion for a given component. */
export const a11yStatuses = ['built-in', 'partial', 'author'] as const
export type A11yStatus = (typeof a11yStatuses)[number]

export const a11yStatusLabels: Record<A11yStatus, string> = {
  'built-in': 'Built in',
  partial: 'Partially handled',
  author: 'Your responsibility'
}

export const a11yStatusDescriptions: Record<A11yStatus, string> = {
  'built-in': 'Handled by the component out of the box.',
  partial: 'The component helps, but you must finish the job.',
  author: 'Your app must satisfy this — the component can’t enforce it.'
}

// Maps a WCAG criterion to the axe-core rule ids that can *automatically* verify
// it against rendered markup. The a11y test suite (build/test-a11y.mjs) runs only
// these rules per criterion; a criterion absent from this map is reported as
// "manual" (needs human review) rather than silently passing. Each axe rule is
// listed under exactly one criterion so a violation maps back unambiguously.
//
// Some criteria axe can't evaluate statically (keyboard operation, focus order,
// status-message announcements) are instead verified by the harness's scripted
// `assertions` path (see build/test-a11y.mjs), not by an axe rule. Criteria that
// are neither axe-mapped nor backed by an assertion report as "manual".
//
// Rule reference: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
export const wcagAxeRules: Partial<Record<WcagCriterionId, readonly string[]>> = {
  '1.1.1': ['image-alt', 'input-image-alt', 'role-img-alt', 'svg-img-alt', 'object-alt', 'area-alt'],
  '1.3.1': ['list', 'listitem', 'definition-list', 'dlitem', 'aria-required-children', 'aria-required-parent'],
  '1.3.5': ['autocomplete-valid'],
  '1.4.3': ['color-contrast'],
  '2.5.3': ['label-in-name'],
  '3.3.2': ['label', 'form-field-multiple-labels'],
  '4.1.2': [
    'button-name',
    'link-name',
    'input-button-name',
    'select-name',
    'aria-allowed-attr',
    'aria-required-attr',
    'aria-roles',
    'aria-valid-attr',
    'aria-valid-attr-value',
    'aria-command-name',
    'aria-toggle-field-name',
    'aria-input-field-name'
  ]
}
