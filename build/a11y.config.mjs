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
 *                that have no docs examples to render, or that need a specific,
 *                deterministic structure to drive `interactions`/`assertions`.
 *   interactions (optional) Ordered Playwright steps run *before* axe so a
 *                component can be audited in its open/interactive state. Each
 *                step is one of:
 *                  { click: selector }
 *                  { focus: selector }
 *                  { type: text, on?: selector }
 *                  { press: key, on?: selector }
 *                  { wait: ms }
 *   assertions   (optional) Scripted checks for criteria axe can't verify
 *                statically (keyboard operation, focus order/restore, status
 *                messages). Each assertion is:
 *                  { criterion, label?, steps?: Step[], run: string, expect? }
 *                `steps` run (cumulatively, on the live page) before the check;
 *                `run` is a function body evaluated in-page whose return value is
 *                compared to `expect` (or treated as a boolean when omitted). A
 *                failing assertion on an owned criterion is a CI-breaking FAIL.
 *
 * NOTE — confirmed code gaps (no component fixes in this pass): several criteria
 * below are intentionally *not* marked `built-in` because the component does not
 * yet fully satisfy them in code. They are recorded here with a `note` (and, for
 * a quick scan, prefixed with "GAP:") so a follow-up PR can fix the component and
 * promote the status. See the cross-cutting list at the bottom of this file.
 */

/* eslint-disable @stylistic/max-len -- inline component markup and descriptive criterion notes are intentionally long here */

/** @typedef {{ click?: string, focus?: string, type?: string, press?: string, on?: string, wait?: number }} Step */
/** @typedef {{ criterion: string, status?: 'built-in' | 'partial' | 'author', note?: string }} A11yCriterion */
/** @typedef {{ criterion: string, label?: string, steps?: Step[], run: string, expect?: unknown }} A11yAssertion */
/** @typedef {{ component: string, criteria: A11yCriterion[], examplesFrom?: string, html?: string | string[], interactions?: Step[], assertions?: A11yAssertion[] }} A11yComponent */

