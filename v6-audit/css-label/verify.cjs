const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright')
const CSS = fs.readFileSync(path.resolve(__dirname, '../../../dist/css/bootstrap.css'), 'utf8')

const toRGB = `(color) => { const c = document.createElement('canvas'); c.width=c.height=1; const x=c.getContext('2d'); x.fillStyle='#000'; x.fillStyle=color; x.fillRect(0,0,1,1); const d=x.getImageData(0,0,1,1).data; return [d[0],d[1],d[2]] }`
const lum = ([r,g,b]) => { const f=v=>{v/=255; return v<=.03928?v/12.92:((v+.055)/1.055)**2.4}; return .2126*f(r)+.7152*f(g)+.0722*f(b) }

;(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 900, height: 700 } })
  await p.setContent('<body class="bg-body"></body>')
  await p.addStyleTag({ content: CSS })
  const out = []

  // 38480 — light-mode form-control border contrast vs body bg (WCAG needs >= 3:1 for UI borders)
  {
    await p.evaluate(() => { document.body.innerHTML = '<input class="form-control" id="i">' })
    const [bc, bg] = await p.evaluate(`(() => { const cs=getComputedStyle(document.getElementById('i')); const torgb=${toRGB}; return [torgb(cs.borderTopColor), torgb(getComputedStyle(document.body).backgroundColor)] })()`)
    const L1 = lum(bc), L2 = lum(bg); const ratio = (Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05)
    out.push(['38480', `form-control border contrast = ${ratio.toFixed(2)}:1 (WCAG UI needs 3:1) → ${ratio>=3?'OK/RESOLVED':'LOW/keep-bug'}`])
  }

  // 38808 — is-invalid focus ring should be the danger color, not the default blue
  {
    const r = await p.evaluate(`(() => {
      document.body.innerHTML = '<input class="form-control is-invalid" id="v">'
      const el = document.getElementById('v'); el.focus()
      const torgb=${toRGB}
      const fr = getComputedStyle(el).getPropertyValue('--focus-ring') || getComputedStyle(el).boxShadow
      return { ring: fr.trim(), shadow: getComputedStyle(el).boxShadow }
    })()`)
    out.push(['38808', `is-invalid focus ring var="${r.ring.slice(0,60)}" shadow="${r.shadow.slice(0,60)}" → inspect color is reddish`])
  }

  // 38651 — nested row-cols-2 g-2 columns should be equal width
  {
    const r = await p.evaluate(() => {
      document.body.innerHTML = '<div class="container"><div class="row"><div class="col"><div class="row row-cols-2 g-2"><div class="col"><div class="bg-1" id="n1">a</div></div><div class="col"><div class="bg-1" id="n2">b</div></div></div></div></div></div>'
      const w1 = document.getElementById('n1').getBoundingClientRect().width
      const w2 = document.getElementById('n2').getBoundingClientRect().width
      return { w1: Math.round(w1), w2: Math.round(w2), equal: Math.abs(w1 - w2) <= 1 }
    })
    out.push(['38651', `nested cols w1=${r.w1} w2=${r.w2} equal=${r.equal} → ${r.equal?'OK (no deform)':'DEFORMED/keep-bug'}`])
  }

  // 38980 — custom border-bottom on a table cell should not be clobbered
  {
    const r = await p.evaluate(() => {
      document.body.innerHTML = '<table class="table"><tbody><tr><td id="c" style="border-bottom: 3px solid rgb(255,0,0)">x</td></tr></tbody></table>'
      const cs = getComputedStyle(document.getElementById('c'))
      return { w: cs.borderBottomWidth, color: cs.borderBottomColor }
    })
    out.push(['38980', `custom cell border-bottom width=${r.w} color=${r.color} → ${r.w==='3px'&&r.color==='rgb(255, 0, 0)'?'RESPECTED/resolved':'clobbered/keep-bug'}`])
  }

  // 39150 — list-group-flush + horizontal: check for doubled side borders
  {
    const r = await p.evaluate(() => {
      document.body.innerHTML = '<div class="list-group list-group-flush list-group-horizontal"><div class="list-group-item" id="a">a</div><div class="list-group-item" id="b">b</div></div>'
      const a = getComputedStyle(document.getElementById('a'))
      const b = getComputedStyle(document.getElementById('b'))
      return { aLeft: a.borderLeftWidth, aRight: a.borderRightWidth, bLeft: b.borderLeftWidth, bRight: b.borderRightWidth, aTop: a.borderTopWidth }
    })
    out.push(['39150', `flush+horizontal borders aL=${r.aLeft} aR=${r.aRight} bL=${r.bLeft} bR=${r.bRight} top=${r.aTop} → inspect for doubled/odd`])
  }

  await b.close()
  for (const [n, msg] of out) console.log(`#${n}: ${msg}`)
})().catch(e => { console.error('ERR', e); process.exit(1) })
