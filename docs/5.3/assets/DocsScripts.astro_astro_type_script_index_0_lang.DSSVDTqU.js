const x="https://stackblitz.com",S=["angular-cli","create-react-app","html","javascript","node","polymer","typescript","vue"],C=["project","search","ports","settings"],k=["light","dark"],L=["editor","preview"],B=["accelerometer","ambient-light-sensor","autoplay","battery","bluetooth","camera","clipboard-read","clipboard-write","display-capture","encrypted-media","fullscreen","gamepad","geolocation","gyroscope","hid","idle-detection","local-network","local-network-access","loopback-network","magnetometer","microphone","midi","payment","picture-in-picture","publickey-credentials-get","screen-wake-lock","serial","usb","web-share","xr-spatial-tracking"],T={clickToLoad:e=>d("ctl",e),devToolsHeight:e=>I("devtoolsheight",e),forceEmbedLayout:e=>d("embed",e),hideDevTools:e=>d("hidedevtools",e),hideExplorer:e=>d("hideExplorer",e),hideNavigation:e=>d("hideNavigation",e),openFile:e=>u("file",e),showSidebar:e=>N("showSidebar",e),sidebarView:e=>f("sidebarView",e,C),startScript:e=>u("startScript",e),terminalHeight:e=>I("terminalHeight",e),theme:e=>f("theme",e,k),view:e=>f("view",e,L),zenMode:e=>d("zenMode",e),organization:e=>`${u("orgName",e?.name)}&${u("orgProvider",e?.provider)}`,crossOriginIsolated:e=>d("corp",e)};function j(e={}){const t=Object.entries(e).map(([n,o])=>o!=null&&T.hasOwnProperty(n)?T[n](o):"").filter(Boolean);return t.length?`?${t.join("&")}`:""}function d(e,t){return t===!0?`${e}=1`:""}function N(e,t){return typeof t=="boolean"?`${e}=${t?"1":"0"}`:""}function I(e,t){if(typeof t=="number"&&!Number.isNaN(t)){const n=Math.min(100,Math.max(0,t));return`${e}=${encodeURIComponent(Math.round(n))}`}return""}function f(e,t="",n=[]){return n.includes(t)?`${e}=${encodeURIComponent(t)}`:""}function u(e,t){return(Array.isArray(t)?t:[t]).filter(o=>typeof o=="string"&&o.trim()!=="").map(o=>`${e}=${encodeURIComponent(o)}`).join("&")}function P(){return Math.random().toString(36).slice(2,6)+Math.random().toString(36).slice(2,6)}function y(e,t){return`${E(t)}${e}${j(t)}`}function b(e,t){const n={forceEmbedLayout:!0};return t&&typeof t=="object"&&Object.assign(n,t),`${E(n)}${e}${j(n)}`}function E(e={}){return(typeof e.origin=="string"?e.origin:x).replace(/\/$/,"")}function w(e,t,n){if(!t||!e||!e.parentNode)throw new Error("Invalid Element");e.id&&(t.id=e.id),e.className&&(t.className=e.className),O(t,n),M(e,t,n),e.replaceWith(t)}function v(e){if(typeof e=="string"){const t=document.getElementById(e);if(!t)throw new Error(`Could not find element with id '${e}'`);return t}else if(e instanceof HTMLElement)return e;throw new Error(`Invalid element: ${e}`)}function _(e){return e&&e.newWindow===!1?"_self":"_blank"}function O(e,t={}){const n=Object.hasOwnProperty.call(t,"height")?`${t.height}`:"300",o=Object.hasOwnProperty.call(t,"width")?`${t.width}`:void 0;e.setAttribute("height",n),o?e.setAttribute("width",o):e.setAttribute("style","width:100%;")}function M(e,t,n={}){const o=e.allow?.split(";")?.map(s=>s.trim()).filter(Boolean)??[],r=new Set(o.map(s=>s.split(/\s+/)[0]));for(const s of D())r.has(s)||(o.push(`${s} *`),r.add(s));n.crossOriginIsolated&&!r.has("cross-origin-isolated")&&(o.push(`cross-origin-isolated ${E(n)}`),r.add("cross-origin-isolated")),o.length>0&&(t.allow=o.join("; "))}function D(){const e=new Set(B);try{const t=document?.featurePolicy;if(t&&typeof t.allowedFeatures=="function")for(const n of t.allowedFeatures())e.add(n)}catch{}return e.delete("cross-origin-isolated"),[...e]}class F{constructor(t){this.pending={},this.port=t,this.port.onmessage=this.messageListener.bind(this)}request({type:t,payload:n}){return new Promise((o,r)=>{const s=P();this.pending[s]={resolve:o,reject:r},this.port.postMessage({type:t,payload:{...n,__reqid:s}})})}messageListener(t){if(typeof t.data.payload?.__reqid!="string")return;const{type:n,payload:o}=t.data,{__reqid:r,__success:s,__error:a}=o;this.pending[r]&&(s?this.pending[r].resolve(this.cleanResult(o)):this.pending[r].reject(a?`${n}: ${a}`:n),delete this.pending[r])}cleanResult(t){const n={...t};return delete n.__reqid,delete n.__success,delete n.__error,Object.keys(n).length?n:null}}class q{constructor(t,n){this.editor={openFile:o=>this._rdc.request({type:"SDK_OPEN_FILE",payload:{path:o}}),setCurrentFile:o=>this._rdc.request({type:"SDK_SET_CURRENT_FILE",payload:{path:o}}),setTheme:o=>this._rdc.request({type:"SDK_SET_UI_THEME",payload:{theme:o}}),setView:o=>this._rdc.request({type:"SDK_SET_UI_VIEW",payload:{view:o}}),showSidebar:(o=!0)=>this._rdc.request({type:"SDK_TOGGLE_SIDEBAR",payload:{visible:o}})},this.preview={origin:"",getUrl:()=>this._rdc.request({type:"SDK_GET_PREVIEW_URL",payload:{}}).then(o=>o?.url??null),setUrl:(o="/")=>{if(typeof o!="string"||!o.startsWith("/"))throw new Error(`Invalid argument: expected a path starting with '/', got '${o}'`);return this._rdc.request({type:"SDK_SET_PREVIEW_URL",payload:{path:o}})}},this._rdc=new F(t),Object.defineProperty(this.preview,"origin",{value:typeof n.previewOrigin=="string"?n.previewOrigin:null,writable:!1})}applyFsDiff(t){const n=o=>o!==null&&typeof o=="object";if(!n(t)||!n(t.create))throw new Error("Invalid diff object: expected diff.create to be an object.");if(!Array.isArray(t.destroy))throw new Error("Invalid diff object: expected diff.destroy to be an array.");return this._rdc.request({type:"SDK_APPLY_FS_DIFF",payload:t})}getDependencies(){return this._rdc.request({type:"SDK_GET_DEPS_SNAPSHOT",payload:{}})}getFsSnapshot(){return this._rdc.request({type:"SDK_GET_FS_SNAPSHOT",payload:{}})}}const m=[];class U{constructor(t){this.id=P(),this.element=t,this.pending=new Promise((n,o)=>{const r=({data:i,ports:c})=>{i?.action==="SDK_INIT_SUCCESS"&&i.id===this.id&&(this.vm=new q(c[0],i.payload),n(this.vm),a())},s=()=>{this.element.contentWindow?.postMessage({action:"SDK_INIT",id:this.id},"*")};function a(){window.clearInterval(p),window.removeEventListener("message",r)}window.addEventListener("message",r),s();let l=0;const p=window.setInterval(()=>{if(this.vm){a();return}if(l>=20){a(),o("Timeout: Unable to establish a connection with the StackBlitz VM"),m.forEach((i,c)=>{i.id===this.id&&m.splice(c,1)});return}l++,s()},500)}),m.push(this)}}const R=e=>{const t=e instanceof Element?"element":"id";return m.find(n=>n[t]===e)??null};function H(e,t){const n=document.createElement("input");return n.type="hidden",n.name=e,n.value=t,n}function V(e){return e.replace(/\[/g,"%5B").replace(/\]/g,"%5D")}function $({template:e,title:t,description:n,dependencies:o,files:r,settings:s}){if(!S.includes(e)){const i=S.map(c=>`'${c}'`).join(", ");console.warn(`Unsupported project.template: must be one of ${i}`)}const a=[],l=(i,c,A="")=>{a.push(H(i,typeof c=="string"?c:A))};l("project[title]",t),typeof n=="string"&&n.length>0&&l("project[description]",n),l("project[template]",e,"javascript"),o&&(e==="node"?console.warn("Invalid project.dependencies: dependencies must be provided as a 'package.json' file when using the 'node' template."):l("project[dependencies]",JSON.stringify(o))),s&&l("project[settings]",JSON.stringify(s)),Object.entries(r).forEach(([i,c])=>{l(`project[files][${V(i)}]`,c)});const p=document.createElement("form");return p.method="POST",p.setAttribute("style","display:none!important;"),p.append(...a),p}function z(e,t){const n=$(e);return n.action=b("/run",t),n.id="sb_run",`<!doctype html>
<html>
<head><title></title></head>
<body>
  ${n.outerHTML}
  <script>document.getElementById('${n.id}').submit();<\/script>
</body>
</html>`}function K(e,t){const n=$(e);n.action=y("/run",t),n.target=_(t),document.body.appendChild(n),n.submit(),document.body.removeChild(n)}function h(e){return e?.contentWindow?(R(e)??new U(e)).pending:Promise.reject("Provided element is not an iframe.")}function G(e,t){K(e,t)}function W(e,t){const n=y(`/edit/${e}`,t),o=_(t);window.open(n,o)}function J(e,t){const n=y(`/github/${e}`,t),o=_(t);window.open(n,o)}function X(e,t,n){const o=v(e),r=z(t,n),s=document.createElement("iframe");return w(o,s,n),s.contentDocument?.write(r),h(s)}function Y(e,t,n){const o=v(e),r=document.createElement("iframe");return r.src=b(`/edit/${t}`,n),w(o,r,n),h(r)}function Q(e,t,n){const o=v(e),r=document.createElement("iframe");return r.src=b(`/github/${t}`,n),w(o,r,n),h(r)}const Z={connect:h,embedGithubProject:Q,embedProject:X,embedProjectId:Y,openGithubProject:J,openProject:G,openProjectId:W},ee=`// NOTICE!!! Initially embedded in our docs this JavaScript
// file contains elements that can help you create reproducible
// use cases in StackBlitz for instance.
// In a real project please adapt this content to your needs.
// ++++++++++++++++++++++++++++++++++++++++++

/*
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2026 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

/* global bootstrap: false */

export default () => {
  // --------
  // Tooltips
  // --------
  // Instantiate all tooltips in a docs or StackBlitz
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach(tooltip => {
      new bootstrap.Tooltip(tooltip)
    })

  // --------
  // Popovers
  // --------
  // Instantiate all popovers in docs or StackBlitz
  document.querySelectorAll('[data-bs-toggle="popover"]')
    .forEach(popover => {
      new bootstrap.Popover(popover)
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
  document.querySelectorAll('.bd-example .toast')
    .forEach(toastNode => {
      const toast = new bootstrap.Toast(toastNode, {
        autohide: false
      })

      toast.show()
    })

  // Instantiate all toasts in docs pages only
  // js-docs-start live-toast
  const toastTrigger = document.getElementById('liveToastBtn')
  const toastLiveExample = document.getElementById('liveToast')

  if (toastTrigger) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastTrigger.addEventListener('click', () => {
      toastBootstrap.show()
    })
  }
  // js-docs-end live-toast

  // -------------------------------
  // Alerts
  // -------------------------------
  // Used in 'Show live alert' example in docs or StackBlitz

  // js-docs-start live-alert
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      \`<div class="alert alert-\${type} alert-dismissible" role="alert">\`,
      \`   <div>\${message}</div>\`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
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

  // --------
  // Carousels
  // --------
  // Instantiate all non-autoplaying carousels in docs or StackBlitz
  document.querySelectorAll('.carousel:not([data-bs-ride="carousel"])')
    .forEach(carousel => {
      bootstrap.Carousel.getOrCreateInstance(carousel)
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
  // Modal
  // -------------------------------
  // Modal 'Varying modal content' example in docs and StackBlitz
  // js-docs-start varying-modal-content
  const exampleModal = document.getElementById('exampleModal')
  if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', event => {
      // Button that triggered the modal
      const button = event.relatedTarget
      // Extract info from data-bs-* attributes
      const recipient = button.getAttribute('data-bs-whatever')
      // If necessary, you could initiate an Ajax request here
      // and then do the updating in a callback.

      // Update the modal's content.
      const modalTitle = exampleModal.querySelector('.modal-title')
      const modalBodyInput = exampleModal.querySelector('.modal-body input')

      modalTitle.textContent = \`New message to \${recipient}\`
      modalBodyInput.value = recipient
    })
  }
  // js-docs-end varying-modal-content

  // -------------------------------
  // Offcanvas
  // -------------------------------
  // 'Offcanvas components' example in docs only
  const myOffcanvas = document.querySelectorAll('.bd-example-offcanvas .offcanvas')
  if (myOffcanvas) {
    myOffcanvas.forEach(offcanvas => {
      offcanvas.addEventListener('show.bs.offcanvas', event => {
        event.preventDefault()
      }, false)
    })
  }
}
`,g={cssCdn:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css",jsBundleCdn:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/js/bootstrap.bundle.min.js",docsVersion:"5.3"};document.querySelectorAll(".btn-edit").forEach(e=>{e.addEventListener("click",t=>{const n=t.target.closest(".bd-code-snippet"),o=n.querySelector(".bd-example"),r=o.innerHTML,s=n.querySelector(".btn-edit").getAttribute("data-sb-js-snippet"),a=Array.from(o.classList).join(" ");te(r,s,a)})});const te=(e,t,n)=>{const o=`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="${g.cssCdn}" rel="stylesheet">
    <link href="https://getbootstrap.com/docs/${g.docsVersion}/assets/css/docs.css" rel="stylesheet">
    <title>Bootstrap Example</title>
    <script defer src="${g.jsBundleCdn}"><\/script>
  </head>
  <body class="p-3 m-0 border-0 ${n}">
    <!-- Example Code Start-->
${e.trimStart().replace(/^/gm,"    ").replace(/^ {4}$/gm,"").trimEnd()}
    <!-- Example Code End -->
  </body>
</html>`;let r="";t&&(r=ee.replace("export default () => {","const snippets_default = () => {"),r=`(() => {
  ${r}

  // <stdin>
  snippets_default();
})();`);const s={files:{"index.html":o,...t&&{"index.js":r}},title:"Bootstrap Example",description:`Official example from ${window.location.href}`,template:t?"javascript":"html"};Z.openProject(s,{openFile:"index.html"})};
