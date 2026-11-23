import{n as e}from"./rolldown-runtime.XKyaHtl9.js";var t=500,n=20,r=300,i=`https://stackblitz.com`,a=[`angular-cli`,`create-react-app`,`html`,`javascript`,`node`,`polymer`,`typescript`,`vue`],o=[`project`,`search`,`ports`,`settings`],s=[`light`,`dark`],c=[`editor`,`preview`],l=`accelerometer.ambient-light-sensor.autoplay.battery.bluetooth.camera.clipboard-read.clipboard-write.display-capture.encrypted-media.fullscreen.gamepad.geolocation.gyroscope.hid.idle-detection.local-network.local-network-access.loopback-network.magnetometer.microphone.midi.payment.picture-in-picture.publickey-credentials-get.screen-wake-lock.serial.usb.web-share.xr-spatial-tracking`.split(`.`),u={clickToLoad:e=>f(`ctl`,e),devToolsHeight:e=>m(`devtoolsheight`,e),forceEmbedLayout:e=>f(`embed`,e),hideDevTools:e=>f(`hidedevtools`,e),hideExplorer:e=>f(`hideExplorer`,e),hideNavigation:e=>f(`hideNavigation`,e),openFile:e=>g(`file`,e),showSidebar:e=>p(`showSidebar`,e),sidebarView:e=>h(`sidebarView`,e,o),startScript:e=>g(`startScript`,e),terminalHeight:e=>m(`terminalHeight`,e),theme:e=>h(`theme`,e,s),view:e=>h(`view`,e,c),zenMode:e=>f(`zenMode`,e),organization:e=>`${g(`orgName`,e?.name)}&${g(`orgProvider`,e?.provider)}`,crossOriginIsolated:e=>f(`corp`,e)};function d(e={}){let t=Object.entries(e).map(([e,t])=>t!=null&&u.hasOwnProperty(e)?u[e](t):``).filter(Boolean);return t.length?`?${t.join(`&`)}`:``}function f(e,t){return t===!0?`${e}=1`:``}function p(e,t){return typeof t==`boolean`?`${e}=${t?`1`:`0`}`:``}function m(e,t){return typeof t==`number`&&!Number.isNaN(t)?`${e}=${encodeURIComponent(Math.round(Math.min(100,Math.max(0,t))))}`:``}function h(e,t=``,n=[]){return n.includes(t)?`${e}=${encodeURIComponent(t)}`:``}function g(e,t){return(Array.isArray(t)?t:[t]).filter(e=>typeof e==`string`&&e.trim()!==``).map(t=>`${e}=${encodeURIComponent(t)}`).join(`&`)}function _(){return Math.random().toString(36).slice(2,6)+Math.random().toString(36).slice(2,6)}function v(e,t){return`${b(t)}${e}${d(t)}`}function y(e,t){let n={forceEmbedLayout:!0};return t&&typeof t==`object`&&Object.assign(n,t),`${b(n)}${e}${d(n)}`}function b(e={}){return(typeof e.origin==`string`?e.origin:i).replace(/\/$/,``)}function x(e,t,n){if(!t||!e||!e.parentNode)throw Error(`Invalid Element`);e.id&&(t.id=e.id),e.className&&(t.className=e.className),ee(t,n),w(e,t,n),e.replaceWith(t)}function S(e){if(typeof e==`string`){let t=document.getElementById(e);if(!t)throw Error(`Could not find element with id '${e}'`);return t}if(e instanceof HTMLElement)return e;throw Error(`Invalid element: ${e}`)}function C(e){return e&&e.newWindow===!1?`_self`:`_blank`}function ee(e,t={}){let n=Object.hasOwnProperty.call(t,`height`)?`${t.height}`:`${r}`,i=Object.hasOwnProperty.call(t,`width`)?`${t.width}`:void 0;e.setAttribute(`height`,n),i?e.setAttribute(`width`,i):e.setAttribute(`style`,`width:100%;`)}function w(e,t,n={}){let r=e.allow?.split(`;`)?.map(e=>e.trim()).filter(Boolean)??[],i=new Set(r.map(e=>e.split(/\s+/)[0]));for(let e of te())i.has(e)||(r.push(`${e} *`),i.add(e));n.crossOriginIsolated&&!i.has(`cross-origin-isolated`)&&(r.push(`cross-origin-isolated ${b(n)}`),i.add(`cross-origin-isolated`)),r.length>0&&(t.allow=r.join(`; `))}function te(){let e=new Set(l);try{let t=document?.featurePolicy;if(t&&typeof t.allowedFeatures==`function`)for(let n of t.allowedFeatures())e.add(n)}catch{}return e.delete(`cross-origin-isolated`),[...e]}var ne=class{constructor(e){this.pending={},this.port=e,this.port.onmessage=this.messageListener.bind(this)}request({type:e,payload:t}){return new Promise((n,r)=>{let i=_();this.pending[i]={resolve:n,reject:r},this.port.postMessage({type:e,payload:{...t,__reqid:i}})})}messageListener(e){if(typeof e.data.payload?.__reqid!=`string`)return;let{type:t,payload:n}=e.data,{__reqid:r,__success:i,__error:a}=n;this.pending[r]&&(i?this.pending[r].resolve(this.cleanResult(n)):this.pending[r].reject(a?`${t}: ${a}`:t),delete this.pending[r])}cleanResult(e){let t={...e};return delete t.__reqid,delete t.__success,delete t.__error,Object.keys(t).length?t:null}},T=class{constructor(e,t){this.editor={openFile:e=>this._rdc.request({type:`SDK_OPEN_FILE`,payload:{path:e}}),setCurrentFile:e=>this._rdc.request({type:`SDK_SET_CURRENT_FILE`,payload:{path:e}}),setTheme:e=>this._rdc.request({type:`SDK_SET_UI_THEME`,payload:{theme:e}}),setView:e=>this._rdc.request({type:`SDK_SET_UI_VIEW`,payload:{view:e}}),showSidebar:(e=!0)=>this._rdc.request({type:`SDK_TOGGLE_SIDEBAR`,payload:{visible:e}})},this.preview={origin:``,getUrl:()=>this._rdc.request({type:`SDK_GET_PREVIEW_URL`,payload:{}}).then(e=>e?.url??null),setUrl:(e=`/`)=>{if(typeof e!=`string`||!e.startsWith(`/`))throw Error(`Invalid argument: expected a path starting with '/', got '${e}'`);return this._rdc.request({type:`SDK_SET_PREVIEW_URL`,payload:{path:e}})}},this._rdc=new ne(e),Object.defineProperty(this.preview,"origin",{value:typeof t.previewOrigin==`string`?t.previewOrigin:null,writable:!1})}applyFsDiff(e){let t=e=>typeof e==`object`&&!!e;if(!t(e)||!t(e.create))throw Error(`Invalid diff object: expected diff.create to be an object.`);if(!Array.isArray(e.destroy))throw Error(`Invalid diff object: expected diff.destroy to be an array.`);return this._rdc.request({type:`SDK_APPLY_FS_DIFF`,payload:e})}getDependencies(){return this._rdc.request({type:`SDK_GET_DEPS_SNAPSHOT`,payload:{}})}getFsSnapshot(){return this._rdc.request({type:`SDK_GET_FS_SNAPSHOT`,payload:{}})}},E=[],D=class{constructor(e){this.id=_(),this.element=e,this.pending=new Promise((e,r)=>{let i=({data:t,ports:n})=>{t?.action===`SDK_INIT_SUCCESS`&&t.id===this.id&&(this.vm=new T(n[0],t.payload),e(this.vm),o())},a=()=>{this.element.contentWindow?.postMessage({action:`SDK_INIT`,id:this.id},`*`)};function o(){window.clearInterval(c),window.removeEventListener(`message`,i)}window.addEventListener(`message`,i),a();let s=0,c=window.setInterval(()=>{this.vm?o():s>=n?(o(),r(`Timeout: Unable to establish a connection with the StackBlitz VM`),E.forEach((e,t)=>{e.id===this.id&&E.splice(t,1)})):(s++,a())},t)}),E.push(this)}},O=e=>{let t=e instanceof Element?`element`:`id`;return E.find(n=>n[t]===e)??null};function k(e,t){let n=document.createElement(`input`);return n.type=`hidden`,n.name=e,n.value=t,n}function A(e){return e.replace(/\[/g,`%5B`).replace(/\]/g,`%5D`)}function j({template:e,title:t,description:n,dependencies:r,files:i,settings:o}){if(!a.includes(e)){let e=a.map(e=>`'${e}'`).join(`, `);console.warn(`Unsupported project.template: must be one of ${e}`)}let s=[],c=(e,t,n=``)=>{s.push(k(e,typeof t==`string`?t:n))};c(`project[title]`,t),typeof n==`string`&&n.length>0&&c(`project[description]`,n),c(`project[template]`,e,`javascript`),r&&(e===`node`?console.warn(`Invalid project.dependencies: dependencies must be provided as a 'package.json' file when using the 'node' template.`):c(`project[dependencies]`,JSON.stringify(r))),o&&c(`project[settings]`,JSON.stringify(o)),Object.entries(i).forEach(([e,t])=>{c(`project[files][${A(e)}]`,t)});let l=document.createElement(`form`);return l.method=`POST`,l.setAttribute(`style`,`display:none!important;`),l.append(...s),l}function M(e,t){let n=j(e);return n.action=y(`/run`,t),n.id=`sb_run`,`<!doctype html>
<html>
<head><title></title></head>
<body>
  ${n.outerHTML}
  <script>document.getElementById('${n.id}').submit();<\/script>
</body>
</html>`}function N(e,t){let n=j(e);n.action=v(`/run`,t),n.target=C(t),document.body.appendChild(n),n.submit(),document.body.removeChild(n)}function P(e){return e?.contentWindow?(O(e)??new D(e)).pending:Promise.reject(`Provided element is not an iframe.`)}function re(e,t){N(e,t)}function ie(e,t){let n=v(`/edit/${e}`,t),r=C(t);window.open(n,r)}function ae(e,t){let n=v(`/github/${e}`,t),r=C(t);window.open(n,r)}function F(e,t,n){let r=S(e),i=M(t,n),a=document.createElement(`iframe`);return x(r,a,n),a.contentDocument?.write(i),P(a)}function I(e,t,n){let r=S(e),i=document.createElement(`iframe`);return i.src=y(`/edit/${t}`,n),x(r,i,n),P(i)}function L(e,t,n){let r=S(e),i=document.createElement(`iframe`);return i.src=y(`/github/${t}`,n),x(r,i,n),P(i)}var R={connect:P,embedGithubProject:L,embedProject:F,embedProjectId:I,openGithubProject:ae,openProject:re,openProjectId:ie},z=`// NOTICE: Embedded as-is into StackBlitz playgrounds via \`?raw\` import.
// Adapt to your needs in real projects.

/*
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2026 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

import {
  Tooltip,
  Popover,
  Toast,
  Carousel,
  Datepicker
} from '@bootstrap'

export default () => {
  // js-docs-start datepicker-presets
  const presets = document.getElementById('datepickerPresets')
  if (presets) {
    const trigger = document.getElementById('datepickerPresetTrigger')
    const picker = Datepicker.getOrCreateInstance(trigger)
    const iso = date => {
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return \`\${date.getFullYear()}-\${month}-\${day}\`
    }

    const applyPreset = days => {
      const end = new Date()
      const start = new Date(end)
      start.setDate(end.getDate() - days + 1)
      picker.setSelectedDates(days === 1 ? [iso(end)] : [iso(start), iso(end)])
    }

    for (const button of presets.querySelectorAll('[data-datepicker-preset]')) {
      button.addEventListener('click', () => applyPreset(Number(button.dataset.datepickerPreset)))
    }

    applyPreset(7)
  }
  // js-docs-end datepicker-presets

  // js-docs-start datepicker-actions
  const actionsTrigger = document.getElementById('datepickerActions')
  if (actionsTrigger) {
    const picker = Datepicker.getOrCreateInstance(actionsTrigger)
    const popup = document.getElementById(actionsTrigger.getAttribute('aria-controls'))
    const template = document.getElementById('datepickerActionsTemplate')
    const actions = template.content.firstElementChild.cloneNode(true)

    const mountActions = () => {
      if (!popup.contains(actions)) {
        popup.append(actions)
      }
    }

    mountActions()
    // The calendar can replace its contents when its view changes.
    new MutationObserver(mountActions).observe(popup, { childList: true })

    actions.addEventListener('click', event => {
      const button = event.target.closest('[data-datepicker-action]')
      if (button) {
        picker.setSelectedDates(button.dataset.datepickerAction === 'today' ? [new Date()] : [])
        picker.hide()
        actionsTrigger.focus()
      }
    })
  }
  // js-docs-end datepicker-actions

  // --------
  // Tooltips
  // --------
  // Instantiate all tooltips in a docs or StackBlitz
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach(tooltip => {
      new Tooltip(tooltip)
    })

  // --------
  // Popovers
  // --------
  // Instantiate all popovers in docs or StackBlitz
  document.querySelectorAll('[data-bs-toggle="popover"]')
    .forEach(popover => {
      new Popover(popover)
    })

  // -------------------------------
  // Toasts
  // -------------------------------
  // Used by 'Placement' example in docs or StackBlitz
  const toastPlacement = document.getElementById('toastPlacement')
  if (toastPlacement) {
    document.getElementById('selectToastPlacement').addEventListener('change', function () {
      if (!toastPlacement.dataset.originalClass) {
        toastPlacement.dataset.originalClass = toastPlacement.className
      }

      toastPlacement.className = \`\${toastPlacement.dataset.originalClass} \${this.value}\`
    })
  }

  // Instantiate all toasts in docs pages only
  // Skip toasts inside <dialog> elements; those are shown explicitly
  // via their own trigger (e.g. the "Show toast" button in the dialog
  // overlays example) and shouldn't auto-appear when the dialog opens.
  document.querySelectorAll('.bd-example .toast')
    .forEach(toastNode => {
      if (toastNode.closest('dialog')) {
        return
      }

      const toast = new Toast(toastNode, {
        autohide: false
      })

      toast.show()
    })

  // Instantiate all toasts in docs pages only
  // js-docs-start live-toast
  const toastTrigger = document.getElementById('liveToastBtn')
  const toastLiveExample = document.getElementById('liveToast')

  if (toastTrigger) {
    const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
    toastTrigger.addEventListener('click', () => {
      toastBootstrap.show()
    })
  }
  // js-docs-end live-toast

  // Replay the sliding toast on the Transitions page
  const slideToastTrigger = document.getElementById('slideToastBtn')
  const slideToastEl = document.getElementById('slideToast')

  if (slideToastTrigger) {
    const slideToast = Toast.getOrCreateInstance(slideToastEl, { autohide: false })
    slideToastTrigger.addEventListener('click', async () => {
      await slideToast.hide()
      slideToast.show()
    })
  }

  const dialogToastTrigger = document.getElementById('dialogToastBtn')
  const dialogToastEl = document.getElementById('dialogToast')

  if (dialogToastTrigger) {
    const dialogToast = Toast.getOrCreateInstance(dialogToastEl)
    dialogToastTrigger.addEventListener('click', () => {
      dialogToast.show()
    })
  }

  // -------------------------------
  // Alerts
  // -------------------------------
  // Used in 'Show live alert' example in docs or StackBlitz

  // js-docs-start live-alert
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      \`<div class="alert theme-\${type}" role="alert">\`,
      \`   <p>\${message}</p>\`,
      '   <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }

  const alertTrigger = document.getElementById('liveAlertBtn')
  if (alertTrigger) {
    alertTrigger.addEventListener('click', () => {
      appendAlert('Nice, you triggered this alert message!', 'success')
    })
  }
  // js-docs-end live-alert

  // -------------------------------
  // Accordion expand / collapse all
  // -------------------------------
  // js-docs-start accordion-expand-collapse
  const accordion = document.getElementById('accordionExpandCollapse')
  const toggleBtn = document.getElementById('btnAccordionToggleAll')

  if (accordion && toggleBtn) {
    const items = accordion.querySelectorAll('.accordion-item')
    const groupName = 'accordionExpandCollapse'

    toggleBtn.addEventListener('click', () => {
      const expand = toggleBtn.getAttribute('aria-expanded') !== 'true'

      for (const item of items) {
        if (expand) {
          item.removeAttribute('name')
          item.open = true
        } else {
          item.open = false
          item.setAttribute('name', groupName)
        }
      }

      toggleBtn.setAttribute('aria-expanded', String(expand))
      toggleBtn.textContent = expand ? 'Collapse all' : 'Expand all'
    })
  }
  // js-docs-end accordion-expand-collapse

  // --------
  // Carousels
  // --------
  // Instantiate all non-autoplaying carousels in docs or StackBlitz
  document.querySelectorAll('.carousel:not([data-bs-autoplay="true"])')
    .forEach(carousel => {
      Carousel.getOrCreateInstance(carousel)
    })

  // -------------------------------
  // Checks & Radios
  // -------------------------------
  // Indeterminate checkbox example in docs and StackBlitz
  document.querySelectorAll('.bd-example-indeterminate [type="checkbox"]')
    .forEach(checkbox => {
      if (checkbox.id.includes('Indeterminate')) {
        checkbox.indeterminate = true
      }
    })

  // -------------------------------
  // Links
  // -------------------------------
  // Disable empty links in docs examples only
  document.querySelectorAll('.bd-content [href="#"]')
    .forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault()
      })
    })

  // -------------------------------
  // Drawer
  // -------------------------------
  // 'Drawer components' example in docs only
  const myDrawer = document.querySelectorAll('.bd-example-drawer .drawer')
  if (myDrawer) {
    myDrawer.forEach(drawer => {
      drawer.addEventListener('show.bs.drawer', event => {
        event.preventDefault()
      }, false)
    })
  }

  // -------------------------------
  // Motion utilities
  // -------------------------------
  // Replay the one-shot animation utilities (.animation-shake, .animation-pop)
  // in docs demos by removing and re-adding the class after a reflow. The
  // trigger typically lives in the Example toolbar via its \`actions\` slot.
  document.querySelectorAll('[data-bd-replay]')
    .forEach(trigger => {
      const target = document.querySelector(trigger.getAttribute('data-bd-replay'))
      if (!target) {
        return
      }

      const animationClass = [...target.classList].find(name => name.startsWith('animation-'))
      if (!animationClass) {
        return
      }

      trigger.addEventListener('click', () => {
        target.classList.remove(animationClass)
        target.offsetHeight // eslint-disable-line no-unused-expressions
        target.classList.add(animationClass)
      })
    })
}
`,B=e({openExample:()=>pe}),V={cssCdn:`https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.2/dist/css/bootstrap.min.css`,currentVersion:`6.0.0-alpha.2`},H=`bootstrap/dist/js/bootstrap.bundle.js`,U=e=>e.replace(/from '@bootstrap'/g,`from '${H}'`),W={ScrollSpy:`[data-bs-spy="scroll"]`,Carousel:`[data-bs-autoplay="true"]`},G={Combobox:`[data-bs-toggle="combobox"]`,Datepicker:`[data-bs-toggle="datepicker"][data-bs-inline="true"], [data-bs-toggle="datepicker"][data-bs-selected-dates]`,NavOverflow:`[data-bs-toggle="nav-overflow"]`,OtpInput:`[data-bs-otp]`,Range:`.form-range`,Strength:`[data-bs-strength]`},K={...W,...G},q=(e,t)=>t.filter(t=>e.querySelector(K[t])!==null).map(e=>`
import { ${e} } from '${H}'

document.querySelectorAll('${K[e]}').forEach(element => {
  ${e}.getOrCreateInstance(element)
})
`).join(``),oe=()=>{document.querySelectorAll(`.btn-edit`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`.bd-code-snippet`),n=t.querySelector(`.bd-example`),r=se(n,t.querySelector(`template.bd-example-source`)),i=e.hasAttribute(`data-sb-js-snippet`),a=[...n.classList].join(` `),o=q(n,[`ScrollSpy`,...Object.keys(G)]);ce(r,i,a,X(n),o)})})},se=(e,t)=>{let n=e.cloneNode(!0);t&&(n=document.createElement(`div`),n.append(t.content.cloneNode(!0)));let r=new Set([...n.querySelectorAll(`[data-bs-target^="#"]`)].map(e=>e.getAttribute(`data-bs-target`).slice(1)));for(let t of r){let r=document.getElementById(t);r&&!e.contains(r)&&!r.contains(e)&&n.append(`
`,r.cloneNode(!0))}J(n,window.location.href,e=>e.startsWith(`/`)&&!e.startsWith(`//`));let i=[...new Set([...n.querySelectorAll(`use[href^="#"]`)].map(e=>e.getAttribute(`href`).slice(1)))].map(e=>document.getElementById(e)).filter(e=>e?.tagName.toLowerCase()===`symbol`).map(e=>e.outerHTML);return`${i.length>0?`<svg xmlns="http://www.w3.org/2000/svg" class="d-none">\n${i.join(`
`)}\n</svg>\n`:``}${n.innerHTML.trimStart()}`},J=(e,t,n)=>{for(let r of[`src`,`href`])e.querySelectorAll(`[${r}]`).forEach(e=>{let i=e.getAttribute(r);n(i)&&e.setAttribute(r,new URL(i,t).href)});e.querySelectorAll(`[style*="url("]`).forEach(e=>{let r=e.getAttribute(`style`).replace(/url\((["']?)(.+?)\1\)/g,(e,r,i)=>n(i)?`url(${r}${new URL(i,t).href}${r})`:e);e.setAttribute(`style`,r)})},Y=(e,t)=>{let n=[],r=0,i=null,a=0;for(let o=0;o<e.length;o++){let s=e[o];if(i)s===i&&e[o-1]!==`\\`&&(i=null);else switch(s){case`"`:case`'`:i=s;break;case`(`:r++;break;case`)`:r--;break;case t:r===0&&(n.push(e.slice(a,o).trim()),a=o+1)}}return n.push(e.slice(a).trim()),n.filter(Boolean)},X=(e,t=[...document.styleSheets].filter(e=>!e.href?.includes(`/dist/css/`)))=>{let n=new Set([e,...e.querySelectorAll(`[class]`)].flatMap(e=>[...e.classList])),r=new Set([e,...e.querySelectorAll(`[data-bs-theme]`)].map(e=>e.getAttribute(`data-bs-theme`)).filter(e=>e&&e!==`light`&&e!==`dark`)),i=e=>[...e.matchAll(/\[data-bs-theme=["']?([\w-]+)/g)].some(e=>r.has(e[1])),a=t=>{let r=[...t.replace(/:not\([^)]*\)/g,``).matchAll(/\.(-?[_a-z][\w-]*)/gi)].map(e=>e[1]);if(!((r.some(e=>e!==`bd-example`)||i(t))&&r.every(e=>n.has(e))))return!1;let a=t.replace(/::?[a-z-]+(?![a-z-]|\()/gi,``);try{return e.matches(a)||e.querySelector(a)!==null}catch{return!0}},o=e=>[...e].flatMap(e=>{if(e instanceof CSSStyleRule){let t=Y(e.selectorText,`,`).filter(a),n=Y(e.style.cssText,`;`).map(e=>`  ${e};`);return t.length>0&&n.length>0?[`${t.join(`, `)} {\n${n.join(`
`)}\n}`]:[]}if(e.cssRules){let t=o(e.cssRules),n=e.cssText.slice(0,e.cssText.indexOf(`{`)).trim();return t.length>0?[`${n} {\n${t.join(`
`).replace(/^/gm,`  `)}\n}`]:[]}return[]}),s=t.flatMap(e=>{try{return o(e.cssRules)}catch{return[]}});if(s.length===0)return``;let c=getComputedStyle(e),l=[...new Set(s.join(`
`).match(/--bd-[\w-]+/g))].map(e=>[e,c.getPropertyValue(e).trim()]).filter(([,e])=>e).map(([e,t])=>`  ${e}: ${t};`);return[...l.length>0?[`:root {\n${l.join(`
`)}\n}`]:[],...s].join(`
`)},ce=(e,t,n,r,i)=>{let a=r?`\n    <style>\n${r.replace(/^/gm,`      `)}\n    </style>`:``,o={files:{"index.html":`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="${V.cssCdn}" rel="stylesheet">${a}
    <title>Bootstrap Example</title>
  </head>
  <body class="p-3 m-0 border-0 ${n}">
    <!-- Example Code Start-->
${e.trimStart().replace(/^/gm,`    `).replace(/^ {4}$/gm,``).trimEnd()}
    <!-- Example Code End -->
  </body>
</html>`,"index.js":`${t?`${U(z).replace(`export default () => {`,`const snippets = () => {`).trimEnd()}

snippets()
`:`import '${H}'\n`}${i}`},title:`Bootstrap Example`,description:`Official example from ${window.location.href}`,template:`javascript`,dependencies:{bootstrap:V.currentVersion},tags:[`bootstrap`]};R.openProject(o,{openFile:`index.html`})},le=120,ue=new Set([`pre`,`script`,`style`,`textarea`,`title`]),Z=async e=>{let t=await fetch(e);if(!t.ok)throw Error(`Failed to fetch ${e}: ${t.status}`);return t.text()},Q=(e,t=0)=>{let n=`  `.repeat(t);if(e.nodeType===Node.COMMENT_NODE)return`${n}<!--${e.data}-->`;let r=[...e.childNodes].filter(e=>e.nodeType!==Node.TEXT_NODE||e.textContent.trim()!==``);if(!(n.length+e.outerHTML.length>le&&!ue.has(e.localName)&&r.length>0&&r.every(e=>e.nodeType!==Node.TEXT_NODE)))return`${n}${e.outerHTML}`;let i=`</${e.localName}>`;return[`${n}${e.cloneNode(!1).outerHTML.slice(0,-i.length)}`,...r.map(e=>Q(e,t+1)),`${n}${i}`].join(`
`)},de=e=>e.origin===window.location.origin,fe=async e=>{let t=new DOMParser().parseFromString(await Z(e),`text/html`),n=new URL(`./`,e).pathname,r={},i=[H],a=[],o=[];t.querySelectorAll(`[data-sb-ignore], head link:not([rel~="stylesheet"]), meta[name="generator"], meta[name="theme-color"], script:not([src])`).forEach(e=>e.remove());for(let s of t.querySelectorAll(`link[rel~="stylesheet"], script[src]`)){let t=new URL(s.getAttribute(s.localName===`script`?`src`:`href`),e);if(!de(t))s.localName===`script`&&(i.push(t.href),s.remove());else if(t.pathname.includes(`/dist/css/`))s.setAttribute(`href`,V.cssCdn);else{if(t.pathname.startsWith(n)){let e=t.pathname.slice(n.length);i.push(`./${e}`),o.push(Z(t).then(t=>{r[e]=e.endsWith(`.js`)?U(t):t}))}else s.localName===`link`&&o.push(Z(t).then(e=>a.push(e)));s.remove()}}t.querySelectorAll(`style`).forEach(e=>{a.push(e.textContent),e.remove()}),t.documentElement.dataset.bsTheme===`auto`&&delete t.documentElement.dataset.bsTheme,await Promise.all(o);let s=X(t.body,a.map(e=>{let t=new CSSStyleSheet;return t.replaceSync(e),t}));if(s){let e=t.createElement(`style`);e.textContent=`\n${s.replace(/^/gm,`      `)}\n    `,t.head.querySelector(`link[href="${V.cssCdn}"]`).after(e)}return J(t,e,e=>e!==``&&!e.startsWith(`#`)),{files:{"index.html":`<!doctype html>\n${Q(t.documentElement)}\n`,"index.js":`${i.map(e=>`import '${e}'\n`).join(``)}${q(t.body,Object.keys(K))}`,...r},title:t.title,description:`Official example from ${e.href}`,template:`javascript`,dependencies:{bootstrap:V.currentVersion},tags:[`bootstrap`]}},$=new WeakSet,pe=async e=>{if(!$.has(e)){$.add(e);try{let t=await fe(new URL(e.dataset.sbExample,window.location.href));R.openProject(t,{openFile:`index.html`})}finally{$.delete(e)}}};export{B as n,oe as t};