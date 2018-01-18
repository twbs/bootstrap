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
    "revision": "8d1a916512eacc66b2e196e001395a57"
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
    "revision": "ac8702c660a236c2e9236eec0bcea6ed"
  },
  {
    "url": "assets/js/src/application.js",
    "revision": "c08f239f0942146feddd3f078fec831b"
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
    "revision": "29a16726680195da6a8c78f234880607"
  },
  {
    "url": "dist/css/bootstrap-grid.min.css",
    "revision": "6ba2de34dbaa851bb52c96c7bd33352e"
  },
  {
    "url": "dist/css/bootstrap-reboot.css",
    "revision": "7dc6d49bddb587f471ed62358e743727"
  },
  {
    "url": "dist/css/bootstrap-reboot.min.css",
    "revision": "4e559333725069a33a9d0f3387652ea5"
  },
  {
    "url": "dist/css/bootstrap.css",
    "revision": "d59729439a203fc474f5677b8d18d8bb"
  },
  {
    "url": "dist/css/bootstrap.min.css",
    "revision": "450fc463b8b1a349df717056fbb3e078"
  },
  {
    "url": "dist/js/bootstrap.bundle.js",
    "revision": "6866f102282d95443edf73ca112b117b"
  },
  {
    "url": "dist/js/bootstrap.bundle.min.js",
    "revision": "98d2c1da1c0a495f8fc8ad144ea1d3d2"
  },
  {
    "url": "dist/js/bootstrap.js",
    "revision": "d810a38ca2781735a27cba0625a027db"
  },
  {
    "url": "dist/js/bootstrap.min.js",
    "revision": "14d449eb8876fa55e1ef3c2cc52b0c17"
  },
  {
    "url": "docs/4.0/about/brand/index.html",
    "revision": "9e7f3996a7c212223a7029f11be1fbec"
  },
  {
    "url": "docs/4.0/about/index.html",
    "revision": "d493cb2f6baf15f5604c932d50d9e9f7"
  },
  {
    "url": "docs/4.0/about/license/index.html",
    "revision": "ea552b209608ef6c0cf41e237f47dd4d"
  },
  {
    "url": "docs/4.0/about/overview/index.html",
    "revision": "3f9f1b624ffe48f245c9704a2f5920af"
  },
  {
    "url": "docs/4.0/about/translations/index.html",
    "revision": "920e9ec1c28d3d783eae1a32c4c80d67"
  },
  {
    "url": "docs/4.0/browser-bugs/index.html",
    "revision": "b8d69b33161e26242249ed25310814e7"
  },
  {
    "url": "docs/4.0/components/alerts/index.html",
    "revision": "85e8b59adf603b247045a8aa39c8ffe3"
  },
  {
    "url": "docs/4.0/components/badge/index.html",
    "revision": "55f8d2329550f97393f8fe2952987355"
  },
  {
    "url": "docs/4.0/components/breadcrumb/index.html",
    "revision": "c94232cfe3d130fa0c51390d5b59fdbc"
  },
  {
    "url": "docs/4.0/components/button-group/index.html",
    "revision": "99c242f02c89e058b275bf1c8c987067"
  },
  {
    "url": "docs/4.0/components/buttons/index.html",
    "revision": "75979c6a2121c543f4212e13667a6c75"
  },
  {
    "url": "docs/4.0/components/card/index.html",
    "revision": "17aa5456b0038139922aeba067eb907f"
  },
  {
    "url": "docs/4.0/components/carousel/index.html",
    "revision": "015c292aeb06ff2e6eb5d36ce6634ed3"
  },
  {
    "url": "docs/4.0/components/collapse/index.html",
    "revision": "727d035d0d39fb4e6cf0055151f949b5"
  },
  {
    "url": "docs/4.0/components/dropdowns/index.html",
    "revision": "c951578804ad4d818f19c5cbe7ec694d"
  },
  {
    "url": "docs/4.0/components/forms/index.html",
    "revision": "3f2dcc9340c6bffe7fc902935f7e7a93"
  },
  {
    "url": "docs/4.0/components/index.html",
    "revision": "c022805d0d32f17de3e01ba1b5c7dd5f"
  },
  {
    "url": "docs/4.0/components/input-group/index.html",
    "revision": "e95c9e5239823baf92170618a7b1084e"
  },
  {
    "url": "docs/4.0/components/jumbotron/index.html",
    "revision": "1effb292cc37b8dd03ae4de29a995ca4"
  },
  {
    "url": "docs/4.0/components/list-group/index.html",
    "revision": "9c309fe292c840bc0927b3bb1f800d84"
  },
  {
    "url": "docs/4.0/components/modal/index.html",
    "revision": "a1a19725deda6af841fdba7126470d58"
  },
  {
    "url": "docs/4.0/components/navbar/index.html",
    "revision": "e9aab0647287cc4223bbd8d78d6ec12b"
  },
  {
    "url": "docs/4.0/components/navs/index.html",
    "revision": "1f4544fa56354bbebe32582f61144773"
  },
  {
    "url": "docs/4.0/components/pagination/index.html",
    "revision": "e23fa49d6fb2d27c7aea26dab763bbe6"
  },
  {
    "url": "docs/4.0/components/popovers/index.html",
    "revision": "929df93e2df6d33860119386d3658199"
  },
  {
    "url": "docs/4.0/components/progress/index.html",
    "revision": "b797f09186201f676e654be7f22b4b8b"
  },
  {
    "url": "docs/4.0/components/scrollspy/index.html",
    "revision": "f8b712a2e1fe86dad86ceaeeac4dfd69"
  },
  {
    "url": "docs/4.0/components/tooltips/index.html",
    "revision": "da89043c0cff8c2fb91f97b5cc23ea2d"
  },
  {
    "url": "docs/4.0/content/code/index.html",
    "revision": "ae961ecdc36badd038ac73fb8054979a"
  },
  {
    "url": "docs/4.0/content/figures/index.html",
    "revision": "df20018d9c7139da979737104f77e5f2"
  },
  {
    "url": "docs/4.0/content/images/index.html",
    "revision": "972712b1777cd58bd2cddc504a2658d0"
  },
  {
    "url": "docs/4.0/content/index.html",
    "revision": "bfc137709ba1d4504eef0ea4720cd0c1"
  },
  {
    "url": "docs/4.0/content/reboot/index.html",
    "revision": "4fde4405cb7f81119e71b04d54c41aec"
  },
  {
    "url": "docs/4.0/content/tables/index.html",
    "revision": "b343834bdfb200f5e561b2be88f6b7cd"
  },
  {
    "url": "docs/4.0/content/typography/index.html",
    "revision": "4c7a607a868c334e5e1ebd4bcfc2b477"
  },
  {
    "url": "docs/4.0/examples/album/album.css",
    "revision": "e8343131a0fefafe6ae0f37db6d10f3c"
  },
  {
    "url": "docs/4.0/examples/album/index.html",
    "revision": "ee306dba780df6bbbc65a41a921eed8a"
  },
  {
    "url": "docs/4.0/examples/blog/blog.css",
    "revision": "cb98d3e8033940a716641516d2cb857b"
  },
  {
    "url": "docs/4.0/examples/blog/index.html",
    "revision": "a2ed4d2f91ce433338a74bd5f49e949e"
  },
  {
    "url": "docs/4.0/examples/carousel/carousel.css",
    "revision": "e1ef0ffa84cc98db13f90dd02b9981e7"
  },
  {
    "url": "docs/4.0/examples/carousel/index.html",
    "revision": "3efc2981b6da173142086ce9d8aac1d2"
  },
  {
    "url": "docs/4.0/examples/checkout/form-validation.css",
    "revision": "d13d35a0c04021ceacd8c153719860bc"
  },
  {
    "url": "docs/4.0/examples/checkout/index.html",
    "revision": "6dce9885e791ab56d26b3c5f0a64af61"
  },
  {
    "url": "docs/4.0/examples/cover/cover.css",
    "revision": "61f7cbbe930976e62264268abe51ebd3"
  },
  {
    "url": "docs/4.0/examples/cover/index.html",
    "revision": "b5b832918044dc3c65fa51367919c8c5"
  },
  {
    "url": "docs/4.0/examples/dashboard/dashboard.css",
    "revision": "a04ae1b7ceba4aaeb3bc7fe3c72a6d40"
  },
  {
    "url": "docs/4.0/examples/dashboard/index.html",
    "revision": "0d87db1b20149ea817c06f09f03acfde"
  },
  {
    "url": "docs/4.0/examples/floating-labels/floating-labels.css",
    "revision": "5a7fc5962d7981d2c5f9af28f785a0c5"
  },
  {
    "url": "docs/4.0/examples/floating-labels/index.html",
    "revision": "e16e25d95c2a41f6d3d8ff7b94b82936"
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
    "revision": "6eae2082f1e2a762a1d6428b3cc3fc16"
  },
  {
    "url": "docs/4.0/examples/jumbotron/index.html",
    "revision": "f12ea5ddc2c4905bc50b8a705afcbce9"
  },
  {
    "url": "docs/4.0/examples/jumbotron/jumbotron.css",
    "revision": "0ef7edc6babea5a47645bda0c45368aa"
  },
  {
    "url": "docs/4.0/examples/navbar-bottom/index.html",
    "revision": "35d8cd3a5a267e316ab45f480a191eeb"
  },
  {
    "url": "docs/4.0/examples/navbar-fixed/index.html",
    "revision": "1ce40c76fb831fb9bfb81f7a04705555"
  },
  {
    "url": "docs/4.0/examples/navbar-fixed/navbar-top-fixed.css",
    "revision": "3d46ddff119cfe2886a34b72aefd42a6"
  },
  {
    "url": "docs/4.0/examples/navbar-static/index.html",
    "revision": "86ce704638e9227d79683e9928ad258a"
  },
  {
    "url": "docs/4.0/examples/navbar-static/navbar-top.css",
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
    "revision": "0dc41bce7d5407fe4e54a7fe3164cbc1"
  },
  {
    "url": "docs/4.0/examples/offcanvas/offcanvas.css",
    "revision": "65b3d835fd0f90b00844adc8974be45b"
  },
  {
    "url": "docs/4.0/examples/offcanvas/offcanvas.js",
    "revision": "5c0edf2d5a4d88ec65e801c0f58ef23a"
  },
  {
    "url": "docs/4.0/examples/pricing/index.html",
    "revision": "7d57728ad57ca9de41aea23222ad5204"
  },
  {
    "url": "docs/4.0/examples/pricing/pricing.css",
    "revision": "1e170831b26afb7a6bcde4f0bc2cb29b"
  },
  {
    "url": "docs/4.0/examples/product/index.html",
    "revision": "3d998656a2f6de3e938b18ee6f3d98f9"
  },
  {
    "url": "docs/4.0/examples/product/product.css",
    "revision": "139ada632a48dc6b96a46a265a2cc60c"
  },
  {
    "url": "docs/4.0/examples/screenshots/album.png",
    "revision": "685d5277fdf6f04aefbcbe01ba93e9ef"
  },
  {
    "url": "docs/4.0/examples/screenshots/blog.png",
    "revision": "d06dc15ae8285908ec7ba9f4b1f98a44"
  },
  {
    "url": "docs/4.0/examples/screenshots/carousel.png",
    "revision": "dc04e087b8ad4f000fa64e266812fc0f"
  },
  {
    "url": "docs/4.0/examples/screenshots/checkout.png",
    "revision": "030255900e0b73653cf6a2d074f17b31"
  },
  {
    "url": "docs/4.0/examples/screenshots/cover.png",
    "revision": "ece97a4eb488c46a86a67d61db25dda2"
  },
  {
    "url": "docs/4.0/examples/screenshots/dashboard.png",
    "revision": "2fc93187d09b5b8c342b962576eaf39e"
  },
  {
    "url": "docs/4.0/examples/screenshots/floating-labels.png",
    "revision": "fae0436f9d026a67778f3a37d29b3dfc"
  },
  {
    "url": "docs/4.0/examples/screenshots/grid.png",
    "revision": "cb63b8b5fd89749a2d87342876306dd8"
  },
  {
    "url": "docs/4.0/examples/screenshots/jumbotron.png",
    "revision": "0f579cb67e8c8535d8fffef7d17b7e45"
  },
  {
    "url": "docs/4.0/examples/screenshots/navbar-bottom.png",
    "revision": "0cefd6caed82af75be57d758633d9094"
  },
  {
    "url": "docs/4.0/examples/screenshots/navbar-fixed.png",
    "revision": "1d38f157f0bbbd90957044d30eaef242"
  },
  {
    "url": "docs/4.0/examples/screenshots/navbar-static.png",
    "revision": "2ff01be7ee251fc5c7f51ccf9de5f48d"
  },
  {
    "url": "docs/4.0/examples/screenshots/navbars.png",
    "revision": "d4fbce8e1e38d78a5134e6be05cdd4d7"
  },
  {
    "url": "docs/4.0/examples/screenshots/offcanvas.png",
    "revision": "c581d49a56f3e9d0d1753195c62e719a"
  },
  {
    "url": "docs/4.0/examples/screenshots/pricing.png",
    "revision": "e33e2f37741c6d15c99f3378e2e551ea"
  },
  {
    "url": "docs/4.0/examples/screenshots/product.png",
    "revision": "af74e4f7ddfc8cf2a44a9c601881329f"
  },
  {
    "url": "docs/4.0/examples/screenshots/sign-in.png",
    "revision": "9e4bf345a8c21403868f70b777efb483"
  },
  {
    "url": "docs/4.0/examples/screenshots/starter-template.png",
    "revision": "1761d4e831e7c0659962e1abdb95421f"
  },
  {
    "url": "docs/4.0/examples/screenshots/sticky-footer-navbar.png",
    "revision": "428112965cf6826db55bcc6db07d9e5f"
  },
  {
    "url": "docs/4.0/examples/screenshots/sticky-footer.png",
    "revision": "59b69c34997abee3d477f836d44ce8a3"
  },
  {
    "url": "docs/4.0/examples/sign-in/index.html",
    "revision": "0739de40d4fb2333772503ff6a475b18"
  },
  {
    "url": "docs/4.0/examples/sign-in/signin.css",
    "revision": "9c798c2cdaef45f59a916c2051cbe197"
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
    "revision": "7830566087ec33cf521e970266962ae2"
  },
  {
    "url": "docs/4.0/examples/sticky-footer-navbar/sticky-footer-navbar.css",
    "revision": "c5c610f36d8c2a89e7d587880ee0cd68"
  },
  {
    "url": "docs/4.0/examples/sticky-footer/index.html",
    "revision": "7f8a7abbce45fa7d948f8fe3a41c3545"
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
    "revision": "238d58d7f48745d55113a41e1c21bffb"
  },
  {
    "url": "docs/4.0/extend/icons/index.html",
    "revision": "8e616398e9a08e6e051ff53988cc857f"
  },
  {
    "url": "docs/4.0/extend/index.html",
    "revision": "6c0713a383c29184a6f550fcaa09e4e3"
  },
  {
    "url": "docs/4.0/getting-started/accessibility/index.html",
    "revision": "8b5ed54520a60ca99c310b5cfded33e9"
  },
  {
    "url": "docs/4.0/getting-started/best-practices/index.html",
    "revision": "298873474eb3183ba5b65b186726b26c"
  },
  {
    "url": "docs/4.0/getting-started/browsers-devices/index.html",
    "revision": "16335565074e3ba56f6bece117be012e"
  },
  {
    "url": "docs/4.0/getting-started/build-tools/index.html",
    "revision": "34e8f60cea5ec8c0b3f4cb701a55a16c"
  },
  {
    "url": "docs/4.0/getting-started/contents/index.html",
    "revision": "daef9717537e8a8ca2bdb3f573908378"
  },
  {
    "url": "docs/4.0/getting-started/download/index.html",
    "revision": "6447a1aca688819259205cc19b80fd11"
  },
  {
    "url": "docs/4.0/getting-started/index.html",
    "revision": "ed3edf92523344e40222895405408370"
  },
  {
    "url": "docs/4.0/getting-started/introduction/index.html",
    "revision": "fb1a3bff286ed88e7c20f6352476506d"
  },
  {
    "url": "docs/4.0/getting-started/javascript/index.html",
    "revision": "8e6dda9de897d0f955bddaa9e90894f5"
  },
  {
    "url": "docs/4.0/getting-started/options/index.html",
    "revision": "868d9318609f2b504c947f4274c6335f"
  },
  {
    "url": "docs/4.0/getting-started/theming/index.html",
    "revision": "5e1dd6188e850838f0f75e9931116f37"
  },
  {
    "url": "docs/4.0/getting-started/webpack/index.html",
    "revision": "98dbb0a39dc4b873c40da84e093c77cc"
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
    "revision": "76810248ead310dbee1a9a24013856a4"
  },
  {
    "url": "docs/4.0/layout/index.html",
    "revision": "f7315e61a9083e37f8c6f196235eaafb"
  },
  {
    "url": "docs/4.0/layout/media-object/index.html",
    "revision": "7dd3565c31e3e5603fc6b1d19686b9eb"
  },
  {
    "url": "docs/4.0/layout/overview/index.html",
    "revision": "de5badc7c8a07e1a31ac503feb96ceae"
  },
  {
    "url": "docs/4.0/layout/utilities-for-layout/index.html",
    "revision": "21b7512c505c02b84792e9da010c9752"
  },
  {
    "url": "docs/4.0/migration/index.html",
    "revision": "a91a9d2d9125a95dd8b5d07cfca61373"
  },
  {
    "url": "docs/4.0/team/index.html",
    "revision": "d493cb2f6baf15f5604c932d50d9e9f7"
  },
  {
    "url": "docs/4.0/utilities/borders/index.html",
    "revision": "46255c393e87f4c20ba136707ef03ca7"
  },
  {
    "url": "docs/4.0/utilities/clearfix/index.html",
    "revision": "69e10398068f0f6048553132a1da0ff5"
  },
  {
    "url": "docs/4.0/utilities/close-icon/index.html",
    "revision": "17233a8f4fcccd09462b0a0677b54623"
  },
  {
    "url": "docs/4.0/utilities/colors/index.html",
    "revision": "ec7802146f1349b174b912a58ed2c80c"
  },
  {
    "url": "docs/4.0/utilities/display/index.html",
    "revision": "6c059b0ed46c98b36470c520ec9b6b62"
  },
  {
    "url": "docs/4.0/utilities/embed/index.html",
    "revision": "8549aaf9e1bc4bfcbb1793e4dd78ee55"
  },
  {
    "url": "docs/4.0/utilities/flex/index.html",
    "revision": "542223f8832a124950ca2ee27a2abb98"
  },
  {
    "url": "docs/4.0/utilities/float/index.html",
    "revision": "e3da0f6cbb3f990114a7e91202d6ee30"
  },
  {
    "url": "docs/4.0/utilities/image-replacement/index.html",
    "revision": "7ae51174be313edbe6007600405a4888"
  },
  {
    "url": "docs/4.0/utilities/index.html",
    "revision": "54a7143f1b28e09db67110dbb09d05b7"
  },
  {
    "url": "docs/4.0/utilities/position/index.html",
    "revision": "9a57d00083168ce1579e8ed5359b4262"
  },
  {
    "url": "docs/4.0/utilities/screenreaders/index.html",
    "revision": "72a8850b37eb7f36487184fb85dbb299"
  },
  {
    "url": "docs/4.0/utilities/sizing/index.html",
    "revision": "cf19fb3dcc449a16040af91d49d194d7"
  },
  {
    "url": "docs/4.0/utilities/spacing/index.html",
    "revision": "1b3932fe000e681415073e42598b5216"
  },
  {
    "url": "docs/4.0/utilities/text/index.html",
    "revision": "d56e0ab9b360f890c49a9321839904ea"
  },
  {
    "url": "docs/4.0/utilities/vertical-align/index.html",
    "revision": "093beb9f5e61ae5ea2c7a1c982379af3"
  },
  {
    "url": "docs/4.0/utilities/visibility/index.html",
    "revision": "f0e793594dd02cbf4174c2c0854c5d50"
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
    "revision": "573ea5268e4f2b9408f1587ea50459da"
  },
  {
    "url": "redirects.json",
    "revision": "8c7980ae5bb1e82a64929d5975edf59e"
  },
  {
    "url": "sw.js",
    "revision": "42f72988cbd613ae00b4a2c3390712ae"
  }
])
