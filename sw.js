self.importScripts('/assets/js/vendor/workbox-sw.prod.v2.1.2.js')

const workboxSW = new self.WorkboxSW()
workboxSW.precache([
  {
    "url": "assets/brand/bootstrap-outline.svg",
    "revision": "9537646a9202cb5dca44e9034c1b414b"
  },
  {
    "url": "assets/brand/bootstrap-punchout.svg",
    "revision": "372e344ac243c4fa7c6c8b8a2af0e5ff"
  },
  {
    "url": "assets/brand/bootstrap-social-logo.png",
    "revision": "1e9e93d863b7811934889f9aac89c7de"
  },
  {
    "url": "assets/brand/bootstrap-social.png",
    "revision": "56be615bbca4502de5d55d721dae917f"
  },
  {
    "url": "assets/brand/bootstrap-solid.svg",
    "revision": "ea931a5b98a97e8b8658d9f6d537329e"
  },
  {
    "url": "assets/css/docs.min.css",
    "revision": "6a7d02ead77d78f17c05fc147a53942f"
  },
  {
    "url": "assets/img/bootstrap-stack.png",
    "revision": "7384412324c769e447d3c4f86e9ff068"
  },
  {
    "url": "assets/img/bootstrap-themes.png",
    "revision": "3976b58ff407451e8e8b598fdcde2cd2"
  },
  {
    "url": "assets/img/favicons/android-chrome-192x192.png",
    "revision": "643718426d0a7d60036217ba988155be"
  },
  {
    "url": "assets/img/favicons/android-chrome-512x512.png",
    "revision": "eb512e79165f504fd4da4d2758d5584b"
  },
  {
    "url": "assets/img/favicons/apple-touch-icon.png",
    "revision": "042a7e9fdd293212aca19150aef71b0d"
  },
  {
    "url": "assets/img/favicons/favicon-16x16.png",
    "revision": "50c62448d4014e5fb411887c05c2935b"
  },
  {
    "url": "assets/img/favicons/favicon-32x32.png",
    "revision": "fed84e16b6ccfe88ee7ffaae5dfefd34"
  },
  {
    "url": "assets/img/favicons/manifest.json",
    "revision": "eed73af41f4e55d335b5b3fa8c78538d"
  },
  {
    "url": "assets/img/favicons/mstile-144x144.png",
    "revision": "84892991321e7998ca4c80ae21175f78"
  },
  {
    "url": "assets/img/favicons/mstile-150x150.png",
    "revision": "61821c45a353e259bb83f9b0d338f5e8"
  },
  {
    "url": "assets/img/favicons/mstile-310x150.png",
    "revision": "913e1b81006831c72a7bca38e4125edb"
  },
  {
    "url": "assets/img/favicons/mstile-310x310.png",
    "revision": "29d79a7e648876504496211f003c4076"
  },
  {
    "url": "assets/img/favicons/mstile-70x70.png",
    "revision": "386d71707992eb91fc53df303e99c2e7"
  },
  {
    "url": "assets/img/favicons/safari-pinned-tab.svg",
    "revision": "6b6b78894033fd91ce75affb548d8e67"
  },
  {
    "url": "assets/js/docs.min.js",
    "revision": "b9509f415a899970396c5cf61dc0e6a0"
  },
  {
    "url": "assets/js/src/application.js",
    "revision": "4c2767f364febfaf08e0bd9fb6f1cd94"
  },
  {
    "url": "assets/js/src/ie-emulation-modes-warning.js",
    "revision": "cd93c9a569232ea30bb22244eebff1e0"
  },
  {
    "url": "assets/js/src/pwa.js",
    "revision": "e707568440725d56f34b93b0bb2350a4"
  },
  {
    "url": "assets/js/vendor/anchor.min.js",
    "revision": "01e6254e9f69c0c00f05060b0e1990fc"
  },
  {
    "url": "assets/js/vendor/clipboard.min.js",
    "revision": "3e5e0fa949e0e7c5ed5fed7b4cc0ee00"
  },
  {
    "url": "assets/js/vendor/holder.min.js",
    "revision": "6266d87979b32f717d298f7adf36984a"
  },
  {
    "url": "assets/js/vendor/jquery-slim.min.js",
    "revision": "5f48fc77cac90c4778fa24ec9c57f37d"
  },
  {
    "url": "assets/js/vendor/popper.min.js",
    "revision": "70d3fda195602fe8b75e0097eed74dde"
  },
  {
    "url": "assets/js/vendor/workbox-sw.prod.v2.1.2.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "dist/css/bootstrap-grid.css",
    "revision": "cf9ab2f35e8eae4a8584ecb6201227db"
  },
  {
    "url": "dist/css/bootstrap-grid.min.css",
    "revision": "cd5676f741d5a32508a77bd021d644fc"
  },
  {
    "url": "dist/css/bootstrap-reboot.css",
    "revision": "2668ea2089a0a7c796e478c5f2244a9c"
  },
  {
    "url": "dist/css/bootstrap-reboot.min.css",
    "revision": "8fe07934aa345305ccd0c9511a962868"
  },
  {
    "url": "dist/css/bootstrap.css",
    "revision": "bb8c9968a47995d3966b97189e6514ce"
  },
  {
    "url": "dist/css/bootstrap.min.css",
    "revision": "4616756c400b3383840fd35a80954a0f"
  },
  {
    "url": "dist/js/bootstrap.bundle.js",
    "revision": "76995e0105921cac80bc809a785ddb41"
  },
  {
    "url": "dist/js/bootstrap.bundle.min.js",
    "revision": "5ced280ac27a6fcf8725fbf399293298"
  },
  {
    "url": "dist/js/bootstrap.js",
    "revision": "ffbac364dfe4035929782fc265fa353a"
  },
  {
    "url": "dist/js/bootstrap.min.js",
    "revision": "84e6e85d19e14564e7b84081d5a71b90"
  },
  {
    "url": "docs/4.0/about/brand/index.html",
    "revision": "fd1b32765daf1a77bc04744c537819e9"
  },
  {
    "url": "docs/4.0/about/index.html",
    "revision": "d493cb2f6baf15f5604c932d50d9e9f7"
  },
  {
    "url": "docs/4.0/about/license/index.html",
    "revision": "22e00aafcf549ba2c13622fc91ef2542"
  },
  {
    "url": "docs/4.0/about/overview/index.html",
    "revision": "428bb92e3f28fe9c9e337d87e51ca9e4"
  },
  {
    "url": "docs/4.0/about/translations/index.html",
    "revision": "2fcf418b8a19eceeea187028ef969b64"
  },
  {
    "url": "docs/4.0/browser-bugs/index.html",
    "revision": "2258910a73628d85d851497dc725bcfb"
  },
  {
    "url": "docs/4.0/components/alerts/index.html",
    "revision": "e0d33767c19e806e9fc16e71728369b7"
  },
  {
    "url": "docs/4.0/components/badge/index.html",
    "revision": "7bc0abbdc2d72033db5189c36dd59518"
  },
  {
    "url": "docs/4.0/components/breadcrumb/index.html",
    "revision": "24cd35be8b87e4e1940eb57af74cfa1c"
  },
  {
    "url": "docs/4.0/components/button-group/index.html",
    "revision": "182f3465bf2fd433a6cd3ec630faadd9"
  },
  {
    "url": "docs/4.0/components/buttons/index.html",
    "revision": "342b86cfdd572af620d6e8c91ac654ea"
  },
  {
    "url": "docs/4.0/components/card/index.html",
    "revision": "4389b87b4207d3e5da8c5854e6a7c2f9"
  },
  {
    "url": "docs/4.0/components/carousel/index.html",
    "revision": "355204429574e4b80f86d31c522b7d2e"
  },
  {
    "url": "docs/4.0/components/collapse/index.html",
    "revision": "2f6cc62bce6ecbd17757180a154266e3"
  },
  {
    "url": "docs/4.0/components/dropdowns/index.html",
    "revision": "1509b73998bcd46cd13753fc6527b1d9"
  },
  {
    "url": "docs/4.0/components/forms/index.html",
    "revision": "baa260b9b4db3bed815c88c001519ea1"
  },
  {
    "url": "docs/4.0/components/index.html",
    "revision": "c022805d0d32f17de3e01ba1b5c7dd5f"
  },
  {
    "url": "docs/4.0/components/input-group/index.html",
    "revision": "f8b0c046f60206b69a33869ec8665a80"
  },
  {
    "url": "docs/4.0/components/jumbotron/index.html",
    "revision": "cebdb2fb1de8c1d562da8f4c583c03c5"
  },
  {
    "url": "docs/4.0/components/list-group/index.html",
    "revision": "8ebeaec9efe69dbc18b755f1ffed89a7"
  },
  {
    "url": "docs/4.0/components/modal/index.html",
    "revision": "7f0051d34e3248f7d7457e2b64d6d742"
  },
  {
    "url": "docs/4.0/components/navbar/index.html",
    "revision": "cebbe20f5e7449766247eb8b855aa817"
  },
  {
    "url": "docs/4.0/components/navs/index.html",
    "revision": "3a2a7cb92b98e93185366202d30b6459"
  },
  {
    "url": "docs/4.0/components/pagination/index.html",
    "revision": "774708df3924f0686cfd1fc097733217"
  },
  {
    "url": "docs/4.0/components/popovers/index.html",
    "revision": "aeeabf065bd53279b6ec1373d80a1014"
  },
  {
    "url": "docs/4.0/components/progress/index.html",
    "revision": "a511068a059cfffa163de02a9db65bcd"
  },
  {
    "url": "docs/4.0/components/scrollspy/index.html",
    "revision": "b267c13d0f8adb585e4863ada784370b"
  },
  {
    "url": "docs/4.0/components/tooltips/index.html",
    "revision": "8ad50961c05fee80c89a6f653a3fa42c"
  },
  {
    "url": "docs/4.0/content/code/index.html",
    "revision": "7ad5ea4d230debd90d8c157089517de3"
  },
  {
    "url": "docs/4.0/content/figures/index.html",
    "revision": "c63eb12426ab7d2dd08a464870db2ccc"
  },
  {
    "url": "docs/4.0/content/images/index.html",
    "revision": "fa2960d188b4fe38f051fecb2bb7c595"
  },
  {
    "url": "docs/4.0/content/index.html",
    "revision": "bfc137709ba1d4504eef0ea4720cd0c1"
  },
  {
    "url": "docs/4.0/content/reboot/index.html",
    "revision": "ad3b255ac884d938ecf4f5c50dcbd944"
  },
  {
    "url": "docs/4.0/content/tables/index.html",
    "revision": "ff98d78b9311e2646a139ed5f570bab2"
  },
  {
    "url": "docs/4.0/content/typography/index.html",
    "revision": "a932c6a38100cd7acc83227e6d257079"
  },
  {
    "url": "docs/4.0/examples/album/album.css",
    "revision": "c55364aec72e931ec6e447fef8d7d1fb"
  },
  {
    "url": "docs/4.0/examples/album/index.html",
    "revision": "b6cf65de0e6e62e7cc86cc34fa64bdc4"
  },
  {
    "url": "docs/4.0/examples/blog/blog.css",
    "revision": "750f2ac42509b1d901295d087cac5ef6"
  },
  {
    "url": "docs/4.0/examples/blog/index.html",
    "revision": "a30e42252fbca562ea09080f5ac6da54"
  },
  {
    "url": "docs/4.0/examples/carousel/carousel.css",
    "revision": "e1ef0ffa84cc98db13f90dd02b9981e7"
  },
  {
    "url": "docs/4.0/examples/carousel/index.html",
    "revision": "14ed354965a5aef8409d40f9bc71d3a4"
  },
  {
    "url": "docs/4.0/examples/cover/cover.css",
    "revision": "1d0127b6309e72780dd3e87093a9d7e3"
  },
  {
    "url": "docs/4.0/examples/cover/index.html",
    "revision": "60ab17e2c5af81defdf5a93e1865a89c"
  },
  {
    "url": "docs/4.0/examples/dashboard/dashboard.css",
    "revision": "cea2ce48e209721ca537d8ffcad510b9"
  },
  {
    "url": "docs/4.0/examples/dashboard/index.html",
    "revision": "23f3d648bd4641aaabc51676ed84ca6f"
  },
  {
    "url": "docs/4.0/examples/grid/grid.css",
    "revision": "4cd2e5cc5e19dc692d50ed6f077154ef"
  },
  {
    "url": "docs/4.0/examples/grid/index.html",
    "revision": "1a634e4a3281204f8d46c5fdaea35a96"
  },
  {
    "url": "docs/4.0/examples/index.html",
    "revision": "a60c7175f1a007c6030c50c9a8fffef0"
  },
  {
    "url": "docs/4.0/examples/jumbotron/index.html",
    "revision": "041900abf4b6c5525641775885200d5a"
  },
  {
    "url": "docs/4.0/examples/jumbotron/jumbotron.css",
    "revision": "0ef7edc6babea5a47645bda0c45368aa"
  },
  {
    "url": "docs/4.0/examples/justified-nav/index.html",
    "revision": "1709885cd4375a48ab7104c9c1bc752d"
  },
  {
    "url": "docs/4.0/examples/justified-nav/justified-nav.css",
    "revision": "74b0be6ad3b421b43288545b9628253f"
  },
  {
    "url": "docs/4.0/examples/narrow-jumbotron/index.html",
    "revision": "526182d9c63d8d3befa2380347f4cb6e"
  },
  {
    "url": "docs/4.0/examples/narrow-jumbotron/narrow-jumbotron.css",
    "revision": "4e5fb23757fb40f595167cd4e14447de"
  },
  {
    "url": "docs/4.0/examples/navbar-bottom/index.html",
    "revision": "35d8cd3a5a267e316ab45f480a191eeb"
  },
  {
    "url": "docs/4.0/examples/navbar-top-fixed/index.html",
    "revision": "1ce40c76fb831fb9bfb81f7a04705555"
  },
  {
    "url": "docs/4.0/examples/navbar-top-fixed/navbar-top-fixed.css",
    "revision": "3d46ddff119cfe2886a34b72aefd42a6"
  },
  {
    "url": "docs/4.0/examples/navbar-top/index.html",
    "revision": "86ce704638e9227d79683e9928ad258a"
  },
  {
    "url": "docs/4.0/examples/navbar-top/navbar-top.css",
    "revision": "ae704085e05c4bc6a705b225b03a5aea"
  },
  {
    "url": "docs/4.0/examples/navbars/index.html",
    "revision": "cb279d345c72f6f4fab4a17df396696e"
  },
  {
    "url": "docs/4.0/examples/navbars/navbar.css",
    "revision": "f95ea8bb033949bba31b05925773e223"
  },
  {
    "url": "docs/4.0/examples/offcanvas/index.html",
    "revision": "6263d8ff8ab234d8b1e6d29216021af8"
  },
  {
    "url": "docs/4.0/examples/offcanvas/offcanvas.css",
    "revision": "77eca95a4f55dd917ba95db9ac28bac9"
  },
  {
    "url": "docs/4.0/examples/offcanvas/offcanvas.js",
    "revision": "fe67880b053d4a4a9f318db8e0e71fb2"
  },
  {
    "url": "docs/4.0/examples/screenshots/album.png",
    "revision": "ffaf0fd56864daafaa2ea23a3f2a8a4c"
  },
  {
    "url": "docs/4.0/examples/screenshots/blog.png",
    "revision": "db2571d976d8b910af2dd7fee0a97794"
  },
  {
    "url": "docs/4.0/examples/screenshots/carousel.png",
    "revision": "3ef960de8ed9de239dbebf855d3e693e"
  },
  {
    "url": "docs/4.0/examples/screenshots/cover.png",
    "revision": "f8234debe0727d830d378804fa6920ba"
  },
  {
    "url": "docs/4.0/examples/screenshots/dashboard.png",
    "revision": "564c98a3e0fb945b7cfa4941a9bfc072"
  },
  {
    "url": "docs/4.0/examples/screenshots/grid.png",
    "revision": "a3501bda7dcdde8a731e60988375ff71"
  },
  {
    "url": "docs/4.0/examples/screenshots/jumbotron-narrow.png",
    "revision": "da2fea942e2b79e889461234b2dce637"
  },
  {
    "url": "docs/4.0/examples/screenshots/jumbotron.png",
    "revision": "56e944951506af4971317a0e1d6a6b53"
  },
  {
    "url": "docs/4.0/examples/screenshots/justified-nav.png",
    "revision": "4f24d1d5953e79423cbe0254adf1ab5e"
  },
  {
    "url": "docs/4.0/examples/screenshots/navbar-bottom.png",
    "revision": "88f890990c2f75a00cec172d401aef10"
  },
  {
    "url": "docs/4.0/examples/screenshots/navbar-fixed.png",
    "revision": "c3af88c33126f669f2006f9e2c629fa2"
  },
  {
    "url": "docs/4.0/examples/screenshots/navbar-static.png",
    "revision": "a289e262bb99e84a494fad461082e8f3"
  },
  {
    "url": "docs/4.0/examples/screenshots/navbar.png",
    "revision": "c93f7634deb8db461efd121fae384de7"
  },
  {
    "url": "docs/4.0/examples/screenshots/offcanvas.png",
    "revision": "983be61f621aac2d19131df71a8ae309"
  },
  {
    "url": "docs/4.0/examples/screenshots/sign-in.png",
    "revision": "11f97fb403f227e059e00c4afa6a12fd"
  },
  {
    "url": "docs/4.0/examples/screenshots/starter-template.png",
    "revision": "a12386401c848ad90d4e3627858e973d"
  },
  {
    "url": "docs/4.0/examples/screenshots/sticky-footer-navbar.png",
    "revision": "3047deed467cfc70d9ab33b1ac75cda6"
  },
  {
    "url": "docs/4.0/examples/screenshots/sticky-footer.png",
    "revision": "525e473da6359f1db1c5c1769190c438"
  },
  {
    "url": "docs/4.0/examples/signin/index.html",
    "revision": "b4194ddd0649c17ca4cd965b044b84ca"
  },
  {
    "url": "docs/4.0/examples/signin/signin.css",
    "revision": "04ce7b8379c81529b418edbdb4e677aa"
  },
  {
    "url": "docs/4.0/examples/starter-template/index.html",
    "revision": "c7e901f8203094969c3e25ff764531ca"
  },
  {
    "url": "docs/4.0/examples/starter-template/starter-template.css",
    "revision": "8cb4aab3660723b641b6458f1a1d3ab1"
  },
  {
    "url": "docs/4.0/examples/sticky-footer-navbar/index.html",
    "revision": "61f4c1014db3fd049b854a8127bddc0c"
  },
  {
    "url": "docs/4.0/examples/sticky-footer-navbar/sticky-footer-navbar.css",
    "revision": "c5c610f36d8c2a89e7d587880ee0cd68"
  },
  {
    "url": "docs/4.0/examples/sticky-footer/index.html",
    "revision": "0cd4be44abfd7e0a43438dc5f072d1e4"
  },
  {
    "url": "docs/4.0/examples/sticky-footer/sticky-footer.css",
    "revision": "09630d01995ef9c0f8fc9ae622f00466"
  },
  {
    "url": "docs/4.0/examples/tooltip-viewport/index.html",
    "revision": "9a79ac79c088c8913be8f1b73cad5352"
  },
  {
    "url": "docs/4.0/examples/tooltip-viewport/tooltip-viewport.css",
    "revision": "59ee4352f399bfe798346b4be4a5f88f"
  },
  {
    "url": "docs/4.0/examples/tooltip-viewport/tooltip-viewport.js",
    "revision": "8b7dceb6d175f264b789114201387bfa"
  },
  {
    "url": "docs/4.0/extend/approach/index.html",
    "revision": "956a9c1935d8af2ee4ed3283c3ed3359"
  },
  {
    "url": "docs/4.0/extend/icons/index.html",
    "revision": "6fb3ed4a6ef49f19ae45f20acf631eec"
  },
  {
    "url": "docs/4.0/extend/index.html",
    "revision": "8cedc11f07214f4501d677ba179fc205"
  },
  {
    "url": "docs/4.0/getting-started/accessibility/index.html",
    "revision": "15e4baeed749f0324e30432909291b25"
  },
  {
    "url": "docs/4.0/getting-started/best-practices/index.html",
    "revision": "453d4d769aacb12e0396f6287889d9d4"
  },
  {
    "url": "docs/4.0/getting-started/browsers-devices/index.html",
    "revision": "90be0cef03647df3f9673966c8a7c628"
  },
  {
    "url": "docs/4.0/getting-started/build-tools/index.html",
    "revision": "79f9460a5ce11b0b6d3b02990875b5da"
  },
  {
    "url": "docs/4.0/getting-started/contents/index.html",
    "revision": "ba76c7db2ca555f2f7ad090b80275c77"
  },
  {
    "url": "docs/4.0/getting-started/download/index.html",
    "revision": "e7d576930093eb7e7e8be8f3a28c224f"
  },
  {
    "url": "docs/4.0/getting-started/index.html",
    "revision": "ed3edf92523344e40222895405408370"
  },
  {
    "url": "docs/4.0/getting-started/introduction/index.html",
    "revision": "d1492a8b7c7b37b297022fa3b8c9c655"
  },
  {
    "url": "docs/4.0/getting-started/javascript/index.html",
    "revision": "78e8d4d7b5e7faf6804f1f811a41162c"
  },
  {
    "url": "docs/4.0/getting-started/options/index.html",
    "revision": "868d9318609f2b504c947f4274c6335f"
  },
  {
    "url": "docs/4.0/getting-started/theming/index.html",
    "revision": "ed0952e1faba7cad19405ead088c98e3"
  },
  {
    "url": "docs/4.0/getting-started/webpack/index.html",
    "revision": "f29bde3540b068afe2ddc4ee75a67fb9"
  },
  {
    "url": "docs/4.0/history/index.html",
    "revision": "d493cb2f6baf15f5604c932d50d9e9f7"
  },
  {
    "url": "docs/4.0/index.html",
    "revision": "ed3edf92523344e40222895405408370"
  },
  {
    "url": "docs/4.0/layout/grid/index.html",
    "revision": "0aa89452f8703af6e0e4dfa999942064"
  },
  {
    "url": "docs/4.0/layout/index.html",
    "revision": "f7315e61a9083e37f8c6f196235eaafb"
  },
  {
    "url": "docs/4.0/layout/media-object/index.html",
    "revision": "b353d1cc3811333ded68c7fb1a05517f"
  },
  {
    "url": "docs/4.0/layout/overview/index.html",
    "revision": "c4394becb726ecd46d337e1ec1b9de5e"
  },
  {
    "url": "docs/4.0/layout/utilities-for-layout/index.html",
    "revision": "570cc7678de43feafa4dde3e53ae09be"
  },
  {
    "url": "docs/4.0/migration/index.html",
    "revision": "26c32a11fe6f9bcdeae477d30216e4a2"
  },
  {
    "url": "docs/4.0/team/index.html",
    "revision": "d493cb2f6baf15f5604c932d50d9e9f7"
  },
  {
    "url": "docs/4.0/utilities/borders/index.html",
    "revision": "49f35c4691840cbefba8d870bd2529cd"
  },
  {
    "url": "docs/4.0/utilities/clearfix/index.html",
    "revision": "b4570c06c679f75b80ff8d715bdfe431"
  },
  {
    "url": "docs/4.0/utilities/close-icon/index.html",
    "revision": "8ef070159d1bab773416a46df20c672f"
  },
  {
    "url": "docs/4.0/utilities/colors/index.html",
    "revision": "11005fc9ec7d95dd896db00ffa50a94d"
  },
  {
    "url": "docs/4.0/utilities/display/index.html",
    "revision": "381b0650139f1ab5a4a1c3d60885df61"
  },
  {
    "url": "docs/4.0/utilities/embed/index.html",
    "revision": "8a1725986cd49ac586eccf0c16825081"
  },
  {
    "url": "docs/4.0/utilities/flex/index.html",
    "revision": "4049db65d4d10f8216af2b8db2d5e675"
  },
  {
    "url": "docs/4.0/utilities/float/index.html",
    "revision": "9914b4727f685c5174f78f6f726ddc4a"
  },
  {
    "url": "docs/4.0/utilities/image-replacement/index.html",
    "revision": "558e7e99ea72443f31154831e2c59ca5"
  },
  {
    "url": "docs/4.0/utilities/index.html",
    "revision": "54a7143f1b28e09db67110dbb09d05b7"
  },
  {
    "url": "docs/4.0/utilities/position/index.html",
    "revision": "f24ef6b6de84550ba942ecff479f29f0"
  },
  {
    "url": "docs/4.0/utilities/screenreaders/index.html",
    "revision": "a87e1edf52126ed4b8b1694f740638b9"
  },
  {
    "url": "docs/4.0/utilities/sizing/index.html",
    "revision": "6c1cc85694ce9cd18fa4e1f9e1e56f72"
  },
  {
    "url": "docs/4.0/utilities/spacing/index.html",
    "revision": "0cda444dd420d096dc40d53b87cf797e"
  },
  {
    "url": "docs/4.0/utilities/text/index.html",
    "revision": "c50b7da875e4c7d2fe9756cf3a40324e"
  },
  {
    "url": "docs/4.0/utilities/vertical-align/index.html",
    "revision": "bcc9c6a738d490d197e44f195e716d18"
  },
  {
    "url": "docs/4.0/utilities/visibility/index.html",
    "revision": "30a766dbad8e5aff1b18aad921ababf8"
  },
  {
    "url": "docs/getting-started/index.html",
    "revision": "ed3edf92523344e40222895405408370"
  },
  {
    "url": "docs/index.html",
    "revision": "ed3edf92523344e40222895405408370"
  },
  {
    "url": "examples/index.html",
    "revision": "f6927845f2342f59dcff0db850f3e320"
  },
  {
    "url": "index.html",
    "revision": "4a8df80b00b533aaf488484c11d88829"
  },
  {
    "url": "redirects.json",
    "revision": "199aa5803d5d20e493a67bc7af25da14"
  },
  {
    "url": "sw.js",
    "revision": "42f72988cbd613ae00b4a2c3390712ae"
  }
])
