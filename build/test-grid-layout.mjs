/* eslint-disable no-await-in-loop -- Cases share one browser page and must run sequentially. */
import assert from 'node:assert/strict'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as sass from 'sass'
import { chromium, firefox, webkit } from 'playwright'

const root =
  process.env.GRID_TEST_ROOT ||
  fileURLToPath(new URL('../', import.meta.url))
const engine = process.env.GRID_TEST_BROWSER || 'chromium'
const browsers = { chromium, firefox, webkit }
assert.ok(browsers[engine], `Unknown browser: ${engine}`)
const browser = await browsers[engine].launch({
  headless: true,
  timeout: 15000,
  ...(process.env.GRID_TEST_EXECUTABLE ?
    { executablePath: process.env.GRID_TEST_EXECUTABLE } :
    {}),
  ...(process.env.GRID_TEST_CHANNEL ?
    { channel: process.env.GRID_TEST_CHANNEL } :
    {})
})
const compile = columns =>
  sass.compileString(
    `@use "bootstrap"${columns ? ` with ($grid-columns: ${columns})` : ''};`,
    {
      loadPaths: [path.join(root, 'scss')]
    }
  ).css
const css = compile()
const near = (actual, expected, name) =>
  assert.ok(
    Math.abs(actual - expected) < 0.15,
    `${name}: ${actual} != ${expected}`
  )
const column = (span, extra = '') =>
  `<div class="col-${span} cell ${extra}"></div>`
let checks = 0

