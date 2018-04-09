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
    "revision": "0e2b232513f97520c2a637d97c399d3f"
  },
  {
    "url": "assets/js/src/application.js",
    "revision": "6d30d48fedd002dc2c2557dcabddd650"
  },
  {
    "url": "assets/js/src/ie-emulation-modes-warning.js",
    "revision": "fe80ecce8d355bac77f7bd95639ad04a"
  },
  {
    "url": "assets/js/src/pwa.js",
    "revision": "4de108c33799a18cec3362c52e333eff"
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
    "revision": "6b08ddc901000d51fa1f06a35518f302"
  },
  {
    "url": "assets/js/vendor/workbox-sw.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "dist/css/bootstrap-grid.css",
    "revision": "7c0197b7ddafd6d0dd8de0f512e1c136"
  },
  {
    "url": "dist/css/bootstrap-grid.min.css",
    "revision": "ffdcdc94dfb81e71f752d20b1bf4f264"
  },
  {
    "url": "dist/css/bootstrap-reboot.css",
    "revision": "8199d13b2c0d694956584d80ad1308c8"
  },
  {
    "url": "dist/css/bootstrap-reboot.min.css",
    "revision": "a7a4675edc5ee0e38c8a51fc22f9185e"
  },
  {
    "url": "dist/css/bootstrap.css",
    "revision": "38fdafbec65832ead969ca340d28453f"
  },
  {
    "url": "dist/css/bootstrap.min.css",
    "revision": "fee68c0f2f583161134a1fcb5950501d"
  },
  {
    "url": "dist/js/bootstrap.bundle.js",
    "revision": "ea09df7efed9959f3e2c24ee8853745e"
  },
  {
    "url": "dist/js/bootstrap.bundle.min.js",
    "revision": "62e633210885066c625c46081cc2b339"
  },
  {
    "url": "dist/js/bootstrap.js",
    "revision": "d9f096d1f708c35fdd9c78bd422883cc"
  },
  {
    "url": "dist/js/bootstrap.min.js",
    "revision": "ce6e785579ae4cb555c9de311d1b9271"
  },
  {
    "url": "docs/4.1/about/brand/index.html",
    "revision": "15caf80712d25a8f0e1151b663203e05"
  },
  {
    "url": "docs/4.1/about/index.html",
    "revision": "21cd478d32480c820a6fe31906eef06d"
  },
  {
    "url": "docs/4.1/about/license/index.html",
    "revision": "de9d56b162eefd3a6609ff68012857f9"
  },
  {
    "url": "docs/4.1/about/overview/index.html",
    "revision": "970506f69e2b850ac23c8bb2fe61b278"
  },
  {
    "url": "docs/4.1/about/translations/index.html",
    "revision": "1af7f1433a3b35f203a5b3313d3c2e37"
  },
  {
    "url": "docs/4.1/browser-bugs/index.html",
    "revision": "f2dd51e7d9fd387b697cf4697fbd8ee7"
  },
  {
    "url": "docs/4.1/components/alerts/index.html",
    "revision": "a45dc925421f49652ca95632847d40c0"
  },
  {
    "url": "docs/4.1/components/badge/index.html",
    "revision": "050a4751fc3129fc0f1ac06b6abc0b29"
  },
  {
    "url": "docs/4.1/components/breadcrumb/index.html",
    "revision": "69f1ff1c6cf91b993e66987b054ccde9"
  },
  {
    "url": "docs/4.1/components/button-group/index.html",
    "revision": "ff44b769ec5904a7013ab5b786607439"
  },
  {
    "url": "docs/4.1/components/buttons/index.html",
    "revision": "c4a811c037996a8886281b71172acb76"
  },
  {
    "url": "docs/4.1/components/card/index.html",
    "revision": "cc46067a5f993436d1b7faafcffb1855"
  },
  {
    "url": "docs/4.1/components/carousel/index.html",
    "revision": "8099f7995a7e990801a63adc27e56639"
  },
  {
    "url": "docs/4.1/components/collapse/index.html",
    "revision": "32ceafa340b50098ffbb514b46623681"
  },
  {
    "url": "docs/4.1/components/dropdowns/index.html",
    "revision": "a26eded353d18d9e295340ced32176a5"
  },
  {
    "url": "docs/4.1/components/forms/index.html",
    "revision": "f87f64e432c60489fef1d414959e9e82"
  },
  {
    "url": "docs/4.1/components/index.html",
    "revision": "7030b612d83a1091f69bf96bd7ae78f8"
  },
  {
    "url": "docs/4.1/components/input-group/index.html",
    "revision": "0556c973359ec508f64679dcc81b1e20"
  },
  {
    "url": "docs/4.1/components/jumbotron/index.html",
    "revision": "4acaf2f8dba18f28a794ba44be08ea32"
  },
  {
    "url": "docs/4.1/components/list-group/index.html",
    "revision": "1c2913067120227194f7bc4204b4edba"
  },
  {
    "url": "docs/4.1/components/modal/index.html",
    "revision": "593f780a12003bd19501f139670b3451"
  },
  {
    "url": "docs/4.1/components/navbar/index.html",
    "revision": "9c093cfbb5bb27a60d059d056f203bdd"
  },
  {
    "url": "docs/4.1/components/navs/index.html",
    "revision": "83344c2c7d928151ba85ae99b22822b9"
  },
  {
    "url": "docs/4.1/components/pagination/index.html",
    "revision": "090648f7ec13bad27f546fcf7e07ab86"
  },
  {
    "url": "docs/4.1/components/popovers/index.html",
    "revision": "ea28799a6e246b0ef0d2e6c5c38b2507"
  },
  {
    "url": "docs/4.1/components/progress/index.html",
    "revision": "cabbe0fd84ff71ae5945a84692605058"
  },
  {
    "url": "docs/4.1/components/scrollspy/index.html",
    "revision": "bada652fcac0cbe57bc5d119a4eb4ace"
  },
  {
    "url": "docs/4.1/components/tooltips/index.html",
    "revision": "1312adef8b6548a04f455d631ed77d8e"
  },
  {
    "url": "docs/4.1/content/code/index.html",
    "revision": "f604cab460c35ad5e9ca6ef6bd83bdd3"
  },
  {
    "url": "docs/4.1/content/figures/index.html",
    "revision": "3b1278f4e73f8e764c44d112d317f5cf"
  },
  {
    "url": "docs/4.1/content/images/index.html",
    "revision": "fd8c887f30b502f25693b32bf0b48e8e"
  },
  {
    "url": "docs/4.1/content/index.html",
    "revision": "95fb085074b4d33f820664987ebb086f"
  },
  {
    "url": "docs/4.1/content/reboot/index.html",
    "revision": "a3d17f3f0de9dc0870db5d92983375aa"
  },
  {
    "url": "docs/4.1/content/tables/index.html",
    "revision": "8ea3b054d2f1387bf83b3dba8235d610"
  },
  {
    "url": "docs/4.1/content/typography/index.html",
    "revision": "831f0fcbba9b696587414459273ac3ea"
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
    "revision": "1a212c9e05e0cb88e1fbc07c0f14e286"
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
    "revision": "1316a5d88abb54c3eb746450455e0508"
  },
  {
    "url": "docs/4.1/examples/navbars/navbar.css",
    "revision": "f95ea8bb033949bba31b05925773e223"
  },
  {
    "url": "docs/4.1/examples/offcanvas/index.html",
    "revision": "1a151e615aa795700f60a6ef4da86d58"
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
    "revision": "b54e5fb4fb0c6bfad8e6ff47b6434d4e"
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
    "revision": "e884d5d7e4f9e1b3e05962d0e2f6a6cd"
  },
  {
    "url": "docs/4.1/extend/icons/index.html",
    "revision": "987dbea4b93f910f36fa376852140c8c"
  },
  {
    "url": "docs/4.1/extend/index.html",
    "revision": "ad70c0f83873aeb331846dc6e296c4a2"
  },
  {
    "url": "docs/4.1/getting-started/accessibility/index.html",
    "revision": "f75db70c82445a7f64cc590f46dfeb3f"
  },
  {
    "url": "docs/4.1/getting-started/best-practices/index.html",
    "revision": "2f52b7985be0bccb3e3c53f079799295"
  },
  {
    "url": "docs/4.1/getting-started/browsers-devices/index.html",
    "revision": "4172746e3007c0d7c50ee50ef9a49629"
  },
  {
    "url": "docs/4.1/getting-started/build-tools/index.html",
    "revision": "fddbd13e18f5bdbaff107c40d77171a8"
  },
  {
    "url": "docs/4.1/getting-started/contents/index.html",
    "revision": "c753cf9ce0b4f52c587e695ca6496573"
  },
  {
    "url": "docs/4.1/getting-started/download/index.html",
    "revision": "cec291bd7678f5adec86537fcb6bd644"
  },
  {
    "url": "docs/4.1/getting-started/index.html",
    "revision": "811a42680ff2cbe5a4565ba8571b2f13"
  },
  {
    "url": "docs/4.1/getting-started/introduction/index.html",
    "revision": "8658b497704f5ede73f89679f5ea1cfa"
  },
  {
    "url": "docs/4.1/getting-started/javascript/index.html",
    "revision": "3ecea5d6b08091dca8c5aa8f0851f15d"
  },
  {
    "url": "docs/4.1/getting-started/options/index.html",
    "revision": "6f7266cc764421fcde9b6958a8e2c0e4"
  },
  {
    "url": "docs/4.1/getting-started/theming/index.html",
    "revision": "a705831fe2009bcededebc16ff30bd01"
  },
  {
    "url": "docs/4.1/getting-started/webpack/index.html",
    "revision": "2f4f0b6389c7a253b28031044c9f38e5"
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
    "revision": "d63dd99947e818f20e0977f569f36f16"
  },
  {
    "url": "docs/4.1/layout/index.html",
    "revision": "aaf8e1eed995085072062a503c910188"
  },
  {
    "url": "docs/4.1/layout/media-object/index.html",
    "revision": "27eee256f4129031ac58b19d2caa8e04"
  },
  {
    "url": "docs/4.1/layout/overview/index.html",
    "revision": "13cca57c4a69807fada80d5f769345f1"
  },
  {
    "url": "docs/4.1/layout/utilities-for-layout/index.html",
    "revision": "766c79b50f2bb0b0834c1e4518c6dc75"
  },
  {
    "url": "docs/4.1/migration/index.html",
    "revision": "278561f56da860c4be7809019351d79e"
  },
  {
    "url": "docs/4.1/team/index.html",
    "revision": "21cd478d32480c820a6fe31906eef06d"
  },
  {
    "url": "docs/4.1/utilities/borders/index.html",
    "revision": "f7051a1f87772067736bb15774cc3ef5"
  },
  {
    "url": "docs/4.1/utilities/clearfix/index.html",
    "revision": "c2e5c5de16fbb86339b724a617741bf7"
  },
  {
    "url": "docs/4.1/utilities/close-icon/index.html",
    "revision": "ebc0e12a0f4bd20506d2b313e7fefdfd"
  },
  {
    "url": "docs/4.1/utilities/colors/index.html",
    "revision": "4d968a5c6a48637dca7f3177a9a0d2da"
  },
  {
    "url": "docs/4.1/utilities/display/index.html",
    "revision": "3c65fb7fdb5a2692cffc5723a207967f"
  },
  {
    "url": "docs/4.1/utilities/embed/index.html",
    "revision": "49cf58f343dfaa58c1ebac0cb3226ebf"
  },
  {
    "url": "docs/4.1/utilities/flex/index.html",
    "revision": "6d5fda18da0b3e2bb46be86c2cbf29e7"
  },
  {
    "url": "docs/4.1/utilities/float/index.html",
    "revision": "db2c97ea6cc3d07a0859662ba5596248"
  },
  {
    "url": "docs/4.1/utilities/image-replacement/index.html",
    "revision": "98d2a3a9c81f04d6a00681f7bf802494"
  },
  {
    "url": "docs/4.1/utilities/index.html",
    "revision": "6c11a259f899c261fc50fdb6244aa6ce"
  },
  {
    "url": "docs/4.1/utilities/position/index.html",
    "revision": "724602c237095e5d7ad16fb1340abb9c"
  },
  {
    "url": "docs/4.1/utilities/screenreaders/index.html",
    "revision": "8c8f378e595555d1898df499223b9304"
  },
  {
    "url": "docs/4.1/utilities/shadows/index.html",
    "revision": "03e3cd495afc9686df83100761f41e7d"
  },
  {
    "url": "docs/4.1/utilities/sizing/index.html",
    "revision": "713eeecf6ddacf0a229e024ea6ee93a8"
  },
  {
    "url": "docs/4.1/utilities/spacing/index.html",
    "revision": "4be78f1ecf036a6411709e0c5a8cb5f3"
  },
  {
    "url": "docs/4.1/utilities/text/index.html",
    "revision": "e6535fb14811ebffeafca1d188d0e7e6"
  },
  {
    "url": "docs/4.1/utilities/vertical-align/index.html",
    "revision": "613738061f2012ed62c0fcf6171b2742"
  },
  {
    "url": "docs/4.1/utilities/visibility/index.html",
    "revision": "0e584e9c14da492a65fcd71f79296752"
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
    "revision": "5617a806a5d4990a582ae795acf882ea"
  },
  {
    "url": "redirects.json",
    "revision": "ff6e3f0da9bd52ce20975be0b056d464"
  }
])
