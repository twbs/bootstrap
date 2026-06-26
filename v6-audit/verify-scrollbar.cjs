// Verifies the dialog scroll-lock fix: with `scrollbar-gutter: stable` on :root,
// applying `overflow: hidden` to the ROOT keeps the gutter reserved (no shift),
// whereas applying it to BODY (old behavior) drops the gutter and shifts content.
// A styled ::-webkit-scrollbar forces a classic, space-taking scrollbar so the
// shift is reproducible regardless of the host OS's overlay-scrollbar setting.
const { chromium } = require('playwright')

const html = `<!doctype html><html><head><style>
  :root { scrollbar-gutter: stable; }
  ::-webkit-scrollbar { width: 15px; }
  ::-webkit-scrollbar-thumb { background: #888; }
  body { margin: 0; }
  .tall { height: 3000px; }
  .marker { position: fixed; inset-block-start: 0; inset-inline: 0; height: 10px; }
  /* Rule under test (new): lock on the root, co-located with scrollbar-gutter */
  :root.dialog-open { overflow: hidden; }
  /* Old behavior for comparison: lock on the body */
  body.lock-body { overflow: hidden; }
</style></head><body>
  <div class="marker"></div><div class="tall"></div>
</body></html>`

const measure = () => ({
  clientWidth: document.documentElement.clientWidth,
  markerRight: document.querySelector('.marker').getBoundingClientRect().right
})

;(async () => {
  const browser = await chromium.launch({ args: ['--disable-features=OverlayScrollbar', '--disable-features=OverlayScrollbars'] })
  const page = await browser.newPage({ viewport: { width: 1000, height: 600 } })
  await page.setContent(html)

  const baseline = await page.evaluate(measure)

  const rootLock = await page.evaluate(() => {
    document.documentElement.classList.add('dialog-open')
    const m = { clientWidth: document.documentElement.clientWidth, markerRight: document.querySelector('.marker').getBoundingClientRect().right }
    document.documentElement.classList.remove('dialog-open')
    return m
  })

  const bodyLock = await page.evaluate(() => {
    document.body.classList.add('lock-body')
    const m = { clientWidth: document.documentElement.clientWidth, markerRight: document.querySelector('.marker').getBoundingClientRect().right }
    document.body.classList.remove('lock-body')
    return m
  })

  const shift = (a, b) => b.clientWidth - a.clientWidth
  console.log('baseline      ', baseline)
  console.log('lock on :root ', rootLock, '-> shift:', shift(baseline, rootLock), 'px')
  console.log('lock on body  ', bodyLock, '-> shift:', shift(baseline, bodyLock), 'px')
  console.log('')
  console.log('gutter reserved at baseline? ', 1000 - baseline.clientWidth, 'px reserved (expect ~15)')
  console.log('RESULT: root-lock shift =', shift(baseline, rootLock), '| body-lock shift =', shift(baseline, bodyLock))

  await browser.close()
})()
