(()=>{var B="https://stackblitz.com",j=["angular-cli","create-react-app","html","javascript","node","polymer","typescript","vue"],F=["project","search","ports","settings"],k=["light","dark"],U=["editor","preview"],I={clickToLoad:e=>d("ctl",e),devToolsHeight:e=>P("devtoolsheight",e),forceEmbedLayout:e=>d("embed",e),hideDevTools:e=>d("hidedevtools",e),hideExplorer:e=>d("hideExplorer",e),hideNavigation:e=>d("hideNavigation",e),openFile:e=>u("file",e),showSidebar:e=>H("showSidebar",e),sidebarView:e=>g("sidebarView",e,F),startScript:e=>u("startScript",e),terminalHeight:e=>P("terminalHeight",e),theme:e=>g("theme",e,k),view:e=>g("view",e,U),zenMode:e=>d("zenMode",e),organization:e=>`${u("orgName",e==null?void 0:e.name)}&${u("orgProvider",e==null?void 0:e.provider)}`,crossOriginIsolated:e=>d("corp",e)};function $(e={}){let t=Object.entries(e).map(([n,o])=>o!=null&&I.hasOwnProperty(n)?I[n](o):"").filter(Boolean);return t.length?`?${t.join("&")}`:""}function d(e,t){return t===!0?`${e}=1`:""}function H(e,t){return typeof t=="boolean"?`${e}=${t?"1":"0"}`:""}function P(e,t){if(typeof t=="number"&&!Number.isNaN(t)){let n=Math.min(100,Math.max(0,t));return`${e}=${encodeURIComponent(Math.round(n))}`}return""}function g(e,t="",n=[]){return n.includes(t)?`${e}=${encodeURIComponent(t)}`:""}function u(e,t){return(Array.isArray(t)?t:[t]).filter(o=>typeof o=="string"&&o.trim()!=="").map(o=>`${e}=${encodeURIComponent(o)}`).join("&")}function A(){return Math.random().toString(36).slice(2,6)+Math.random().toString(36).slice(2,6)}function w(e,t){return`${x(t)}${e}${$(t)}`}function _(e,t){let n={forceEmbedLayout:!0};return t&&typeof t=="object"&&Object.assign(n,t),`${x(n)}${e}${$(n)}`}function x(e={}){return(typeof e.origin=="string"?e.origin:B).replace(/\/$/,"")}function v(e,t,n){if(!t||!e||!e.parentNode)throw new Error("Invalid Element");e.id&&(t.id=e.id),e.className&&(t.className=e.className),R(t,n),K(e,t,n),e.replaceWith(t)}function S(e){if(typeof e=="string"){let t=document.getElementById(e);if(!t)throw new Error(`Could not find element with id '${e}'`);return t}else if(e instanceof HTMLElement)return e;throw new Error(`Invalid element: ${e}`)}function T(e){return e&&e.newWindow===!1?"_self":"_blank"}function R(e,t={}){let n=Object.hasOwnProperty.call(t,"height")?`${t.height}`:"300",o=Object.hasOwnProperty.call(t,"width")?`${t.width}`:void 0;e.setAttribute("height",n),o?e.setAttribute("width",o):e.setAttribute("style","width:100%;")}function K(e,t,n={}){var r,s,i;let o=(i=(s=(r=e.allow)==null?void 0:r.split(";"))==null?void 0:s.map(a=>a.trim()))!=null?i:[];n.crossOriginIsolated&&!o.includes("cross-origin-isolated")&&o.push("cross-origin-isolated"),o.length>0&&(t.allow=o.join("; "))}var b=class{constructor(t){this.pending={},this.port=t,this.port.onmessage=this.messageListener.bind(this)}request({type:t,payload:n}){return new Promise((o,r)=>{let s=A();this.pending[s]={resolve:o,reject:r},this.port.postMessage({type:t,payload:{...n,__reqid:s}})})}messageListener(t){var a;if(typeof((a=t.data.payload)==null?void 0:a.__reqid)!="string")return;let{type:n,payload:o}=t.data,{__reqid:r,__success:s,__error:i}=o;this.pending[r]&&(s?this.pending[r].resolve(this.cleanResult(o)):this.pending[r].reject(i?`${n}: ${i}`:n),delete this.pending[r])}cleanResult(t){let n={...t};return delete n.__reqid,delete n.__success,delete n.__error,Object.keys(n).length?n:null}},y=class{constructor(t,n){this.editor={openFile:o=>this._rdc.request({type:"SDK_OPEN_FILE",payload:{path:o}}),setCurrentFile:o=>this._rdc.request({type:"SDK_SET_CURRENT_FILE",payload:{path:o}}),setTheme:o=>this._rdc.request({type:"SDK_SET_UI_THEME",payload:{theme:o}}),setView:o=>this._rdc.request({type:"SDK_SET_UI_VIEW",payload:{view:o}}),showSidebar:(o=!0)=>this._rdc.request({type:"SDK_TOGGLE_SIDEBAR",payload:{visible:o}})},this.preview={origin:"",getUrl:()=>this._rdc.request({type:"SDK_GET_PREVIEW_URL",payload:{}}).then(o=>{var r;return(r=o==null?void 0:o.url)!=null?r:null}),setUrl:(o="/")=>{if(typeof o!="string"||!o.startsWith("/"))throw new Error(`Invalid argument: expected a path starting with '/', got '${o}'`);return this._rdc.request({type:"SDK_SET_PREVIEW_URL",payload:{path:o}})}},this._rdc=new b(t),Object.defineProperty(this.preview,"origin",{value:typeof n.previewOrigin=="string"?n.previewOrigin:null,writable:!1})}applyFsDiff(t){let n=o=>o!==null&&typeof o=="object";if(!n(t)||!n(t.create))throw new Error("Invalid diff object: expected diff.create to be an object.");if(!Array.isArray(t.destroy))throw new Error("Invalid diff object: expected diff.destroy to be an array.");return this._rdc.request({type:"SDK_APPLY_FS_DIFF",payload:t})}getDependencies(){return this._rdc.request({type:"SDK_GET_DEPS_SNAPSHOT",payload:{}})}getFsSnapshot(){return this._rdc.request({type:"SDK_GET_FS_SNAPSHOT",payload:{}})}},m=[],E=class{constructor(t){this.id=A(),this.element=t,this.pending=new Promise((n,o)=>{let r=({data:c,ports:l})=>{(c==null?void 0:c.action)==="SDK_INIT_SUCCESS"&&c.id===this.id&&(this.vm=new y(l[0],c.payload),n(this.vm),i())},s=()=>{var c;(c=this.element.contentWindow)==null||c.postMessage({action:"SDK_INIT",id:this.id},"*")};function i(){window.clearInterval(p),window.removeEventListener("message",r)}window.addEventListener("message",r),s();let a=0,p=window.setInterval(()=>{if(this.vm){i();return}if(a>=20){i(),o("Timeout: Unable to establish a connection with the StackBlitz VM"),m.forEach((c,l)=>{c.id===this.id&&m.splice(l,1)});return}a++,s()},500)}),m.push(this)}},V=e=>{var n;let t=e instanceof Element?"element":"id";return(n=m.find(o=>o[t]===e))!=null?n:null};function G(e,t){let n=document.createElement("input");return n.type="hidden",n.name=e,n.value=t,n}function W(e){return e.replace(/\[/g,"%5B").replace(/\]/g,"%5D")}function N({template:e,title:t,description:n,dependencies:o,files:r,settings:s}){if(!j.includes(e)){let c=j.map(l=>`'${l}'`).join(", ");console.warn(`Unsupported project.template: must be one of ${c}`)}let i=[],a=(c,l,q="")=>{i.push(G(c,typeof l=="string"?l:q))};a("project[title]",t),typeof n=="string"&&n.length>0&&a("project[description]",n),a("project[template]",e,"javascript"),o&&(e==="node"?console.warn("Invalid project.dependencies: dependencies must be provided as a 'package.json' file when using the 'node' template."):a("project[dependencies]",JSON.stringify(o))),s&&a("project[settings]",JSON.stringify(s)),Object.entries(r).forEach(([c,l])=>{a(`project[files][${W(c)}]`,l)});let p=document.createElement("form");return p.method="POST",p.setAttribute("style","display:none!important;"),p.append(...i),p}function z(e,t){let n=N(e);return n.action=_("/run",t),n.id="sb_run",`<!doctype html>
<html>
<head><title></title></head>
<body>
  ${n.outerHTML}
  <script>document.getElementById('${n.id}').submit();<\/script>
</body>
</html>`}function J(e,t){let n=N(e);n.action=w("/run",t),n.target=T(t),document.body.appendChild(n),n.submit(),document.body.removeChild(n)}function h(e){var n;return e!=null&&e.contentWindow?((n=V(e))!=null?n:new E(e)).pending:Promise.reject("Provided element is not an iframe.")}function X(e,t){J(e,t)}function Z(e,t){let n=w(`/edit/${e}`,t),o=T(t);window.open(n,o)}function Q(e,t){let n=w(`/github/${e}`,t),o=T(t);window.open(n,o)}function Y(e,t,n){var i;let o=S(e),r=z(t,n),s=document.createElement("iframe");return v(o,s,n),(i=s.contentDocument)==null||i.write(r),h(s)}function ee(e,t,n){let o=S(e),r=document.createElement("iframe");return r.src=_(`/edit/${t}`,n),v(o,r,n),h(r)}function te(e,t,n){let o=S(e),r=document.createElement("iframe");return r.src=_(`/github/${t}`,n),v(o,r,n),h(r)}var L={connect:h,embedGithubProject:te,embedProject:Y,embedProjectId:ee,openGithubProject:Q,openProject:X,openProjectId:Z};var C="https://cdn.jsdelivr.net/npm/bootstrap@5.3.4/dist/css/bootstrap.min.css",M="5.3";var O="https://cdn.jsdelivr.net/npm/bootstrap@5.3.4/dist/js/bootstrap.bundle.min.js",D=`(() => {
  // ns-hugo:/home/xmr/repos/bootstrap/site/assets/js/partials/snippets.js
  var snippets_default = () => {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((tooltip) => {
      new bootstrap.Tooltip(tooltip);
    });
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach((popover) => {
      new bootstrap.Popover(popover);
    });
    const toastPlacement = document.getElementById("toastPlacement");
    if (toastPlacement) {
      document.getElementById("selectToastPlacement").addEventListener("change", function() {
        if (!toastPlacement.dataset.originalClass) {
          toastPlacement.dataset.originalClass = toastPlacement.className;
        }
        toastPlacement.className = \`\${toastPlacement.dataset.originalClass} \${this.value}\`;
      });
    }
    document.querySelectorAll(".bd-example .toast").forEach((toastNode) => {
      const toast = new bootstrap.Toast(toastNode, {
        autohide: false
      });
      toast.show();
    });
    const toastTrigger = document.getElementById("liveToastBtn");
    const toastLiveExample = document.getElementById("liveToast");
    if (toastTrigger) {
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
      toastTrigger.addEventListener("click", () => {
        toastBootstrap.show();
      });
    }
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    const appendAlert = (message, type) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = [
        \`<div class="alert alert-\${type} alert-dismissible" role="alert">\`,
        \`   <div>\${message}</div>\`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>"
      ].join("");
      alertPlaceholder.append(wrapper);
    };
    const alertTrigger = document.getElementById("liveAlertBtn");
    if (alertTrigger) {
      alertTrigger.addEventListener("click", () => {
        appendAlert("Nice, you triggered this alert message!", "success");
      });
    }
    document.querySelectorAll('.carousel:not([data-bs-ride="carousel"])').forEach((carousel) => {
      bootstrap.Carousel.getOrCreateInstance(carousel);
    });
    document.querySelectorAll('.bd-example-indeterminate [type="checkbox"]').forEach((checkbox) => {
      if (checkbox.id.includes("Indeterminate")) {
        checkbox.indeterminate = true;
      }
    });
    document.querySelectorAll('.bd-content [href="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
      });
    });
    const exampleModal = document.getElementById("exampleModal");
    if (exampleModal) {
      exampleModal.addEventListener("show.bs.modal", (event) => {
        const button = event.relatedTarget;
        const recipient = button.getAttribute("data-bs-whatever");
        const modalTitle = exampleModal.querySelector(".modal-title");
        const modalBodyInput = exampleModal.querySelector(".modal-body input");
        modalTitle.textContent = \`New message to \${recipient}\`;
        modalBodyInput.value = recipient;
      });
    }
    const myOffcanvas = document.querySelectorAll(".bd-example-offcanvas .offcanvas");
    if (myOffcanvas) {
      myOffcanvas.forEach((offcanvas) => {
        offcanvas.addEventListener("show.bs.offcanvas", (event) => {
          event.preventDefault();
        }, false);
      });
    }
  };

  // <stdin>
  snippets_default();
})();
`;document.querySelectorAll(".btn-edit").forEach(e=>{e.addEventListener("click",t=>{let n=t.target.closest(".bd-code-snippet"),o=n.querySelector(".bd-example"),r=o.innerHTML,s=n.querySelector(".btn-edit").getAttribute("data-sb-js-snippet"),i=Array.from(o.classList).join(" ");ne(r,s,i)})});var ne=(e,t,n)=>{let r={files:{"index.html":`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="${C}" rel="stylesheet">
    <link href="https://getbootstrap.com/docs/${M}/assets/css/docs.css" rel="stylesheet">
    <title>Bootstrap Example</title>
    <script defer src="${O}"><\/script>
  </head>
  <body class="p-3 m-0 border-0 ${n}">
    <!-- Example Code Start-->
${e.trimStart().replace(/^/gm,"    ").replace(/^ {4}$/gm,"").trimEnd()}
    <!-- Example Code End -->
  </body>
</html>
`,...t&&{"index.js":D}},title:"Bootstrap Example",description:`Official example from ${window.location.href}`,template:t?"javascript":"html",tags:["bootstrap"]};L.openProject(r,{openFile:"index.html"})};})();
/*!
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */
