// Verifies the functional risk I flagged: does `overflow: hidden` on the ROOT
// element actually lock background scrolling? (The no-shift gutter behavior is a
// rendering property that headless Chromium can't reproduce — no scrollbar layout
// — but scroll-locking IS observable here.)
const { chromium } = require('playwright')

const html = `<!doctype html><html><head><style>
  :root { scrollbar-gutter: stable; }
  body { margin: 0; }
  .tall { height: 5000px; }
  :root.dialog-open { overflow: hidden; }   /* the fix */
  body.lock-body { overflow: hidden; }       /* old behavior */
</style></head><body><div class="tall"></div></body></html>`

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1000, height: 600 } })
  await page.setContent(html)

  const tryScroll = async () => {
    await page.evaluate(() => window.scrollTo(0, 1200))
    return page.evaluate(() => window.scrollY)
  }

  await page.evaluate(() => window.scrollTo(0, 0))
  const unlocked = await tryScroll()

  await page.evaluate(() => { window.scrollTo(0, 0); document.documentElement.classList.add('dialog-open') })
  const rootLocked = await tryScroll()
  await page.evaluate(() => document.documentElement.classList.remove('dialog-open'))

  await page.evaluate(() => { window.scrollTo(0, 0); document.body.classList.add('lock-body') })
  const bodyLocked = await tryScroll()

  console.log('no lock        -> scrollY after scrollTo(1200):', unlocked, '(expect 1200, page scrolls)')
  console.log('lock on :root  -> scrollY after scrollTo(1200):', rootLocked, '(expect 0, scroll blocked)')
  console.log('lock on body   -> scrollY after scrollTo(1200):', bodyLocked, '(body-propagation also blocks)')
  console.log('')
  console.log('RESULT: root-lock prevents background scroll?', rootLocked === 0 ? 'YES ✓' : 'NO ✗ (scrollY=' + rootLocked + ')')

  await browser.close()
})()
