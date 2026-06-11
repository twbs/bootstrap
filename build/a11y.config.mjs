/*!
 * Unified accessibility test config.
 *
 * Single source of truth for *which* WCAG criteria each component is tested
 * against, and our coverage status for each. This replaces the per-page
 * `accessibility:` frontmatter so the mapping lives in one place owned by the
 * test suite rather than scattered across docs.
 *
 * The criterion catalog (titles, levels, "Understanding" URLs) and the
 * criterion -> axe rule mapping live in the shared catalog at
 * site/src/data/wcag.ts. This file only *selects* criteria per component and is
 * validated against that catalog at runtime by build/test-a11y.mjs.
 *
 * Entry shape:
 *   component   Logical id; also the default docs path the test renders from,
 *               i.e. site/src/content/docs/<component>.mdx (its `<Example>`
 *               snippets are the markup under test).
 *   criteria[]  { criterion, status?, note? }
 *                 criterion  Key into wcagCriteria (e.g. '4.1.2').
 *                 status     'built-in' | 'partial' | 'author' (default 'author').
 *                              built-in/partial -> machine-checkable criteria are
 *                              asserted PASS/FAIL; author -> reported only.
 *                 note       Optional rationale shown in the report.
 *   examplesFrom (optional) Pull markup from a different docs path.
 *   html         (optional) Inline markup (string or string[]) for components
 *                that have no docs examples to render.
 */

/** @typedef {{ criterion: string, status?: 'built-in' | 'partial' | 'author', note?: string }} A11yCriterion */
/** @typedef {{ component: string, criteria: A11yCriterion[], examplesFrom?: string, html?: string | string[] }} A11yComponent */

/** @type {A11yComponent[]} */
export const a11yComponents = [
  {
    component: 'forms/otp-input',
    criteria: [
      {
        criterion: '3.3.8',
        status: 'built-in',
        note: "A single real input with autocomplete='one-time-code' never blocks copy/paste, so password managers and SMS autofill target it reliably."
      },
      {
        criterion: '1.3.5',
        status: 'built-in',
        note: "autocomplete='one-time-code' and inputmode identify the field's purpose."
      },
      {
        criterion: '3.3.2',
        status: 'built-in',
        note: 'Label the one field once with aria-label or a <label>; no per-digit aria-labels.'
      },
      {
        criterion: '4.1.2',
        status: 'built-in',
        note: 'One input exposes one correct name, role, and value—not six edit fields.'
      },
      {
        criterion: '2.2.1',
        status: 'author',
        note: 'Give codes a generous expiry (≥ ~60s) for cognitive and motor needs.'
      },
      {
        criterion: '3.3.7',
        status: 'author',
        note: "Don't force re-entry of a code already provided in the same flow."
      }
    ]
  },
  {
    component: 'components/menu',
    criteria: [
      {
        criterion: '2.1.1',
        status: 'built-in',
        note: 'Full keyboard support: arrows to move, Enter/Space to activate, Esc to close, Home/End to jump, Tab to move on.'
      },
      {
        criterion: '1.4.13',
        status: 'built-in',
        note: 'Submenus opened on hover stay open while hovered and dismiss with Esc, with a grace delay for diagonal movement.'
      },
      {
        criterion: '2.4.7',
        status: 'built-in',
        note: 'Focused menu items show a visible focus indicator.'
      },
      {
        criterion: '4.1.2',
        status: 'author',
        note: "Menus are intentionally generic—add role='menu'/'menuitem' and aria-* yourself when building a true ARIA menu widget."
      }
    ]
  }
]
