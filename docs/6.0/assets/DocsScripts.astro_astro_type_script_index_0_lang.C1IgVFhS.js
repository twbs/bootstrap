var e=[`angular-cli`,`create-react-app`,`html`,`javascript`,`node`,`polymer`,`typescript`,`vue`],t=[`project`,`search`,`ports`,`settings`],n=[`light`,`dark`],r=[`editor`,`preview`],i=`accelerometer.ambient-light-sensor.autoplay.battery.bluetooth.camera.clipboard-read.clipboard-write.display-capture.encrypted-media.fullscreen.gamepad.geolocation.gyroscope.hid.idle-detection.local-network.local-network-access.loopback-network.magnetometer.microphone.midi.payment.picture-in-picture.publickey-credentials-get.screen-wake-lock.serial.usb.web-share.xr-spatial-tracking`.split(`.`),a={clickToLoad:e=>s(`ctl`,e),devToolsHeight:e=>l(`devtoolsheight`,e),forceEmbedLayout:e=>s(`embed`,e),hideDevTools:e=>s(`hidedevtools`,e),hideExplorer:e=>s(`hideExplorer`,e),hideNavigation:e=>s(`hideNavigation`,e),openFile:e=>d(`file`,e),showSidebar:e=>c(`showSidebar`,e),sidebarView:e=>u(`sidebarView`,e,t),startScript:e=>d(`startScript`,e),terminalHeight:e=>l(`terminalHeight`,e),theme:e=>u(`theme`,e,n),view:e=>u(`view`,e,r),zenMode:e=>s(`zenMode`,e),organization:e=>`${d(`orgName`,e?.name)}&${d(`orgProvider`,e?.provider)}`,crossOriginIsolated:e=>s(`corp`,e)};function o(e={}){let t=Object.entries(e).map(([e,t])=>t!=null&&a.hasOwnProperty(e)?a[e](t):``).filter(Boolean);return t.length?`?${t.join(`&`)}`:``}function s(e,t){return t===!0?`${e}=1`:``}function c(e,t){return typeof t==`boolean`?`${e}=${t?`1`:`0`}`:``}function l(e,t){return typeof t==`number`&&!Number.isNaN(t)?`${e}=${encodeURIComponent(Math.round(Math.min(100,Math.max(0,t))))}`:``}function u(e,t=``,n=[]){return n.includes(t)?`${e}=${encodeURIComponent(t)}`:``}function d(e,t){return(Array.isArray(t)?t:[t]).filter(e=>typeof e==`string`&&e.trim()!==``).map(t=>`${e}=${encodeURIComponent(t)}`).join(`&`)}function f(){return Math.random().toString(36).slice(2,6)+Math.random().toString(36).slice(2,6)}function p(e,t){return`${h(t)}${e}${o(t)}`}function m(e,t){let n={forceEmbedLayout:!0};return t&&typeof t==`object`&&Object.assign(n,t),`${h(n)}${e}${o(n)}`}function h(e={}){return(typeof e.origin==`string`?e.origin:`https://stackblitz.com`).replace(/\/$/,``)}function g(e,t,n){if(!t||!e||!e.parentNode)throw Error(`Invalid Element`);e.id&&(t.id=e.id),e.className&&(t.className=e.className),y(t,n),b(e,t,n),e.replaceWith(t)}function _(e){if(typeof e==`string`){let t=document.getElementById(e);if(!t)throw Error(`Could not find element with id '${e}'`);return t}else if(e instanceof HTMLElement)return e;throw Error(`Invalid element: ${e}`)}function v(e){return e&&e.newWindow===!1?`_self`:`_blank`}function y(e,t={}){let n=Object.hasOwnProperty.call(t,`height`)?`${t.height}`:`300`,r=Object.hasOwnProperty.call(t,`width`)?`${t.width}`:void 0;e.setAttribute(`height`,n),r?e.setAttribute(`width`,r):e.setAttribute(`style`,`width:100%;`)}function b(e,t,n={}){let r=e.allow?.split(`;`)?.map(e=>e.trim()).filter(Boolean)??[],i=new Set(r.map(e=>e.split(/\s+/)[0]));for(let e of x())i.has(e)||(r.push(`${e} *`),i.add(e));n.crossOriginIsolated&&!i.has(`cross-origin-isolated`)&&(r.push(`cross-origin-isolated ${h(n)}`),i.add(`cross-origin-isolated`)),r.length>0&&(t.allow=r.join(`; `))}function x(){let e=new Set(i);try{let t=document?.featurePolicy;if(t&&typeof t.allowedFeatures==`function`)for(let n of t.allowedFeatures())e.add(n)}catch{}return e.delete(`cross-origin-isolated`),[...e]}var S=class{constructor(e){this.pending={},this.port=e,this.port.onmessage=this.messageListener.bind(this)}request({type:e,payload:t}){return new Promise((n,r)=>{let i=f();this.pending[i]={resolve:n,reject:r},this.port.postMessage({type:e,payload:{...t,__reqid:i}})})}messageListener(e){if(typeof e.data.payload?.__reqid!=`string`)return;let{type:t,payload:n}=e.data,{__reqid:r,__success:i,__error:a}=n;this.pending[r]&&(i?this.pending[r].resolve(this.cleanResult(n)):this.pending[r].reject(a?`${t}: ${a}`:t),delete this.pending[r])}cleanResult(e){let t={...e};return delete t.__reqid,delete t.__success,delete t.__error,Object.keys(t).length?t:null}},C=class{constructor(e,t){this.editor={openFile:e=>this._rdc.request({type:`SDK_OPEN_FILE`,payload:{path:e}}),setCurrentFile:e=>this._rdc.request({type:`SDK_SET_CURRENT_FILE`,payload:{path:e}}),setTheme:e=>this._rdc.request({type:`SDK_SET_UI_THEME`,payload:{theme:e}}),setView:e=>this._rdc.request({type:`SDK_SET_UI_VIEW`,payload:{view:e}}),showSidebar:(e=!0)=>this._rdc.request({type:`SDK_TOGGLE_SIDEBAR`,payload:{visible:e}})},this.preview={origin:``,getUrl:()=>this._rdc.request({type:`SDK_GET_PREVIEW_URL`,payload:{}}).then(e=>e?.url??null),setUrl:(e=`/`)=>{if(typeof e!=`string`||!e.startsWith(`/`))throw Error(`Invalid argument: expected a path starting with '/', got '${e}'`);return this._rdc.request({type:`SDK_SET_PREVIEW_URL`,payload:{path:e}})}},this._rdc=new S(e),Object.defineProperty(this.preview,"origin",{value:typeof t.previewOrigin==`string`?t.previewOrigin:null,writable:!1})}applyFsDiff(e){let t=e=>typeof e==`object`&&!!e;if(!t(e)||!t(e.create))throw Error(`Invalid diff object: expected diff.create to be an object.`);if(!Array.isArray(e.destroy))throw Error(`Invalid diff object: expected diff.destroy to be an array.`);return this._rdc.request({type:`SDK_APPLY_FS_DIFF`,payload:e})}getDependencies(){return this._rdc.request({type:`SDK_GET_DEPS_SNAPSHOT`,payload:{}})}getFsSnapshot(){return this._rdc.request({type:`SDK_GET_FS_SNAPSHOT`,payload:{}})}},w=[],T=class{constructor(e){this.id=f(),this.element=e,this.pending=new Promise((e,t)=>{let n=({data:t,ports:n})=>{t?.action===`SDK_INIT_SUCCESS`&&t.id===this.id&&(this.vm=new C(n[0],t.payload),e(this.vm),i())},r=()=>{this.element.contentWindow?.postMessage({action:`SDK_INIT`,id:this.id},`*`)};function i(){window.clearInterval(o),window.removeEventListener(`message`,n)}window.addEventListener(`message`,n),r();let a=0,o=window.setInterval(()=>{if(this.vm){i();return}if(a>=20){i(),t(`Timeout: Unable to establish a connection with the StackBlitz VM`),w.forEach((e,t)=>{e.id===this.id&&w.splice(t,1)});return}a++,r()},500)}),w.push(this)}},E=e=>{let t=e instanceof Element?`element`:`id`;return w.find(n=>n[t]===e)??null};function D(e,t){let n=document.createElement(`input`);return n.type=`hidden`,n.name=e,n.value=t,n}function O(e){return e.replace(/\[/g,`%5B`).replace(/\]/g,`%5D`)}function k({template:t,title:n,description:r,dependencies:i,files:a,settings:o}){if(!e.includes(t)){let t=e.map(e=>`'${e}'`).join(`, `);console.warn(`Unsupported project.template: must be one of ${t}`)}let s=[],c=(e,t,n=``)=>{s.push(D(e,typeof t==`string`?t:n))};c(`project[title]`,n),typeof r==`string`&&r.length>0&&c(`project[description]`,r),c(`project[template]`,t,`javascript`),i&&(t===`node`?console.warn(`Invalid project.dependencies: dependencies must be provided as a 'package.json' file when using the 'node' template.`):c(`project[dependencies]`,JSON.stringify(i))),o&&c(`project[settings]`,JSON.stringify(o)),Object.entries(a).forEach(([e,t])=>{c(`project[files][${O(e)}]`,t)});let l=document.createElement(`form`);return l.method=`POST`,l.setAttribute(`style`,`display:none!important;`),l.append(...s),l}function A(e,t){let n=k(e);return n.action=m(`/run`,t),n.id=`sb_run`,`<!doctype html>
<html>
<head><title></title></head>
<body>
  ${n.outerHTML}
  <script>document.getElementById('${n.id}').submit();<\/script>
</body>
</html>`}function j(e,t){let n=k(e);n.action=p(`/run`,t),n.target=v(t),document.body.appendChild(n),n.submit(),document.body.removeChild(n)}function M(e){return e?.contentWindow?(E(e)??new T(e)).pending:Promise.reject(`Provided element is not an iframe.`)}function N(e,t){j(e,t)}function P(e,t){let n=p(`/edit/${e}`,t),r=v(t);window.open(n,r)}function F(e,t){let n=p(`/github/${e}`,t),r=v(t);window.open(n,r)}function I(e,t,n){let r=_(e),i=A(t,n),a=document.createElement(`iframe`);return g(r,a,n),a.contentDocument?.write(i),M(a)}function L(e,t,n){let r=_(e),i=document.createElement(`iframe`);return i.src=m(`/edit/${t}`,n),g(r,i,n),M(i)}function R(e,t,n){let r=_(e),i=document.createElement(`iframe`);return i.src=m(`/github/${t}`,n),g(r,i,n),M(i)}var z={connect:M,embedGithubProject:R,embedProject:I,embedProjectId:L,openGithubProject:F,openProject:N,openProjectId:P},B=`// NOTICE: Embedded as-is into StackBlitz playgrounds via \`?raw\` import.
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
  Carousel
} from '@bootstrap'

export default () => {
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
`,V={cssCdn:`https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css`,jsBundleCdn:`https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js`,docsVersion:`6.0`},H=()=>{document.querySelectorAll(`.btn-edit`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.target.closest(`.bd-code-snippet`),n=t.querySelector(`.bd-example`),r=n.innerHTML;U(r,t.querySelector(`.btn-edit`).getAttribute(`data-sb-js-snippet`),[...n.classList].join(` `))})})},U=(e,t,n)=>{let r=`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="${V.cssCdn}" rel="stylesheet">
    <link href="https://getbootstrap.com/docs/${V.docsVersion}/assets/css/docs.css" rel="stylesheet">
    <title>Bootstrap Example</title>
    <script defer src="${V.jsBundleCdn}"><\/script>
  </head>
  <body class="p-3 m-0 border-0 ${n}">
    <!-- Example Code Start-->
${e.trimStart().replace(/^/gm,`    `).replace(/^ {4}$/gm,``).trimEnd()}
    <!-- Example Code End -->
  </body>
</html>`,i=``;t&&(i=B.replace(`export default () => {`,`const snippets_default = () => {`),i=`(() => {
  ${i}

  // <stdin>
  snippets_default();
})();`);let a={files:{"index.html":r,...t&&{"index.js":i}},title:`Bootstrap Example`,description:`Official example from ${window.location.href}`,template:t?`javascript`:`html`,tags:[`bootstrap`]};z.openProject(a,{openFile:`index.html`})};H();