try {
  const page = await browser.newPage()
  await page.route('**/*', route => route.abort())
  async function render(
    markup,
    { width = 1200, dir = 'ltr', viewport = 1400, styles = css } = {}
  ) {
    await page.setViewportSize({ width: viewport, height: 900 })
    await page.setContent(
      `<html dir="${dir}"><head><style>${styles}
body{margin:0}
.fixture{width:${width}px;max-width:100%}
.row{--gutter-y:16px}
.cell{min-height:20px;background:#ddd}
.standalone{--gutter-x:99px}
</style></head><body><div class="fixture">${markup}</div></body></html>`
    )
  }

  async function boxes(selector = '.fixture > .row') {
    return page.locator(selector).evaluateAll(rows =>
      rows.map(row => {
        // eslint-disable-next-line unicorn/consistent-function-scoping -- This callback runs in the browser.
        const rect = element => {
          const r = element.getBoundingClientRect()
          return {
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
            right: r.right,
            bottom: r.bottom
          }
        }

        return { row: rect(row), children: [...row.children].map(rect) }
      })
    )
  }

  // Every ordered two- and three-column partition of twelve, including fractional widths.
  const partitions = []
  for (let a = 1; a < 12; a++) {
    partitions.push([a, 12 - a])
    for (let b = 1; b < 12 - a; b++) {
      partitions.push([a, b, 12 - a - b])
    }
  }

  const scenarios = [1200, 671.5, 320].flatMap(width =>
    ['ltr', 'rtl'].map(dir => ({ width, dir }))
  )
  for (const { width, dir } of scenarios) {
    await render(
      partitions
          .map(
            spans =>
              `<div class="row">${spans.map(s => column(s)).join('')}</div>`
          )
          .join(''),
      { width, dir }
    )
    const layouts = await boxes()
    for (const [index, { row, children }] of layouts.entries()) {
      for (const [j, child] of children.entries()) {
        near(
          child.width,
          (((width + 24) * partitions[index][j]) / 12) - 24,
          'numbered width'
        )
        near(child.y, row.y, 'partition must not wrap')
        const previous = children[j - 1] || row
        near(
          dir === 'ltr' ?
            child.x - (j ? previous.right : row.x) :
            (j ? previous.x : row.right) - child.right,
          j ? 24 : 0,
          'horizontal gap and row edge'
        )
      }

      checks++
    }
  }

  for (const dir of ['ltr', 'rtl']) {
    await render(
      `${Array.from(
        { length: 11 },
        (_, i) => `<div class="row">${column(11 - i, `offset-${i + 1}`)}</div>`
      ).join('')
      }<div class="row" id="mixed">${column(3)}${column(6, 'offset-3')}</div>`,
      { dir }
    )
    const offsetLayouts = await boxes()
    for (const [i, { row, children }] of offsetLayouts.entries()) {
      const last = children.at(-1)
      near(
        dir === 'ltr' ? last.right : row.right - last.x,
        1200,
        'offset reaches row end'
      )
      if (i < 11) {
        near(
          dir === 'ltr' ? last.x - row.x : row.right - last.right,
          (1224 * (i + 1)) / 12,
          'offset tracks'
        )
      }

      checks++
    }
  }

  await render(`<div class="row">${column(8)}${column(6)}</div>`)
  let [layout] = await boxes()
  near(layout.children[1].y - layout.children[0].bottom, 16, 'wrapped row gap')
  near(layout.children[1].x, layout.row.x, 'wrapped column starts at row edge')
  checks++

  await render(
    `<div class="row"><div class="col cell"></div><div class="col-auto cell">Auto</div>${column(6)}</div>`
  );
  [layout] = await boxes()
  near(layout.children[2].width, 588, 'fixed column alongside auto columns')
  near(
    layout.children[0].width +
      layout.children[1].width +
      layout.children[2].width +
      48,
    1200,
    'auto fills remaining width'
  )
  checks++

  await render(
    `<div class="row row-cols-3">${Array.from({ length: 5 }, () => '<div class="cell"></div>').join('')}</div>`
  );
  [layout] = await boxes()
  for (const child of layout.children) {
    near(child.width, 384, 'row-cols width')
  }

  near(layout.children[3].x, layout.row.x, 'row-cols wraps')
  near(
    layout.children[3].y - layout.children[0].bottom,
    16,
    'row-cols vertical gap'
  )
  checks++

  await render(
    `<div class="row"><div class="col-6"><div class="row">${column(3)}${column(9)}</div><div class="standalone col-6 cell"></div></div>${column(6)}</div><div class="standalone col-6 cell"></div>`
  )
  const [nested] = await boxes('.row .row')
  near(nested.row.width, 588, 'nested row has no negative margins')
  near(nested.children[0].width, 129, 'nested span')
  near(nested.children[1].right, nested.row.right, 'nested row fills parent')
  near(
    await page
      .locator('.fixture > .standalone')
      .evaluate(e => e.getBoundingClientRect().width),
    600,
    'standalone percentage width'
  )
  near(
    await page
      .locator('.row .standalone')
      .evaluate(e => e.getBoundingClientRect().width),
    294,
    'non-direct child keeps percentage width'
  )
  checks++

  // Responsive row-cols must retain the original specificity against numbered columns.
  for (const viewport of [375, 900]) {
    await render(
      `<div class="row row-cols-2 md:row-cols-3">${column(6)}${column(6)}${column(6)}</div><div class="row">${column(6, 'offset-6 md:offset-0')}</div>`,
      { width: viewport, viewport }
    )
    const [responsive, offset] = await boxes()
    const count = viewport < 768 ? 2 : 3
    near(
      responsive.children[0].width,
      ((responsive.row.width + 24) / count) - 24,
      'responsive row-cols overrides'
    )
    near(
      offset.children[0].x,
      viewport < 768 ? (offset.row.width + 24) / 2 : 0,
      'responsive offset reset'
    )
    checks++
  }

  await render(`<div class="row g-0">${column(6)}${column(6)}</div>`);
  [layout] = await boxes()
  near(layout.children[0].width, 600, 'zero gutter width')
  near(layout.children[1].x - layout.children[0].right, 0, 'zero gutter gap')
  checks++

  await render(
    '<div class="row row-cols-3 g-0"><div></div><div></div><div></div></div>'
  );
  [layout] = await boxes()
  for (const child of layout.children) {
    near(child.width, 400, 'zero gutter row-cols')
  }

  checks++

  await render(`<div class="row">${column(3)}${column(7)}</div>`, {
    styles: compile(10)
  });
  [layout] = await boxes()
  near(layout.children[0].width, 343.2, 'custom column count')
  near(layout.children[1].right, 1200, 'custom grid fills row')
  checks++

  const gridOnly = sass.compile(path.join(root, 'scss/bootstrap-grid.scss')).css
  for (const styles of [css, gridOnly]) {
    for (const dir of ['ltr', 'rtl']) {
      await render(
        `<div class="row row-cols-2">${column(6)}${column(6)}</div>`,
        { dir, styles: `${styles} .cell { padding: 12px; border: 2px solid; }` }
      );
      [layout] = await boxes()
      near(layout.children[0].width, 588, 'padded column includes borders and padding')
      near(layout.children[1].y, layout.children[0].y, 'padded columns do not wrap without reboot')
      checks++
    }
  }

  if (process.env.GRID_TEST_SCREENSHOT) {
    await render(
      `<div class="row">${column(3)}${column(3)}${column(6)}</div><div class="row">${column(9, 'offset-3')}</div>`
    )
    await page
      .locator('.fixture')
      .screenshot({ path: process.env.GRID_TEST_SCREENSHOT })
  }

  console.log(`${checks} grid layouts passed in ${engine}.`)
} finally {
  await browser.close()
}
