/* Real-browser verification of the rewritten ScrollSpy against the built bundle. */
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

const ROOT = path.resolve(__dirname, '../..')
const JS = fs.readFileSync(path.join(ROOT, 'dist/js/bootstrap.bundle.js'), 'utf8')
  .replace(/export \{/, 'window.bootstrap = {')

const html = `<!doctype html><html><head><style>
  body { margin: 0 }
  #toc a { display: block }
  .active { font-weight: bold }
  #content { height: 300px; overflow-y: auto; }
  .section { padding: 0; margin: 0 }
</style></head><body>
  <nav id="toc">
    <a class="nav-link" href="#s1">S1</a>
    <a class="nav-link" href="#s2">S2</a>
    <a class="nav-link" href="#s3">S3</a>
    <a class="nav-link" href="#s4">S4</a>
  </nav>
  <div id="content">
    <div id="s1" class="section" style="height:400px">S1</div>
    <div id="s2" class="section" style="height:400px">S2</div>
    <div id="s3" class="section" style="height:400px">S3</div>
    <div id="s4" class="section" style="height:400px">S4</div>
  </div>
</body></html>`

const activeId = () => { const a = document.querySelector('#toc .active'); return a ? a.getAttribute('href') : null }

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } })
  await page.setContent(html)
  await page.addScriptTag({ content: JS, type: 'module' })
  await page.waitForFunction(() => window.bootstrap && window.bootstrap.ScrollSpy)
  await page.evaluate(() => {
    window._spy = new bootstrap.ScrollSpy(document.querySelector('#content'), {
      target: '#toc',
      smoothScroll: true
    })
  })

  const results = []
  const rec = (name, got, want) => { const ok = got === want; results.push(ok); console.log(`${ok ? '✓' : '✗'} ${name}: got ${got}, want ${want}`) }

  const scrollAndRead = async top => {
    await page.evaluate(t => document.querySelector('#content').scrollTop = t, top)
    await page.waitForTimeout(120) // let IO + scrollend settle
    return page.evaluate(activeId)
  }

  rec('top → S1', await scrollAndRead(0), '#s1')
  rec('into S2 → S2', await scrollAndRead(650), '#s2')
  // s3 (top at 1200) + s4 visible; at 1250 s3 top is ~ -50 (crossed), s4 top ~70 → S3
  rec('into S3 (not bottom) → S3', await scrollAndRead(850), '#s3')
  // bottom: total = 1360, viewport 300 → max scroll 1060... actually s4 tiny at bottom
  const maxScroll = await page.evaluate(() => { const c = document.querySelector('#content'); return c.scrollHeight - c.clientHeight })
  rec('scrolled to bottom → S4 (last)', await scrollAndRead(maxScroll), '#s4')

  // smoothScroll click → real scrollend → URL hash + focus
  await page.evaluate(() => document.querySelector('#content').scrollTop = 0)
  await page.waitForTimeout(120)
  await page.evaluate(() => document.querySelector('#toc a[href="#s3"]').click())
  await page.waitForTimeout(1500) // smooth scroll + settle
  const hash = await page.evaluate(() => location.hash)
  const focused = await page.evaluate(() => document.activeElement && document.activeElement.id)
  rec('smooth-scroll click updates URL hash', hash, '#s3')
  rec('smooth-scroll click moves focus to section', focused, 's3')

  await browser.close()
  console.log(`\n${results.filter(Boolean).length}/${results.length} passed`)
  process.exit(results.every(Boolean) ? 0 : 1)
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(1) })
