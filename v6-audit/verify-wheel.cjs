const { chromium } = require('playwright')
const html = `<!doctype html><html><head><style>
  :root { scrollbar-gutter: stable; }
  body { margin: 0; } .tall { height: 5000px; }
  :root.dialog-open { overflow: hidden; }
  body.lock-body { overflow: hidden; }
</style></head><body><div class="tall"></div></body></html>`
;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1000, height: 600 } })
  await page.setContent(html)
  const wheelTest = async () => {
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.mouse.move(500, 300)
    await page.mouse.wheel(0, 1200)
    await page.waitForTimeout(100)
    return page.evaluate(() => window.scrollY)
  }
  const unlocked = await wheelTest()
  await page.evaluate(() => document.documentElement.classList.add('dialog-open'))
  const rootLocked = await wheelTest()
  await page.evaluate(() => document.documentElement.classList.remove('dialog-open'))
  await page.evaluate(() => document.body.classList.add('lock-body'))
  const bodyLocked = await wheelTest()
  console.log('no lock       -> scrollY after wheel(1200):', unlocked, '(expect >0, scrolls)')
  console.log('lock on :root -> scrollY after wheel(1200):', rootLocked, '(expect 0, blocked)')
  console.log('lock on body  -> scrollY after wheel(1200):', bodyLocked)
  console.log('RESULT: root-lock blocks user scroll?', rootLocked === 0 ? 'YES ✓' : 'NO ✗ ('+rootLocked+')')
  await browser.close()
})()
