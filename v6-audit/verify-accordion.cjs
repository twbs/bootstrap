/* Does the v6 native <details name> accordion allow two items open at once
   under fast/concurrent toggling? (collapse.js is NOT involved.) */
const { chromium } = require('playwright')

const html = `<!doctype html><html><body>
  <div class="accordion">
    <details class="accordion-item" name="acc" id="d1" open><summary id="s1">One</summary><div>1</div></details>
    <details class="accordion-item" name="acc" id="d2"><summary id="s2">Two</summary><div>2</div></details>
    <details class="accordion-item" name="acc" id="d3"><summary id="s3">Three</summary><div>3</div></details>
  </div>
</body></html>`

const openCount = () => document.querySelectorAll('details[open]').length
const openIds = () => [...document.querySelectorAll('details[open]')].map(d => d.id).join(',')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  const out = []

  // baseline
  out.push(['initial', await page.evaluate(openCount), await page.evaluate(openIds)])

  // 1) Two summary clicks fired back-to-back in the SAME synchronous tick
  await page.evaluate(() => { document.getElementById('s2').click(); document.getElementById('s3').click() })
  out.push(['two summary clicks same tick', await page.evaluate(openCount), await page.evaluate(openIds)])

  // 2) Programmatically force BOTH open in the same tick (the strongest attempt to double-open)
  await page.evaluate(() => { document.getElementById('d1').open = true; document.getElementById('d2').open = true; document.getElementById('d3').open = true })
  out.push(['set .open=true on all three same tick', await page.evaluate(openCount), await page.evaluate(openIds)])

  // 3) Rapid real mouse clicks with ~5ms spacing on two different summaries
  await page.evaluate(() => { for (const d of document.querySelectorAll('details')) d.open = false })
  await page.locator('#s1').click()
  await page.locator('#s2').click({ delay: 0 })
  out.push(['rapid real clicks s1 then s2', await page.evaluate(openCount), await page.evaluate(openIds)])

  // capability check: does this engine support exclusive `name` accordions?
  const nameSupported = await page.evaluate(() => 'name' in document.createElement('details'))
  out.push([`<details name> supported = ${nameSupported}`, '', ''])

  await browser.close()
  console.log('scenario'.padEnd(38), 'open#', 'ids')
  for (const [s, c, ids] of out) console.log(String(s).padEnd(38), String(c).padStart(2), ids)
})().catch(e => { console.error('ERR', e); process.exit(1) })