/** @type {A11yComponent[]} */
export const a11yComponents = [
  // ---------------------------------------------------------------------------
  // Forms
  // ---------------------------------------------------------------------------
  {
    component: 'forms/otp-input',
    criteria: [
      {
        criterion: '3.3.8',
        status: 'built-in',
        note: 'Each digit input allows paste; pasting a full code distributes it across the fields, and autocomplete=\'one-time-code\' on the first input lets password managers and SMS autofill target it.'
      },
      {
        criterion: '1.3.5',
        status: 'built-in',
        note: 'autocomplete=\'one-time-code\' on the first input plus inputmode=\'numeric\' identify the field\'s purpose.'
      },
      {
        criterion: '3.3.2',
        status: 'built-in',
        note: 'Shipped as multiple single-character inputs: each digit carries its own aria-label (e.g. \'Digit 1\') and the group is labelled via aria-labelledby/aria-describedby on the container.'
      },
      {
        criterion: '4.1.2',
        status: 'built-in',
        note: 'Each digit input exposes a name, role, and value; keep per-digit aria-labels in sync with the field count so the group reads as one code entry.'
      },
      {
        criterion: '2.2.1',
        status: 'author',
        note: 'Give codes a generous expiry (≥ ~60s) for cognitive and motor needs.'
      },
      {
        criterion: '3.3.7',
        status: 'author',
        note: 'Don\'t force re-entry of a code already provided in the same flow.'
      }
    ]
  },
  {
    component: 'forms/combobox',
    html: `<button class="form-control combobox-toggle" type="button"
        data-bs-toggle="combobox"
        data-bs-name="option"
        data-bs-placeholder="Select an item…"
        id="a11yComboboxToggle"
        aria-label="Choose an item">
    <span class="combobox-value">Select an item…</span>
    <svg class="combobox-caret" width="10" height="16" viewBox="0 0 10 16" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.46967 5.46967C0.762563 5.17678 1.23744 5.17678 1.53033 5.46967L5 8.93934L8.46967 5.46967C8.76256 5.17678 9.23744 5.17678 9.53033 5.46967C9.82322 5.76256 9.82322 6.23744 9.53033 6.53033L5.53033 10.5303C5.23744 10.8232 4.76256 10.8232 4.46967 10.5303L0.46967 6.53033C0.176777 6.23744 0.176777 5.76256 0.46967 5.46967Z" fill="currentcolor"/></svg>
  </button>
  <div class="menu">
    <button class="menu-item" type="button" data-bs-value="1">Option one</button>
    <button class="menu-item" type="button" data-bs-value="2">Option two</button>
    <button class="menu-item" type="button" data-bs-value="3">Option three</button>
  </div>`,
    interactions: [
      { click: '#a11yComboboxToggle' },
      { wait: 150 }
    ],
    criteria: [
      {
        criterion: '4.1.2',
        status: 'partial',
        note: 'The component manages aria-expanded on the toggle and aria-selected on items, audited here in the open state. GAP: it does not set role=combobox/listbox/option, aria-controls, or aria-activedescendant, so a complete listbox pattern is still author-supplied.'
      },
      {
        criterion: '4.1.3',
        status: 'partial',
        note: 'GAP: the filtered "no results" message (`.combobox-no-results`) is toggled with `.d-none` and is not wrapped in an aria-live region, so it is not announced to assistive tech.'
      },
      {
        criterion: '2.1.1',
        status: 'partial',
        note: 'Full keyboard navigation (arrows, Home/End, Enter/Space, Esc, Tab) is implemented via the Menu engine; verify manually for full conformance.'
      },
      {
        criterion: '3.3.2',
        status: 'author',
        note: 'Associate a visible <label> (or aria-label) with the toggle; default examples are unlabelled.'
      }
    ]
  },
  {
    component: 'forms/chips',
    examplesFrom: 'forms/chips',
    criteria: [
      {
        criterion: '2.4.7',
        status: 'partial',
        note: 'GAP: chips are focusable (tabindex=0) but their `:focus-visible` ring is currently commented out in scss/_chip.scss, so focused chips may have no visible indicator.'
      },
      {
        criterion: '4.1.3',
        status: 'partial',
        note: 'GAP: adding/removing/selecting chips is not announced. The docs reference a live region that is not implemented in chips.js.'
      },
      {
        criterion: '4.1.2',
        status: 'author',
        note: 'Chips are focusable <span>s. GAP: selected state (`.active`) is visual only and not exposed (no aria-selected/role); dismiss buttons use a generic "Remove" label rather than a contextual one.'
      },
      {
        criterion: '2.1.1',
        status: 'partial',
        note: 'Rich keyboard editing (Enter/separator to add, Backspace/Delete, arrow + Shift range select, Home/End, Cmd/Ctrl+A, Esc) is implemented; verify manually.'
      },
      {
        criterion: '3.3.2',
        status: 'author',
        note: 'Label the ghost input via <label for> (shown in the docs example).'
      }
    ]
  },
  {
    component: 'forms/password-strength',
    examplesFrom: 'forms/password-strength',
    criteria: [
      {
        criterion: '4.1.3',
        status: 'partial',
        note: 'GAP: `.strength-text` is updated (e.g. "Weak" → "Strong") without an aria-live region, so strength changes are silent to screen readers.'
      },
      {
        criterion: '4.1.2',
        status: 'author',
        note: 'GAP: the meter lacks role=progressbar with aria-valuenow/min/max, and the decorative segments are not aria-hidden.'
      },
      {
        criterion: '3.3.2',
        status: 'author',
        note: 'Strength feedback should supplement (via aria-describedby) explicit password requirements, not replace them.'
      }
    ]
  },
  {
    component: 'forms/switch',
    examplesFrom: 'forms/switch',
    criteria: [
      {
        criterion: '4.1.2',
        status: 'built-in',
        note: 'Native <input type="checkbox"> with role="switch" exposes the correct name, role, and on/off state.'
      },
      {
        criterion: '3.3.2',
        status: 'built-in',
        note: 'Each switch is paired with a <label for>.'
      },
      {
        criterion: '2.4.7',
        status: 'built-in',
        note: 'A focus ring is drawn on the wrapper via :focus-within (not machine-checkable; verify visually).'
      }
    ]
  },
  {
    component: 'forms/range',
    examplesFrom: 'forms/range',
    criteria: [
      {
        criterion: '3.3.2',
        status: 'built-in',
        note: 'Range inputs are paired with a <label for>.'
      },
      {
        criterion: '2.4.7',
        status: 'built-in',
        note: 'The thumb shows a :focus-visible ring (verify visually).'
      },
      {
        criterion: '4.1.2',
        status: 'author',
        note: 'Native <input type="range"> exposes the slider role/value. GAP in the docs example: the live <output> is marked aria-hidden="true", hiding the current value from assistive tech.'
      }
    ]
  },
  {
    component: 'forms/field',
    examplesFrom: 'forms/field',
    criteria: [
      {
        criterion: '3.3.2',
        status: 'author',
        note: 'Layout helper only — it positions label/control/description/feedback but cannot enforce label association.'
      },
      {
        criterion: '1.3.1',
        status: 'author',
        note: 'Group related radios/checkboxes in a <fieldset>/<legend>; the field grid does not impose grouping semantics.'
      },
      {
        criterion: '4.1.3',
        status: 'author',
        note: 'Validation feedback (`.invalid-feedback`/`.valid-feedback`) is shown via CSS only; add role="alert" or an aria-live region so errors are announced.'
      }
    ]
  },
  {
    component: 'forms/form-adorn',
    examplesFrom: 'forms/form-adorn',
    criteria: [
      {
        criterion: '2.4.7',
        status: 'built-in',
        note: 'The wrapper shows a focus ring via :focus-within while the inner ghost input keeps native focus (verify visually).'
      },
      {
        criterion: '3.3.2',
        status: 'author',
        note: 'Place the <label> outside the adorn wrapper (shown in the docs example) so it associates with the input.'
      },
      {
        criterion: '1.1.1',
        status: 'author',
        note: 'Mark decorative leading/trailing icons as aria-hidden="true" so they are not announced.'
      }
    ]
  },
  {
    component: 'forms/datepicker',
    examplesFrom: 'forms/datepicker',
    criteria: [
      {
        criterion: '2.1.1',
        status: 'author',
        note: 'Keyboard operation of the calendar is delegated to Vanilla Calendar Pro; audit the upstream widget separately.'
      },
      {
        criterion: '4.1.2',
        status: 'author',
        note: 'The Bootstrap wrapper sets no ARIA; calendar name/role/value semantics come entirely from Vanilla Calendar Pro. The docs have no dedicated Accessibility section yet.'
      },
      {
        criterion: '1.3.5',
        status: 'author',
        note: 'Add an appropriate autocomplete token (e.g. bday) on date inputs so they can be autofilled.'
      },
      {
        criterion: '4.1.3',
        status: 'author',
        note: 'Date selection updates the input/display silently; announce confirmations where useful.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Components
  // ---------------------------------------------------------------------------
  {
    component: 'components/menu',
    html: `<button class="btn-solid theme-primary" type="button" id="a11yMenuToggle" data-bs-toggle="menu" aria-expanded="false">
    Toggle menu
  </button>
  <div class="menu">
    <a class="menu-item" href="#">Menu item 1</a>
    <a class="menu-item" href="#">Menu item 2</a>
    <a class="menu-item" href="#">Menu item 3</a>
  </div>`,
    interactions: [
      { click: '#a11yMenuToggle' },
      { wait: 150 }
    ],
    assertions: [
      {
        criterion: '2.1.1',
        label: 'ArrowDown from the open toggle moves focus to a menu item',
        steps: [{ press: 'ArrowDown' }, { wait: 100 }],
        run: 'return !!(document.activeElement && document.activeElement.classList.contains(\'menu-item\'))'
      }
    ],
    criteria: [
      {
        criterion: '2.1.1',
        status: 'built-in',
        note: 'Full keyboard support: arrows to move, Enter/Space to activate, Esc to close, Home/End to jump, Tab to move on. Verified here: ArrowDown moves focus into the menu.'
      },
      {
        criterion: '1.4.13',
        status: 'built-in',
        note: 'Submenus opened on hover stay open while hovered and dismiss with Esc, with a grace delay for diagonal movement.'
      },
      {
        criterion: '2.4.7',
        status: 'built-in',
        note: 'Focused menu items show a visible focus indicator (verify visually).'
      },
      {
        criterion: '4.1.2',
        status: 'author',
        note: 'Menus are intentionally generic—add role=\'menu\'/\'menuitem\' and aria-* yourself when building a true ARIA menu widget.'
      }
    ]
  },
  {
    component: 'components/tab',
    html: `<ul class="nav nav-tabs" id="a11yTab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="a11yTabHome" data-bs-toggle="tab" data-bs-target="#a11yTabHomePane" type="button" role="tab" aria-controls="a11yTabHomePane" aria-selected="true">Home</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="a11yTabProfile" data-bs-toggle="tab" data-bs-target="#a11yTabProfilePane" type="button" role="tab" aria-controls="a11yTabProfilePane" aria-selected="false">Profile</button>
    </li>
  </ul>
  <div class="tab-content">
    <div class="tab-pane fade show active" id="a11yTabHomePane" role="tabpanel" aria-labelledby="a11yTabHome" tabindex="0"><p>Home content.</p></div>
    <div class="tab-pane fade" id="a11yTabProfilePane" role="tabpanel" aria-labelledby="a11yTabProfile" tabindex="0"><p>Profile content.</p></div>
  </div>`,
    interactions: [
      { focus: '#a11yTabHome' }
    ],
    assertions: [
      {
        criterion: '2.1.1',
        label: 'ArrowRight moves roving focus to the next tab',
        steps: [{ press: 'ArrowRight' }, { wait: 100 }],
        run: 'return document.activeElement && document.activeElement.id === \'a11yTabProfile\''
      }
    ],
    criteria: [
      {
        criterion: '2.1.1',
        status: 'built-in',
        note: 'Arrow/Home/End keys move a roving tabindex across tabs and activate the focused tab. Verified here: ArrowRight advances focus.'
      },
      {
        criterion: '4.1.2',
        status: 'partial',
        note: 'JS sets role=tablist/tab/tabpanel, aria-selected, aria-labelledby, and a roving tabindex (audited here). GAP: it does not set aria-controls (author must) and does not aria-hidden inactive panels.'
      },
      {
        criterion: '2.4.3',
        status: 'partial',
        note: 'GAP: `_deactivate()` calls blur() on the outgoing tab, which can momentarily drop focus; verify focus order across panels manually.'
      }
    ]
  },
  {
    component: 'components/dialog',
    html: `<button type="button" class="btn-solid theme-primary" id="a11yDialogTrigger" data-bs-toggle="dialog" data-bs-target="#a11yDialog">
    Open dialog
  </button>
  <dialog class="dialog" id="a11yDialog" aria-labelledby="a11yDialogTitle">
    <div class="dialog-header">
      <h1 class="dialog-title" id="a11yDialogTitle">Dialog title</h1>
      <button type="button" class="btn-close" data-bs-dismiss="dialog" aria-label="Close"></button>
    </div>
    <div class="dialog-body">
      <p>This is a native dialog element using the browser's modal behavior.</p>
    </div>
    <div class="dialog-footer">
      <button type="button" class="btn-solid theme-secondary" data-bs-dismiss="dialog">Close</button>
    </div>
  </dialog>`,
    interactions: [
      { click: '#a11yDialogTrigger' },
      { wait: 200 }
    ],
    assertions: [
      {
        criterion: '2.1.2',
        label: 'Escape closes the modal and restores focus to the trigger',
        steps: [{ press: 'Escape' }, { wait: 800 }],
        run: 'return document.activeElement && document.activeElement.id === \'a11yDialogTrigger\''
      }
    ],
    criteria: [
      {
        criterion: '4.1.2',
        status: 'built-in',
        note: 'Native <dialog> opened via showModal() exposes role=dialog and aria-modal; audited here in the open state with a labelled title and dismiss control.'
      },
      {
        criterion: '2.1.2',
        status: 'built-in',
        note: 'Esc closes the modal and focus returns to the trigger. Verified here.'
      },
      {
        criterion: '2.4.3',
        status: 'partial',
        note: 'Focus is trapped while open and restored on close by the platform. When swapping dialogs, manage initial focus so the order stays logical.'
      }
    ]
  },
  {
    component: 'components/drawer',
    html: `<dialog class="drawer drawer-start show" open tabindex="-1" id="a11yDrawer" aria-labelledby="a11yDrawerLabel">
    <div class="drawer-header">
      <h5 class="drawer-title" id="a11yDrawerLabel">Drawer</h5>
      <button type="button" class="btn-close" data-bs-dismiss="drawer" aria-label="Close"></button>
    </div>
    <div class="drawer-body">Content for the drawer goes here.</div>
  </dialog>`,
    criteria: [
      {
        criterion: '4.1.2',
        status: 'built-in',
        note: 'Built on the native <dialog>; audited here in its open state with an aria-labelledby title and a labelled close button.'
      },
      {
        criterion: '2.1.2',
        status: 'partial',
        note: 'Modal drawers trap focus natively and dismiss with Esc; non-modal (scroll/backdrop:false) modes intentionally let focus leave. Verify the swipe-to-dismiss gesture has a keyboard equivalent (Esc/close button).'
      },
      {
        criterion: '2.4.3',
        status: 'partial',
        note: 'Author must wire aria-labelledby to the drawer title; focus is restored to the trigger on close. Verify focus order manually.'
      }
    ]
  },
  {
    component: 'components/nav-overflow',
    examplesFrom: 'components/nav-overflow',
    criteria: [
      {
        criterion: '4.1.2',
        status: 'author',
        note: 'The auto-created overflow toggle gets aria-expanded. GAP: it has no aria-controls linking it to the overflow menu, and cloned overflow links may duplicate the originals\' ids.'
      },
      {
        criterion: '2.1.1',
        status: 'author',
        note: 'Overflowed items are only reachable through the "More" menu (an extra step); ensure that flow is keyboard-operable for your nav.'
      },
      {
        criterion: '2.4.3',
        status: 'author',
        note: 'The DOM order of cloned overflow items can differ from the visual priority order; check the resulting focus order.'
      }
    ]
  },
  {
    component: 'components/stepper',
    examplesFrom: 'components/stepper',
    criteria: [
      {
        criterion: '4.1.2',
        status: 'author',
        note: 'The stepper is a styled <ol>/<li> list. GAP: the current step is conveyed by `.active` only — add aria-current="step" (or role=progressbar with aria-valuenow) to expose progress.'
      },
      {
        criterion: '1.4.1',
        status: 'author',
        note: 'Step state is signalled with color; add a text/icon cue so it is not conveyed by color alone.'
      },
      {
        criterion: '2.4.7',
        status: 'author',
        note: 'Interactive (anchor/button) stepper items have no component focus style; ensure a visible focus indicator.'
      }
    ]
  },
  {
    component: 'components/avatar',
    examplesFrom: 'components/avatar',
    criteria: [
      {
        criterion: '1.1.1',
        status: 'author',
        note: 'Image avatars need meaningful alt text; decorative ones should use empty alt.'
      },
      {
        criterion: '4.1.2',
        status: 'author',
        note: 'Initials-only and stacked ("+5") avatars need an author-supplied accessible name (e.g. aria-label).'
      },
      {
        criterion: '1.4.1',
        status: 'author',
        note: 'Status dots convey meaning via color/shape; pair them with role="img" + aria-label (shown in the docs).'
      }
    ]
  },
  {
    component: 'components/toggler',
    examplesFrom: 'components/toggler',
    criteria: [
      {
        criterion: '2.1.1',
        status: 'author',
        note: 'GAP: self-toggling <div> examples are click-only and not focusable; use a <button> (or add tabindex + key handling) so the toggle is keyboard-operable.'
      },
      {
        criterion: '4.1.2',
        status: 'author',
        note: 'When toggling hidden/disabled/aria-* state, drive it from a real control that exposes the state to assistive tech.'
      }
    ]
  },
  {
    component: 'components/tooltip',
    examplesFrom: 'components/tooltip',
    criteria: [
      {
        criterion: '1.4.13',
        status: 'partial',
        note: 'GAP: hover-triggered tooltips are not Esc-dismissable and are not hoverable (they hide on mouseleave), so they don\'t meet dismissable/hoverable/persistent for pointer users.'
      },
      {
        criterion: '4.1.2',
        status: 'author',
        note: 'The trigger gets aria-describedby pointing at the role="tooltip" tip while shown; ensure the trigger has its own accessible name.'
      }
    ]
  },
  {
    component: 'components/popover',
    examplesFrom: 'components/popover',
    criteria: [
      {
        criterion: '1.4.13',
        status: 'partial',
        note: 'Click-triggered popovers dismiss on outside click; for hover triggers verify they are dismissable/hoverable/persistent.'
      },
      {
        criterion: '2.4.3',
        status: 'author',
        note: 'Interactive popover content is placed in the DOM near the trigger but can produce an illogical focus/reading order; manage focus for rich content.'
      },
      {
        criterion: '4.1.2',
        status: 'author',
        note: 'role="tooltip" is reused for popovers; for rich/interactive content provide more appropriate roles and an accessible name.'
      }
    ]
  },
  {
    component: 'components/toasts',
    examplesFrom: 'components/toasts',
    criteria: [
      {
        criterion: '4.1.3',
        status: 'author',
        note: 'Toasts carry no ARIA by default; add role="status"/"alert", aria-live, and aria-atomic (and a pre-existing live region for dynamically injected toasts) so they are announced.'
      },
      {
        criterion: '2.2.1',
        status: 'author',
        note: 'Autohide defaults to ~5s; it pauses on hover/focus, but give users enough time (or disable autohide) for toasts with actions.'
      }
    ]
  }
]
