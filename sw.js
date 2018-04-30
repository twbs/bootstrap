/* global workbox:false */

self.importScripts('/assets/js/vendor/workbox-sw.js')

workbox.precaching.precacheAndRoute([
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
    "revision": "6e3cd62366e30b36d229cb7eb5c064ed"
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
    "revision": "9109c979ae60b0c5584b59ca6945d630"
  },
  {
    "url": "assets/js/src/application.js",
    "revision": "83edc01382cfd889f982162964ec374e"
  },
  {
    "url": "assets/js/src/ie-emulation-modes-warning.js",
    "revision": "c6e7032adf9bd98ac39e83c83108977b"
  },
  {
    "url": "assets/js/src/pwa.js",
    "revision": "cac6034355863d6205e66862f6a729f7"
  },
  {
    "url": "assets/js/src/search.js",
    "revision": "5b8bb2081b9e10ee9a469dd5feca5996"
  },
  {
    "url": "assets/js/vendor/anchor.min.js",
    "revision": "01e6254e9f69c0c00f05060b0e1990fc"
  },
  {
    "url": "assets/js/vendor/clipboard.min.js",
    "revision": "3f3688138a1b9fc4ef669ce9056b6674"
  },
  {
    "url": "assets/js/vendor/holder.min.js",
    "revision": "6266d87979b32f717d298f7adf36984a"
  },
  {
    "url": "assets/js/vendor/jquery-slim.min.js",
    "revision": "99b0a83cf1b0b1e2cb16041520e87641"
  },
  {
    "url": "assets/js/vendor/popper.min.js",
    "revision": "83fb8c4d9199dce0224da0206423106f"
  },
  {
    "url": "assets/js/vendor/workbox-sw.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "dist/css/bootstrap-grid.css",
    "revision": "db438cff680b6d0c029f75647b4b138a"
  },
  {
    "url": "dist/css/bootstrap-grid.min.css",
    "revision": "2206c9fb0197956129137af662b31115"
  },
  {
    "url": "dist/css/bootstrap-reboot.css",
    "revision": "cceed351e3a8401f573988a38e78d3a8"
  },
  {
    "url": "dist/css/bootstrap-reboot.min.css",
    "revision": "e2b23d34f3fcc9ce074c942e76f25d61"
  },
  {
    "url": "dist/css/bootstrap.css",
    "revision": "82252d754417f95f7779be349acc6361"
  },
  {
    "url": "dist/css/bootstrap.min.css",
    "revision": "a7022c6fa83d91db67738d6e3cd3252d"
  },
  {
    "url": "dist/js/bootstrap.bundle.js",
    "revision": "ee08eb7f44335a3cf385e03d4406e4a5"
  },
  {
    "url": "dist/js/bootstrap.bundle.min.js",
    "revision": "d70c474886678aebe3e9d91965dc8b62"
  },
  {
    "url": "dist/js/bootstrap.js",
    "revision": "c2cdb900858c3e63ce8cd9f69171d342"
  },
  {
    "url": "dist/js/bootstrap.min.js",
    "revision": "eb5fac582a82f296aeb74900b01a2fa3"
  },
  {
    "url": "docs/4.1/about/brand/index.html",
    "revision": "da363abe2d31dead6009e6cabcf218e4"
  },
  {
    "url": "docs/4.1/about/index.html",
    "revision": "21cd478d32480c820a6fe31906eef06d"
  },
  {
    "url": "docs/4.1/about/license/index.html",
    "revision": "7458f731361d69e085d3631dfb20e4d9"
  },
  {
    "url": "docs/4.1/about/overview/index.html",
    "revision": "ab77afaded6442e3d503f5a399698c59"
  },
  {
    "url": "docs/4.1/about/translations/index.html",
    "revision": "070ffefa3c965013a256990075918b7d"
  },
  {
    "url": "docs/4.1/browser-bugs/index.html",
    "revision": "ca363eeebf408a0af71bc30a4fdce92f"
  },
  {
    "url": "docs/4.1/components/alerts/index.html",
    "revision": "9ce6462d80d3f56b7eed0fdd70b8ed30"
  },
  {
    "url": "docs/4.1/components/badge/index.html",
    "revision": "688237378dd152cf6dc8e251b589d25a"
  },
  {
    "url": "docs/4.1/components/breadcrumb/index.html",
    "revision": "b9c06645080496c7ceefde94e8f40efa"
  },
  {
    "url": "docs/4.1/components/button-group/index.html",
    "revision": "af1cb50d7abe6eefa019a67f7d66f2b0"
  },
  {
    "url": "docs/4.1/components/buttons/index.html",
    "revision": "5cb2e19a4e918877ba94529217df85fb"
  },
  {
    "url": "docs/4.1/components/card/index.html",
    "revision": "5c6317dc55e16caeb3acca80d10dc41b"
  },
  {
    "url": "docs/4.1/components/carousel/index.html",
    "revision": "272b1ccd06d335733568cda0957a56e5"
  },
  {
    "url": "docs/4.1/components/collapse/index.html",
    "revision": "1a2ce5595bda4343efbd6f358627d9e9"
  },
  {
    "url": "docs/4.1/components/dropdowns/index.html",
    "revision": "fb00e06439c66bae11a39b6c90143c13"
  },
  {
    "url": "docs/4.1/components/forms/index.html",
    "revision": "2c70c60c66f6a755236b2fa2f7882ed9"
  },
  {
    "url": "docs/4.1/components/index.html",
    "revision": "7030b612d83a1091f69bf96bd7ae78f8"
  },
  {
    "url": "docs/4.1/components/input-group/index.html",
    "revision": "515b3174cac3d68cfdf75ba23ee608fc"
  },
  {
    "url": "docs/4.1/components/jumbotron/index.html",
    "revision": "02176e3d196221dbf2bbfa96883c139a"
  },
  {
    "url": "docs/4.1/components/list-group/index.html",
    "revision": "ea290fdf68db5cc08e1a99670a6186c7"
  },
  {
    "url": "docs/4.1/components/modal/index.html",
    "revision": "4345babb0b732abaab295e3c5459c931"
  },
  {
    "url": "docs/4.1/components/navbar/index.html",
    "revision": "091326032dfce11e8f56f364dec6ccd2"
  },
  {
    "url": "docs/4.1/components/navs/index.html",
    "revision": "a2deab071c38ba8d88d90b5e65838dc9"
  },
  {
    "url": "docs/4.1/components/pagination/index.html",
    "revision": "0e42703fd66a56493a99f924003dc75b"
  },
  {
    "url": "docs/4.1/components/popovers/index.html",
    "revision": "3456fc293b4d83d0924cc9f557233a2d"
  },
  {
    "url": "docs/4.1/components/progress/index.html",
    "revision": "b321bf986421fca3339e96f6b5e14840"
  },
  {
    "url": "docs/4.1/components/scrollspy/index.html",
    "revision": "382dd101252603ead6d11ec54ee42cb7"
  },
  {
    "url": "docs/4.1/components/tooltips/index.html",
    "revision": "e484891eeede824d1ff667056a73929b"
  },
  {
    "url": "docs/4.1/content/code/index.html",
    "revision": "1d8e97be5baf2b8d2c1eadb84b7d545b"
  },
  {
    "url": "docs/4.1/content/figures/index.html",
    "revision": "baa4685aafcac84e12e3feff8b59713c"
  },
  {
    "url": "docs/4.1/content/images/index.html",
    "revision": "f3ebd0e6e5f96ec46e11d68a2f65989b"
  },
  {
    "url": "docs/4.1/content/index.html",
    "revision": "95fb085074b4d33f820664987ebb086f"
  },
  {
    "url": "docs/4.1/content/reboot/index.html",
    "revision": "f11cb84f29deea8b9d582d472284e988"
  },
  {
    "url": "docs/4.1/content/tables/index.html",
    "revision": "055743791dd522df832af124072ca9f5"
  },
  {
    "url": "docs/4.1/content/typography/index.html",
    "revision": "69411358fc1b3f78dde85cf52f20b9ef"
  },
  {
    "url": "docs/4.1/examples/album/album.css",
    "revision": "e8343131a0fefafe6ae0f37db6d10f3c"
  },
  {
    "url": "docs/4.1/examples/album/index.html",
    "revision": "8088e1d95bc9263681886821a80f5bcc"
  },
  {
    "url": "docs/4.1/examples/blog/blog.css",
    "revision": "095c85e484178b56ad0446775869e628"
  },
  {
    "url": "docs/4.1/examples/blog/index.html",
    "revision": "c1d0cf090944a6369dcfeaeebbf73eff"
  },
  {
    "url": "docs/4.1/examples/carousel/carousel.css",
    "revision": "e1ef0ffa84cc98db13f90dd02b9981e7"
  },
  {
    "url": "docs/4.1/examples/carousel/index.html",
    "revision": "b60a1b9d8a622551914f1869d2070ca6"
  },
  {
    "url": "docs/4.1/examples/checkout/form-validation.css",
    "revision": "d13d35a0c04021ceacd8c153719860bc"
  },
  {
    "url": "docs/4.1/examples/checkout/index.html",
    "revision": "79021acecd4d9e2e84e26cf84153153b"
  },
  {
    "url": "docs/4.1/examples/cover/cover.css",
    "revision": "211daf4eee015cb38fb10893c4645bbb"
  },
  {
    "url": "docs/4.1/examples/cover/index.html",
    "revision": "3c6d961d4b1d583a8cf972d66d6b8171"
  },
  {
    "url": "docs/4.1/examples/dashboard/dashboard.css",
    "revision": "419f2b36ccf58f5cb1b5b557658b65dd"
  },
  {
    "url": "docs/4.1/examples/dashboard/index.html",
    "revision": "de15dff920a3aebbb324d257985e4ba8"
  },
  {
    "url": "docs/4.1/examples/floating-labels/floating-labels.css",
    "revision": "0711f793d4f6bc20572f9b357c061b5b"
  },
  {
    "url": "docs/4.1/examples/floating-labels/index.html",
    "revision": "e16e25d95c2a41f6d3d8ff7b94b82936"
  },
  {
    "url": "docs/4.1/examples/grid/grid.css",
    "revision": "4cd2e5cc5e19dc692d50ed6f077154ef"
  },
  {
    "url": "docs/4.1/examples/grid/index.html",
    "revision": "1a634e4a3281204f8d46c5fdaea35a96"
  },
  {
    "url": "docs/4.1/examples/index.html",
    "revision": "2671cd58f90fc28581031d51e44a7b4d"
  },
  {
    "url": "docs/4.1/examples/jumbotron/index.html",
    "revision": "187a48844da8e19e0765d417a5077f81"
  },
  {
    "url": "docs/4.1/examples/jumbotron/jumbotron.css",
    "revision": "0ef7edc6babea5a47645bda0c45368aa"
  },
  {
    "url": "docs/4.1/examples/navbar-bottom/index.html",
    "revision": "dd165c45857a4239ce7787aea5a7bff5"
  },
  {
    "url": "docs/4.1/examples/navbar-fixed/index.html",
    "revision": "1178a7c1f06eeeea76176173b2e0d7fd"
  },
  {
    "url": "docs/4.1/examples/navbar-fixed/navbar-top-fixed.css",
    "revision": "3d46ddff119cfe2886a34b72aefd42a6"
  },
  {
    "url": "docs/4.1/examples/navbar-static/index.html",
    "revision": "8f818f7c1ab4e90bf1ea9b0bd0adb5b3"
  },
  {
    "url": "docs/4.1/examples/navbar-static/navbar-top.css",
    "revision": "ae704085e05c4bc6a705b225b03a5aea"
  },
  {
    "url": "docs/4.1/examples/navbars/index.html",
    "revision": "84494d9562fd4bfb7a613cde029e839f"
  },
  {
    "url": "docs/4.1/examples/navbars/navbar.css",
    "revision": "f95ea8bb033949bba31b05925773e223"
  },
  {
    "url": "docs/4.1/examples/offcanvas/index.html",
    "revision": "7543497ce75575f523a11efb856b54e8"
  },
  {
    "url": "docs/4.1/examples/offcanvas/offcanvas.css",
    "revision": "b5d28d8db34c23de78c46784c4ba4331"
  },
  {
    "url": "docs/4.1/examples/offcanvas/offcanvas.js",
    "revision": "5c0edf2d5a4d88ec65e801c0f58ef23a"
  },
  {
    "url": "docs/4.1/examples/pricing/index.html",
    "revision": "418289199fbd0b6749424611483058fd"
  },
  {
    "url": "docs/4.1/examples/pricing/pricing.css",
    "revision": "1e170831b26afb7a6bcde4f0bc2cb29b"
  },
  {
    "url": "docs/4.1/examples/product/index.html",
    "revision": "7424fe35dc94c1190849c8627cc33ef0"
  },
  {
    "url": "docs/4.1/examples/product/product.css",
    "revision": "9db57bf56394ba8cd85abd5f7ebc8ef1"
  },
  {
    "url": "docs/4.1/examples/screenshots/album.png",
    "revision": "685d5277fdf6f04aefbcbe01ba93e9ef"
  },
  {
    "url": "docs/4.1/examples/screenshots/blog.png",
    "revision": "d06dc15ae8285908ec7ba9f4b1f98a44"
  },
  {
    "url": "docs/4.1/examples/screenshots/carousel.png",
    "revision": "dc04e087b8ad4f000fa64e266812fc0f"
  },
  {
    "url": "docs/4.1/examples/screenshots/checkout.png",
    "revision": "030255900e0b73653cf6a2d074f17b31"
  },
  {
    "url": "docs/4.1/examples/screenshots/cover.png",
    "revision": "ece97a4eb488c46a86a67d61db25dda2"
  },
  {
    "url": "docs/4.1/examples/screenshots/dashboard.png",
    "revision": "2fc93187d09b5b8c342b962576eaf39e"
  },
  {
    "url": "docs/4.1/examples/screenshots/floating-labels.png",
    "revision": "fae0436f9d026a67778f3a37d29b3dfc"
  },
  {
    "url": "docs/4.1/examples/screenshots/grid.png",
    "revision": "cb63b8b5fd89749a2d87342876306dd8"
  },
  {
    "url": "docs/4.1/examples/screenshots/jumbotron.png",
    "revision": "0f579cb67e8c8535d8fffef7d17b7e45"
  },
  {
    "url": "docs/4.1/examples/screenshots/navbar-bottom.png",
    "revision": "0cefd6caed82af75be57d758633d9094"
  },
  {
    "url": "docs/4.1/examples/screenshots/navbar-fixed.png",
    "revision": "1d38f157f0bbbd90957044d30eaef242"
  },
  {
    "url": "docs/4.1/examples/screenshots/navbar-static.png",
    "revision": "2ff01be7ee251fc5c7f51ccf9de5f48d"
  },
  {
    "url": "docs/4.1/examples/screenshots/navbars.png",
    "revision": "d4fbce8e1e38d78a5134e6be05cdd4d7"
  },
  {
    "url": "docs/4.1/examples/screenshots/offcanvas.png",
    "revision": "c581d49a56f3e9d0d1753195c62e719a"
  },
  {
    "url": "docs/4.1/examples/screenshots/pricing.png",
    "revision": "e33e2f37741c6d15c99f3378e2e551ea"
  },
  {
    "url": "docs/4.1/examples/screenshots/product.png",
    "revision": "af74e4f7ddfc8cf2a44a9c601881329f"
  },
  {
    "url": "docs/4.1/examples/screenshots/sign-in.png",
    "revision": "9e4bf345a8c21403868f70b777efb483"
  },
  {
    "url": "docs/4.1/examples/screenshots/starter-template.png",
    "revision": "1761d4e831e7c0659962e1abdb95421f"
  },
  {
    "url": "docs/4.1/examples/screenshots/sticky-footer-navbar.png",
    "revision": "428112965cf6826db55bcc6db07d9e5f"
  },
  {
    "url": "docs/4.1/examples/screenshots/sticky-footer.png",
    "revision": "59b69c34997abee3d477f836d44ce8a3"
  },
  {
    "url": "docs/4.1/examples/sign-in/index.html",
    "revision": "0739de40d4fb2333772503ff6a475b18"
  },
  {
    "url": "docs/4.1/examples/sign-in/signin.css",
    "revision": "00e205f17ee0cd3f59d5e1e1e9cf3b3f"
  },
  {
    "url": "docs/4.1/examples/starter-template/index.html",
    "revision": "d405e899854462588983ff1b304f7d0d"
  },
  {
    "url": "docs/4.1/examples/starter-template/starter-template.css",
    "revision": "8cb4aab3660723b641b6458f1a1d3ab1"
  },
  {
    "url": "docs/4.1/examples/sticky-footer-navbar/index.html",
    "revision": "cf52f64c92b9c1fae606d610fe2d2116"
  },
  {
    "url": "docs/4.1/examples/sticky-footer-navbar/sticky-footer-navbar.css",
    "revision": "c5c610f36d8c2a89e7d587880ee0cd68"
  },
  {
    "url": "docs/4.1/examples/sticky-footer/index.html",
    "revision": "7f8a7abbce45fa7d948f8fe3a41c3545"
  },
  {
    "url": "docs/4.1/examples/sticky-footer/sticky-footer.css",
    "revision": "09630d01995ef9c0f8fc9ae622f00466"
  },
  {
    "url": "docs/4.1/examples/tooltip-viewport/index.html",
    "revision": "b1074cded6dd5b3603fd470151af233e"
  },
  {
    "url": "docs/4.1/examples/tooltip-viewport/tooltip-viewport.css",
    "revision": "59ee4352f399bfe798346b4be4a5f88f"
  },
  {
    "url": "docs/4.1/examples/tooltip-viewport/tooltip-viewport.js",
    "revision": "8b7dceb6d175f264b789114201387bfa"
  },
  {
    "url": "docs/4.1/extend/approach/index.html",
    "revision": "2fef962857db7b670e3ffb4fb2b3a3a5"
  },
  {
    "url": "docs/4.1/extend/icons/index.html",
    "revision": "0a56f43c235108e3b8eae158177d7cdb"
  },
  {
    "url": "docs/4.1/extend/index.html",
    "revision": "b5be504b373801faafeb0b790f2fa5ed"
  },
  {
    "url": "docs/4.1/getting-started/accessibility/index.html",
    "revision": "007846f682083aaa4e65c1119928a3bf"
  },
  {
    "url": "docs/4.1/getting-started/best-practices/index.html",
    "revision": "86da449cc171aca7811ccda09ccc420e"
  },
  {
    "url": "docs/4.1/getting-started/browsers-devices/index.html",
    "revision": "e044f9a3c2013a9fd8de0c6a25d2069b"
  },
  {
    "url": "docs/4.1/getting-started/build-tools/index.html",
    "revision": "06de1ab9e73c16cec63dd279802b3a35"
  },
  {
    "url": "docs/4.1/getting-started/contents/index.html",
    "revision": "17022f2c9c3e8c4d7ac4605c4e52146c"
  },
  {
    "url": "docs/4.1/getting-started/download/index.html",
    "revision": "20d30ce7e827dd44a267aadb12aa9f64"
  },
  {
    "url": "docs/4.1/getting-started/index.html",
    "revision": "811a42680ff2cbe5a4565ba8571b2f13"
  },
  {
    "url": "docs/4.1/getting-started/introduction/index.html",
    "revision": "4e34ead69e2e1aab6a26ba44671bece2"
  },
  {
    "url": "docs/4.1/getting-started/javascript/index.html",
    "revision": "360208d6c37e1eb359cdc1851022aa84"
  },
  {
    "url": "docs/4.1/getting-started/options/index.html",
    "revision": "6f7266cc764421fcde9b6958a8e2c0e4"
  },
  {
    "url": "docs/4.1/getting-started/theming/index.html",
    "revision": "1e208003966788093ac06a30d0007b34"
  },
  {
    "url": "docs/4.1/getting-started/webpack/index.html",
    "revision": "cdd95c974c85b397ce3510fb538468f0"
  },
  {
    "url": "docs/4.1/history/index.html",
    "revision": "21cd478d32480c820a6fe31906eef06d"
  },
  {
    "url": "docs/4.1/index.html",
    "revision": "811a42680ff2cbe5a4565ba8571b2f13"
  },
  {
    "url": "docs/4.1/layout/grid/index.html",
    "revision": "a5bd9b6a1027e9d4542251062bb0baa6"
  },
  {
    "url": "docs/4.1/layout/index.html",
    "revision": "aaf8e1eed995085072062a503c910188"
  },
  {
    "url": "docs/4.1/layout/media-object/index.html",
    "revision": "c140fcacd3589e0662587504754a3197"
  },
  {
    "url": "docs/4.1/layout/overview/index.html",
    "revision": "fce3a2773e4e107a61b82e4c1f2e40f6"
  },
  {
    "url": "docs/4.1/layout/utilities-for-layout/index.html",
    "revision": "7d74b593e28970aee475a5d626f1f3e1"
  },
  {
    "url": "docs/4.1/migration/index.html",
    "revision": "d35fb579e8ec304cf8fe92bedd12aa4c"
  },
  {
    "url": "docs/4.1/team/index.html",
    "revision": "21cd478d32480c820a6fe31906eef06d"
  },
  {
    "url": "docs/4.1/utilities/borders/index.html",
    "revision": "c3adffc35fc4c15ce39a9d918c7d2b88"
  },
  {
    "url": "docs/4.1/utilities/clearfix/index.html",
    "revision": "a67d1e4018e33f94561fb320af69e04f"
  },
  {
    "url": "docs/4.1/utilities/close-icon/index.html",
    "revision": "5871021e0e92137774de05be8dd7345e"
  },
  {
    "url": "docs/4.1/utilities/colors/index.html",
    "revision": "975a8d9999d66f38d8c812e9545df715"
  },
  {
    "url": "docs/4.1/utilities/display/index.html",
    "revision": "eebe9ffe5125359b45c389914ebeca4a"
  },
  {
    "url": "docs/4.1/utilities/embed/index.html",
    "revision": "615d322fdd313950c2443640b21e692f"
  },
  {
    "url": "docs/4.1/utilities/flex/index.html",
    "revision": "56677b9a6185166b6f2807b36239e605"
  },
  {
    "url": "docs/4.1/utilities/float/index.html",
    "revision": "336a436baabf93150175506898252a4a"
  },
  {
    "url": "docs/4.1/utilities/image-replacement/index.html",
    "revision": "922ebd8f02a2f5267a29658a6fb1ce7a"
  },
  {
    "url": "docs/4.1/utilities/index.html",
    "revision": "6c11a259f899c261fc50fdb6244aa6ce"
  },
  {
    "url": "docs/4.1/utilities/position/index.html",
    "revision": "9e3af44a33b5d6ae617375c19bedb1c5"
  },
  {
    "url": "docs/4.1/utilities/screenreaders/index.html",
    "revision": "b6af234512b5cc8fe343c87133844fb3"
  },
  {
    "url": "docs/4.1/utilities/shadows/index.html",
    "revision": "a85a8cf2306f0653add17d4472893a52"
  },
  {
    "url": "docs/4.1/utilities/sizing/index.html",
    "revision": "e822f546f0b4790e60189b13139a914e"
  },
  {
    "url": "docs/4.1/utilities/spacing/index.html",
    "revision": "08f891a83b2d3694804f44ebed245b89"
  },
  {
    "url": "docs/4.1/utilities/text/index.html",
    "revision": "e7a83ca4a0cbb0745c71bbe2de0a866f"
  },
  {
    "url": "docs/4.1/utilities/vertical-align/index.html",
    "revision": "9ca821f6f013cc7c99983755a53d24f8"
  },
  {
    "url": "docs/4.1/utilities/visibility/index.html",
    "revision": "7e88317e8a53b2c3d76e9ff072eb389a"
  },
  {
    "url": "docs/getting-started/index.html",
    "revision": "811a42680ff2cbe5a4565ba8571b2f13"
  },
  {
    "url": "docs/index.html",
    "revision": "811a42680ff2cbe5a4565ba8571b2f13"
  },
  {
    "url": "examples/index.html",
    "revision": "f42d00b3e5074e91c48a7258b468a3ba"
  },
  {
    "url": "index.html",
    "revision": "9b972f782908d36757d09c1a2cf7d7c8"
  },
  {
    "url": "redirects.json",
    "revision": "ff6e3f0da9bd52ce20975be0b056d464"
  }
])
