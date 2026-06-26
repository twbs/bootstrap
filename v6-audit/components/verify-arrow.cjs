const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright')
const CSS = fs.readFileSync(path.resolve(__dirname,'../../../dist/css/bootstrap.css'),'utf8')
;(async () => {
  const b = await chromium.launch(); const p = await b.newPage()
  await p.setContent('<div class="popover bs-popover-bottom show" style="position:absolute"><div class="popover-arrow"></div><h3 class="popover-header">H</h3><div class="popover-body">B</div></div><div class="popover bs-popover-bottom show" id="nohdr" style="position:absolute;top:200px"><div class="popover-arrow"></div><div class="popover-body">B</div></div>')
  await p.addStyleTag({ content: CSS })
  const r = await p.evaluate(() => {
    const headerBg = getComputedStyle(document.querySelector('.popover-header')).backgroundColor
    const bodyBg = getComputedStyle(document.querySelector('.popover')).backgroundColor
    const withHdr = getComputedStyle(document.querySelector('.bs-popover-bottom .popover-arrow'), '::after').borderBottomColor
    const noHdr = getComputedStyle(document.querySelector('#nohdr .popover-arrow'), '::after').borderBottomColor
    return { headerBg, bodyBg, withHdr, noHdr }
  })
  console.log('header bg      :', r.headerBg)
  console.log('body bg        :', r.bodyBg)
  console.log('arrow w/ hdr   :', r.withHdr, r.withHdr === r.headerBg ? '✓ matches header' : '✗ MISMATCH')
  console.log('arrow no hdr   :', r.noHdr, r.noHdr === r.bodyBg ? '✓ matches body' : '✗ MISMATCH')
  await b.close()
})()
