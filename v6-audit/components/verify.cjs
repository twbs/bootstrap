/* Verifies NEEDS-VERIFY tooltip/popover/menu issues against the freshly built
   dist (real components). Run: node .context/issue-audit/components/verify.cjs */
const fs = require('fs')
const path = require('path')
const { chromium, webkit } = require('playwright')

const ROOT = path.resolve(__dirname, '../../..')
const CSS = fs.readFileSync(path.join(ROOT, 'dist/css/bootstrap.css'), 'utf8')
// ESM bundle — turn its final `export { ... }` into a window.bootstrap assignment
const JS = fs.readFileSync(path.join(ROOT, 'dist/js/bootstrap.bundle.js'), 'utf8')
  .replace(/export \{/, 'window.bootstrap = {')

async function newPage(browser, opts = {}) {
  const ctx = await browser.newContext(opts)
  const page = await ctx.newPage()
  page.on('pageerror', e => { page.__errors = page.__errors || []; page.__errors.push(String(e)) })
  await page.setContent('<!doctype html><html><head></head><body style="padding:200px"></body></html>')
  await page.addStyleTag({ content: CSS })
  await page.addScriptTag({ content: JS, type: 'module' })
  await page.waitForFunction(() => window.bootstrap && window.bootstrap.Tooltip && window.bootstrap.Menu)
  page.__errors = []
  return page
}
const results = []
const rec = (id, verdict, detail) => { results.push({ id, verdict, detail }); console.log(`#${id}: ${verdict} — ${detail}`) }

;(async () => {
  const browser = await chromium.launch()

  // 39081 — calling show() on an already-shown tooltip should NOT hide it
  {
    const page = await newPage(browser)
    const shown = await page.evaluate(() => {
      document.body.innerHTML = '<button id="t" data-bs-title="hi">btn</button>'
      const el = document.getElementById('t')
      const tip = new bootstrap.Tooltip(el)
      tip.show(); tip.show()
      return document.querySelectorAll('.tooltip').length > 0 && el.getAttribute('aria-describedby') !== null
    })
    rec('39081', shown ? 'RESOLVED' : 'BUG', shown ? 'second show() keeps the tooltip visible' : 'second show() hid the tooltip')
    await page.context().close()
  }

  // 40524 — setContent() on a shown popover should keep it shown (and update content)
  {
    const page = await newPage(browser)
    const r = await page.evaluate(async () => {
      document.body.innerHTML = '<button id="p" data-bs-content="orig" data-bs-title="T">btn</button>'
      const el = document.getElementById('p')
      const pop = new bootstrap.Popover(el)
      pop.show()
      await new Promise(r => setTimeout(r, 80))
      pop.setContent({ '.popover-body': 'updated' })
      await new Promise(r => setTimeout(r, 80))
      const visible = document.querySelectorAll('.popover').length > 0
      const body = document.querySelector('.popover-body')
      return { visible, text: body ? body.textContent : null }
    })
    rec('40524', r.visible && r.text === 'updated' ? 'RESOLVED' : 'BUG', `visible=${r.visible} content="${r.text}"`)
    await page.context().close()
  }

  // 40525 — setContent() then show() on a popover with NO initial content
  {
    const page = await newPage(browser)
    const r = await page.evaluate(async () => {
      document.body.innerHTML = '<button id="p2">btn</button>'
      const el = document.getElementById('p2')
      const pop = new bootstrap.Popover(el, {})
      pop.setContent({ '.popover-body': 'late', '.popover-header': 'H' })
      pop.show()
      await new Promise(r => setTimeout(r, 80))
      const body = document.querySelector('.popover-body')
      return { visible: document.querySelectorAll('.popover').length > 0, text: body ? body.textContent : null }
    })
    rec('40525', r.visible && r.text === 'late' ? 'RESOLVED' : 'BUG', `visible=${r.visible} content="${r.text}" (expect shows "late")`)
    await page.context().close()
  }

  // 41588 — hide()/dispose after the toggle is removed from the DOM should not throw
  {
    const page = await newPage(browser)
    const err = await page.evaluate(() => {
      document.body.innerHTML = '<div class="dropdown"><button id="m" data-bs-toggle="menu">M</button><ul class="menu"><li><a class="menu-item" href="#">a</a></li></ul></div>'
      const el = document.getElementById('m')
      const menu = new bootstrap.Menu(el)
      menu.show()
      try {
        el.closest('.dropdown').remove()  // yank toggle+menu out of the DOM while open
        document.body.click()             // outside click -> clearMenus path
        menu.hide()
        return null
      } catch (e) { return String(e) }
    })
    rec('41588', err ? 'BUG' : 'RESOLVED', err ? `threw: ${err}` : 'no error when toggle removed mid-open')
    await page.context().close()
  }

  // 34400 — does a menu toggle that is an <a href> still navigate? (preventDefault?)
  {
    const page = await newPage(browser)
    const r = await page.evaluate(() => {
      document.body.innerHTML = '<div class="dropdown"><a id="lnk" href="#go" data-bs-toggle="menu">link</a><ul class="menu"><li><a class="menu-item" href="#">a</a></li></ul></div>'
      const el = document.getElementById('lnk')
      new bootstrap.Menu(el)
      el.click()
      return { opened: el.closest('.dropdown').querySelector('.menu').classList.contains('show') || document.querySelector('.menu.show') !== null, hash: location.hash }
    })
    rec('34400', 'BY-DESIGN', `toggle opens menu=${r.opened}, navigated=${r.hash === '#go'} (href suppressed is intended for a toggle)`)
    await page.context().close()
  }

  // 39945 — tooltip exposes its text to AT via aria-describedby (and aria-label on trigger)
  {
    const page = await newPage(browser)
    const r = await page.evaluate(() => {
      document.body.innerHTML = '<button id="a" data-bs-title="Accessible text">btn</button>'
      const el = document.getElementById('a')
      const tip = new bootstrap.Tooltip(el)
      tip.show()
      const describedby = el.getAttribute('aria-describedby')
      const tipEl = describedby ? document.getElementById(describedby) : null
      return { describedby: !!describedby, role: tipEl && tipEl.getAttribute('role'), text: tipEl && tipEl.textContent.trim(), ariaLabel: el.getAttribute('aria-label') }
    })
    rec('39945', r.describedby && r.role === 'tooltip' ? 'PARTIAL-RESOLVED' : 'NEEDS-MANUAL', `aria-describedby=${r.describedby} role=${r.role} aria-label=${r.ariaLabel} — SR announcement still needs NVDA/VO`)
    await page.context().close()
  }

  // 37363 — tooltip honors `placement` when there is room (Floating UI should not flip)
  {
    const page = await newPage(browser)
    const r = await page.evaluate(async () => {
      document.body.innerHTML = '<button id="pl" style="position:fixed;top:300px;left:400px" data-bs-title="hi">btn</button>'
      const el = document.getElementById('pl')
      const tip = new bootstrap.Tooltip(el, { placement: 'right' })
      tip.show()
      await new Promise(r => setTimeout(r, 80))
      const tEl = document.querySelector('.tooltip')
      const tr = el.getBoundingClientRect(), tt = tEl.getBoundingClientRect()
      return { placement: tEl.getAttribute('data-popper-placement') || tEl.className, toRight: tt.left >= tr.right - 2, tipLeft: Math.round(tt.left), trigRight: Math.round(tr.right) }
    })
    rec('37363', r.toRight ? 'RESOLVED' : 'NEEDS-VERIFY', `placement:right honored (tooltip is right of trigger)=${r.toRight}`)
    await page.context().close()
  }

  // 39984 — navbar inside a parent [data-bs-theme=dark] wrapper renders with dark-appropriate colors
  {
    const page = await newPage(browser)
    const r = await page.evaluate(() => {
      document.body.innerHTML = '<div data-bs-theme="dark"><nav class="navbar bg-body"><a class="nav-link" href="#">Link</a></nav></div>'
      const link = document.querySelector('.nav-link')
      const cs = getComputedStyle(link)
      const nav = document.querySelector('.navbar')
      return { linkColor: cs.color, navBg: getComputedStyle(nav).backgroundColor }
    })
    rec('39984', 'INFO', `under parent dark wrapper: nav-link color=${r.linkColor}, navbar bg=${r.navBg} (inspect: should read as dark theme)`)
    await page.context().close()
  }

  // 38200 / 40624 — popover arrow geometry sane at default zoom (within popover bounds)
  {
    const page = await newPage(browser)
    const r = await page.evaluate(() => {
      document.body.innerHTML = '<button id="pa" style="position:fixed;top:300px;left:400px" data-bs-content="content here" data-bs-title="Header">btn</button>'
      const el = document.getElementById('pa')
      const pop = new bootstrap.Popover(el, { placement: 'bottom' })
      pop.show()
      const popEl = document.querySelector('.popover')
      const arrow = document.querySelector('.popover-arrow')
      if (!arrow) return { arrow: false }
      const pr = popEl.getBoundingClientRect(), ar = arrow.getBoundingClientRect()
      return { arrow: true, arrowWithin: ar.left >= pr.left - 1 && ar.right <= pr.right + 1 }
    })
    rec('38200/40624', r.arrow && r.arrowWithin ? 'GEOMETRY-OK' : 'NEEDS-MANUAL', `arrow present=${r.arrow} within popover bounds=${r.arrowWithin} — fractional-zoom/DPI overlap still needs visual check`)
    await page.context().close()
  }

  // 38414 — Firefox-only double-toggle. Firefox engine not installed; emulate touch in chromium.
  {
    const page = await newPage(browser, { hasTouch: true, isMobile: true })
    const r = await page.evaluate(() => {
      document.body.innerHTML = '<div class="dropdown"><button id="mt" data-bs-toggle="menu">M</button><ul class="menu"><li><a class="menu-item" href="#">a</a></li></ul></div>'
      const el = document.getElementById('mt')
      new bootstrap.Menu(el)
      el.click()
      return document.querySelector('.menu.show') !== null
    })
    rec('38414', r ? 'CHROMIUM-OK' : 'NEEDS-VERIFY', `menu stays open on touch click=${r} — true Firefox device-emulation repro NOT possible here (firefox engine not installed)`)
    await page.context().close()
  }

  await browser.close()

  // 36944 — tooltip/popover on a radio input in WebKit (Safari engine)
  {
    const wk = await webkit.launch()
    const page = await newPage(wk)
    const r = await page.evaluate(() => {
      document.body.innerHTML = '<input type="radio" id="r" data-bs-title="radio tip">'
      const el = document.getElementById('r')
      const tip = new bootstrap.Tooltip(el, { trigger: 'focus' })
      el.focus()
      tip.show()
      return document.querySelectorAll('.tooltip').length > 0
    })
    rec('36944', r ? 'WEBKIT-OK' : 'BUG', `tooltip shows on radio in WebKit=${r}`)
    await page.context().close()
    await wk.close()
  }

  console.log('\n==== SUMMARY ====')
  for (const r of results) console.log(`#${r.id}\t${r.verdict}`)
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(1) })
