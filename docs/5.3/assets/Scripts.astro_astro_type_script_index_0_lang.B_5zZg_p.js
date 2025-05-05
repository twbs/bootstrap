const C="https://stackblitz.com",_=["angular-cli","create-react-app","html","javascript","node","polymer","typescript","vue"],x=["project","search","ports","settings"],L=["light","dark"],N=["editor","preview"],S={clickToLoad:e=>d("ctl",e),devToolsHeight:e=>T("devtoolsheight",e),forceEmbedLayout:e=>d("embed",e),hideDevTools:e=>d("hidedevtools",e),hideExplorer:e=>d("hideExplorer",e),hideNavigation:e=>d("hideNavigation",e),openFile:e=>u("file",e),showSidebar:e=>B("showSidebar",e),sidebarView:e=>f("sidebarView",e,x),startScript:e=>u("startScript",e),terminalHeight:e=>T("terminalHeight",e),theme:e=>f("theme",e,L),view:e=>f("view",e,N),zenMode:e=>d("zenMode",e),organization:e=>`${u("orgName",e?.name)}&${u("orgProvider",e?.provider)}`,crossOriginIsolated:e=>d("corp",e)};function I(e={}){const t=Object.entries(e).map(([n,o])=>o!=null&&S.hasOwnProperty(n)?S[n](o):"").filter(Boolean);return t.length?`?${t.join("&")}`:""}function d(e,t){return t===!0?`${e}=1`:""}function B(e,t){return typeof t=="boolean"?`${e}=${t?"1":"0"}`:""}function T(e,t){if(typeof t=="number"&&!Number.isNaN(t)){const n=Math.min(100,Math.max(0,t));return`${e}=${encodeURIComponent(Math.round(n))}`}return""}function f(e,t="",n=[]){return n.includes(t)?`${e}=${encodeURIComponent(t)}`:""}function u(e,t){return(Array.isArray(t)?t:[t]).filter(o=>typeof o=="string"&&o.trim()!=="").map(o=>`${e}=${encodeURIComponent(o)}`).join("&")}function j(){return Math.random().toString(36).slice(2,6)+Math.random().toString(36).slice(2,6)}function y(e,t){return`${P(t)}${e}${I(t)}`}function b(e,t){const n={forceEmbedLayout:!0};return t&&typeof t=="object"&&Object.assign(n,t),`${P(n)}${e}${I(n)}`}function P(e={}){return(typeof e.origin=="string"?e.origin:C).replace(/\/$/,"")}function E(e,t,n){if(!t||!e||!e.parentNode)throw new Error("Invalid Element");e.id&&(t.id=e.id),e.className&&(t.className=e.className),O(t,n),k(e,t,n),e.replaceWith(t)}function v(e){if(typeof e=="string"){const t=document.getElementById(e);if(!t)throw new Error(`Could not find element with id '${e}'`);return t}else if(e instanceof HTMLElement)return e;throw new Error(`Invalid element: ${e}`)}function w(e){return e&&e.newWindow===!1?"_self":"_blank"}function O(e,t={}){const n=Object.hasOwnProperty.call(t,"height")?`${t.height}`:"300",o=Object.hasOwnProperty.call(t,"width")?`${t.width}`:void 0;e.setAttribute("height",n),o?e.setAttribute("width",o):e.setAttribute("style","width:100%;")}function k(e,t,n={}){const o=e.allow?.split(";")?.map(s=>s.trim())??[];n.crossOriginIsolated&&!o.includes("cross-origin-isolated")&&o.push("cross-origin-isolated"),o.length>0&&(t.allow=o.join("; "))}class M{constructor(t){this.pending={},this.port=t,this.port.onmessage=this.messageListener.bind(this)}request({type:t,payload:n}){return new Promise((o,s)=>{const r=j();this.pending[r]={resolve:o,reject:s},this.port.postMessage({type:t,payload:{...n,__reqid:r}})})}messageListener(t){if(typeof t.data.payload?.__reqid!="string")return;const{type:n,payload:o}=t.data,{__reqid:s,__success:r,__error:i}=o;this.pending[s]&&(r?this.pending[s].resolve(this.cleanResult(o)):this.pending[s].reject(i?`${n}: ${i}`:n),delete this.pending[s])}cleanResult(t){const n={...t};return delete n.__reqid,delete n.__success,delete n.__error,Object.keys(n).length?n:null}}class D{constructor(t,n){this.editor={openFile:o=>this._rdc.request({type:"SDK_OPEN_FILE",payload:{path:o}}),setCurrentFile:o=>this._rdc.request({type:"SDK_SET_CURRENT_FILE",payload:{path:o}}),setTheme:o=>this._rdc.request({type:"SDK_SET_UI_THEME",payload:{theme:o}}),setView:o=>this._rdc.request({type:"SDK_SET_UI_VIEW",payload:{view:o}}),showSidebar:(o=!0)=>this._rdc.request({type:"SDK_TOGGLE_SIDEBAR",payload:{visible:o}})},this.preview={origin:"",getUrl:()=>this._rdc.request({type:"SDK_GET_PREVIEW_URL",payload:{}}).then(o=>o?.url??null),setUrl:(o="/")=>{if(typeof o!="string"||!o.startsWith("/"))throw new Error(`Invalid argument: expected a path starting with '/', got '${o}'`);return this._rdc.request({type:"SDK_SET_PREVIEW_URL",payload:{path:o}})}},this._rdc=new M(t),Object.defineProperty(this.preview,"origin",{value:typeof n.previewOrigin=="string"?n.previewOrigin:null,writable:!1})}applyFsDiff(t){const n=o=>o!==null&&typeof o=="object";if(!n(t)||!n(t.create))throw new Error("Invalid diff object: expected diff.create to be an object.");if(!Array.isArray(t.destroy))throw new Error("Invalid diff object: expected diff.destroy to be an array.");return this._rdc.request({type:"SDK_APPLY_FS_DIFF",payload:t})}getDependencies(){return this._rdc.request({type:"SDK_GET_DEPS_SNAPSHOT",payload:{}})}getFsSnapshot(){return this._rdc.request({type:"SDK_GET_FS_SNAPSHOT",payload:{}})}}const m=[];class q{constructor(t){this.id=j(),this.element=t,this.pending=new Promise((n,o)=>{const s=({data:a,ports:c})=>{a?.action==="SDK_INIT_SUCCESS"&&a.id===this.id&&(this.vm=new D(c[0],a.payload),n(this.vm),i())},r=()=>{this.element.contentWindow?.postMessage({action:"SDK_INIT",id:this.id},"*")};function i(){window.clearInterval(p),window.removeEventListener("message",s)}window.addEventListener("message",s),r();let l=0;const p=window.setInterval(()=>{if(this.vm){i();return}if(l>=20){i(),o("Timeout: Unable to establish a connection with the StackBlitz VM"),m.forEach((a,c)=>{a.id===this.id&&m.splice(c,1)});return}l++,r()},500)}),m.push(this)}}const F=e=>{const t=e instanceof Element?"element":"id";return m.find(n=>n[t]===e)??null};function U(e,t){const n=document.createElement("input");return n.type="hidden",n.name=e,n.value=t,n}function R(e){return e.replace(/\[/g,"%5B").replace(/\]/g,"%5D")}function $({template:e,title:t,description:n,dependencies:o,files:s,settings:r}){if(!_.includes(e)){const a=_.map(c=>`'${c}'`).join(", ");console.warn(`Unsupported project.template: must be one of ${a}`)}const i=[],l=(a,c,A="")=>{i.push(U(a,typeof c=="string"?c:A))};l("project[title]",t),typeof n=="string"&&n.length>0&&l("project[description]",n),l("project[template]",e,"javascript"),o&&(e==="node"?console.warn("Invalid project.dependencies: dependencies must be provided as a 'package.json' file when using the 'node' template."):l("project[dependencies]",JSON.stringify(o))),r&&l("project[settings]",JSON.stringify(r)),Object.entries(s).forEach(([a,c])=>{l(`project[files][${R(a)}]`,c)});const p=document.createElement("form");return p.method="POST",p.setAttribute("style","display:none!important;"),p.append(...i),p}function H(e,t){const n=$(e);return n.action=b("/run",t),n.id="sb_run",`<!doctype html>
<html>
<head><title></title></head>
<body>
  ${n.outerHTML}
  <script>document.getElementById('${n.id}').submit();<\/script>
</body>
</html>`}function V(e,t){const n=$(e);n.action=y("/run",t),n.target=w(t),document.body.appendChild(n),n.submit(),document.body.removeChild(n)}function h(e){return e?.contentWindow?(F(e)??new q(e)).pending:Promise.reject("Provided element is not an iframe.")}function z(e,t){V(e,t)}function K(e,t){const n=y(`/edit/${e}`,t),o=w(t);window.open(n,o)}function G(e,t){const n=y(`/github/${e}`,t),o=w(t);window.open(n,o)}function W(e,t,n){const o=v(e),s=H(t,n),r=document.createElement("iframe");return E(o,r,n),r.contentDocument?.write(s),h(r)}function J(e,t,n){const o=v(e),s=document.createElement("iframe");return s.src=b(`/edit/${t}`,n),E(o,s,n),h(s)}function X(e,t,n){const o=v(e),s=document.createElement("iframe");return s.src=b(`/github/${t}`,n),E(o,s,n),h(s)}const Y={connect:h,embedGithubProject:X,embedProject:W,embedProjectId:J,openGithubProject:G,openProject:z,openProjectId:K},Q=`// NOTICE!!! Initially embedded in our docs this JavaScript
// file contains elements that can help you create reproducible
// use cases in StackBlitz for instance.
// In a real project please adapt this content to your needs.
// ++++++++++++++++++++++++++++++++++++++++++

/*
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2025 The Bootstrap Authors
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
`,g={cssCdn:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css",jsBundleCdn:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js",docsVersion:"5.3"};document.querySelectorAll(".btn-edit").forEach(e=>{e.addEventListener("click",t=>{const n=t.target.closest(".bd-code-snippet"),o=n.querySelector(".bd-example"),s=o.innerHTML,r=n.querySelector(".btn-edit").getAttribute("data-sb-js-snippet"),i=Array.from(o.classList).join(" ");Z(s,r,i)})});const Z=(e,t,n)=>{const o=`<!doctype html>
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
</html>`;let s="";t&&(s=Q.replace("export default () => {","const snippets_default = () => {"),s=`(() => {
  ${s}

  // <stdin>
  snippets_default();
})();`);const r={files:{"index.html":o,...t&&{"index.js":s}},title:"Bootstrap Example",description:`Official example from ${window.location.href}`,template:t?"javascript":"html",tags:["bootstrap"]};Y.openProject(r,{openFile:"index.html"})};
