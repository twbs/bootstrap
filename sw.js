/* global workbox:false */

self.importScripts('docs/4.1/assets/js/vendor/workbox-sw.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "docs/4.1/about/brand/index.html",
    "revision": "15d90f6e25e1b414da26bbc0230c9240"
  },
  {
    "url": "docs/4.1/about/index.html",
    "revision": "6bff6684e0bf43a6567d89fc3eeab570"
  },
  {
    "url": "docs/4.1/about/license/index.html",
    "revision": "bdc2d41c696f877257cf499406dc8f7b"
  },
  {
    "url": "docs/4.1/about/overview/index.html",
    "revision": "3aa61636703befd8e8123d4cf6616d30"
  },
  {
    "url": "docs/4.1/about/translations/index.html",
    "revision": "4c59f7a3f73ad573ac529670f52b5ed4"
  },
  {
    "url": "docs/4.1/assets/brand/bootstrap-outline.svg",
    "revision": "93998c8ffa206f4b730ef50ad20692c5"
  },
  {
    "url": "docs/4.1/assets/brand/bootstrap-punchout.svg",
    "revision": "59cc410ba9e916189b9ea54f03bb4574"
  },
  {
    "url": "docs/4.1/assets/brand/bootstrap-social-logo.png",
    "revision": "1e9e93d863b7811934889f9aac89c7de"
  },
  {
    "url": "docs/4.1/assets/brand/bootstrap-social.png",
    "revision": "56be615bbca4502de5d55d721dae917f"
  },
  {
    "url": "docs/4.1/assets/brand/bootstrap-solid.svg",
    "revision": "ba23603c8668f4fe65dc2c7996053224"
  },
  {
    "url": "docs/4.1/assets/css/docs.min.css",
    "revision": "6e3cd62366e30b36d229cb7eb5c064ed"
  },
  {
    "url": "docs/4.1/assets/img/bootstrap-stack.png",
    "revision": "7384412324c769e447d3c4f86e9ff068"
  },
  {
    "url": "docs/4.1/assets/img/bootstrap-themes.png",
    "revision": "3976b58ff407451e8e8b598fdcde2cd2"
  },
  {
    "url": "docs/4.1/assets/img/favicons/android-chrome-192x192.png",
    "revision": "643718426d0a7d60036217ba988155be"
  },
  {
    "url": "docs/4.1/assets/img/favicons/android-chrome-512x512.png",
    "revision": "eb512e79165f504fd4da4d2758d5584b"
  },
  {
    "url": "docs/4.1/assets/img/favicons/apple-touch-icon.png",
    "revision": "042a7e9fdd293212aca19150aef71b0d"
  },
  {
    "url": "docs/4.1/assets/img/favicons/favicon-16x16.png",
    "revision": "50c62448d4014e5fb411887c05c2935b"
  },
  {
    "url": "docs/4.1/assets/img/favicons/favicon-32x32.png",
    "revision": "fed84e16b6ccfe88ee7ffaae5dfefd34"
  },
  {
    "url": "docs/4.1/assets/img/favicons/manifest.json",
    "revision": "c29cc62ce253308cabb1d2bceb023a3f"
  },
  {
    "url": "docs/4.1/assets/img/favicons/mstile-144x144.png",
    "revision": "84892991321e7998ca4c80ae21175f78"
  },
  {
    "url": "docs/4.1/assets/img/favicons/mstile-150x150.png",
    "revision": "61821c45a353e259bb83f9b0d338f5e8"
  },
  {
    "url": "docs/4.1/assets/img/favicons/mstile-310x150.png",
    "revision": "913e1b81006831c72a7bca38e4125edb"
  },
  {
    "url": "docs/4.1/assets/img/favicons/mstile-310x310.png",
    "revision": "29d79a7e648876504496211f003c4076"
  },
  {
    "url": "docs/4.1/assets/img/favicons/mstile-70x70.png",
    "revision": "386d71707992eb91fc53df303e99c2e7"
  },
  {
    "url": "docs/4.1/assets/img/favicons/safari-pinned-tab.svg",
    "revision": "426e00c049a15eb18c37bc88ca6746d9"
  },
  {
    "url": "docs/4.1/assets/js/docs.min.js",
    "revision": "9109c979ae60b0c5584b59ca6945d630"
  },
  {
    "url": "docs/4.1/assets/js/src/application.js",
    "revision": "83edc01382cfd889f982162964ec374e"
  },
  {
    "url": "docs/4.1/assets/js/src/ie-emulation-modes-warning.js",
    "revision": "c6e7032adf9bd98ac39e83c83108977b"
  },
  {
    "url": "docs/4.1/assets/js/src/pwa.js",
    "revision": "cac6034355863d6205e66862f6a729f7"
  },
  {
    "url": "docs/4.1/assets/js/src/search.js",
    "revision": "5b8bb2081b9e10ee9a469dd5feca5996"
  },
  {
    "url": "docs/4.1/assets/js/vendor/anchor.min.js",
    "revision": "01e6254e9f69c0c00f05060b0e1990fc"
  },
  {
    "url": "docs/4.1/assets/js/vendor/clipboard.min.js",
    "revision": "3f3688138a1b9fc4ef669ce9056b6674"
  },
  {
    "url": "docs/4.1/assets/js/vendor/holder.min.js",
    "revision": "6266d87979b32f717d298f7adf36984a"
  },
  {
    "url": "docs/4.1/assets/js/vendor/jquery-slim.min.js",
    "revision": "99b0a83cf1b0b1e2cb16041520e87641"
  },
  {
    "url": "docs/4.1/assets/js/vendor/popper.min.js",
    "revision": "83fb8c4d9199dce0224da0206423106f"
  },
  {
    "url": "docs/4.1/assets/js/vendor/workbox-sw.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "docs/4.1/browser-bugs/index.html",
    "revision": "85938c9415f159e64d91983750ff6a8c"
  },
  {
    "url": "docs/4.1/components/alerts/index.html",
    "revision": "715870af9ae3fb8931012c77a93cedf2"
  },
  {
    "url": "docs/4.1/components/badge/index.html",
    "revision": "a832eb2929d511beb5b3b58e37b17738"
  },
  {
    "url": "docs/4.1/components/breadcrumb/index.html",
    "revision": "e12243b4068151083c12dbca58193725"
  },
  {
    "url": "docs/4.1/components/button-group/index.html",
    "revision": "e2c85fcd8d4abaf9ef0b6164d20d2cfc"
  },
  {
    "url": "docs/4.1/components/buttons/index.html",
    "revision": "8598be54bc0b127d2321f34e7cff56d8"
  },
  {
    "url": "docs/4.1/components/card/index.html",
    "revision": "ea7c41ce1279937e309f360065fdac20"
  },
  {
    "url": "docs/4.1/components/carousel/index.html",
    "revision": "3cc02a57afa06ebd9e05db3dfe283c29"
  },
  {
    "url": "docs/4.1/components/collapse/index.html",
    "revision": "8cd128350ca07ddc4f11b2346d434d45"
  },
  {
    "url": "docs/4.1/components/dropdowns/index.html",
    "revision": "3b40b2a8661a734a98944d61461d8a2b"
  },
  {
    "url": "docs/4.1/components/forms/index.html",
    "revision": "b1eb95ead1e8ccf9d812fe4f24fe04ce"
  },
  {
    "url": "docs/4.1/components/index.html",
    "revision": "a3dd91f7f4b0d03a018035606be51432"
  },
  {
    "url": "docs/4.1/components/input-group/index.html",
    "revision": "fec21daade98342fa14d53cfa1b472a8"
  },
  {
    "url": "docs/4.1/components/jumbotron/index.html",
    "revision": "f1f54166ee062fb23acef25c772872a0"
  },
  {
    "url": "docs/4.1/components/list-group/index.html",
    "revision": "532854fb053028b6ce47fc1b4a21c909"
  },
  {
    "url": "docs/4.1/components/modal/index.html",
    "revision": "bb1d8860f8c6dbf37bc008e72519a82b"
  },
  {
    "url": "docs/4.1/components/navbar/index.html",
    "revision": "8918210ab3d16b4f40adb461afbf6b05"
  },
  {
    "url": "docs/4.1/components/navs/index.html",
    "revision": "f6dfe8e954b9fdbeb8d41c403948e42b"
  },
  {
    "url": "docs/4.1/components/pagination/index.html",
    "revision": "eac821cffeca083d77112f0902f77f29"
  },
  {
    "url": "docs/4.1/components/popovers/index.html",
    "revision": "11fd33ad66f45a3caac7c4419d18d6f0"
  },
  {
    "url": "docs/4.1/components/progress/index.html",
    "revision": "3caf6c120be64ce9ca80c16512af6e0f"
  },
  {
    "url": "docs/4.1/components/scrollspy/index.html",
    "revision": "7909f113b3e68f908a20b54f174ad10e"
  },
  {
    "url": "docs/4.1/components/tooltips/index.html",
    "revision": "4c48971f5ef53c0d78f76587dd644769"
  },
  {
    "url": "docs/4.1/content/code/index.html",
    "revision": "1a2b473136c2b450e6030214ea846780"
  },
  {
    "url": "docs/4.1/content/figures/index.html",
    "revision": "2994963be2feb46c345c50101b45e74a"
  },
  {
    "url": "docs/4.1/content/images/index.html",
    "revision": "816e803f403fd8832a3c8fd5dae21c15"
  },
  {
    "url": "docs/4.1/content/index.html",
    "revision": "518e6f8a4d0bd04638d4193ff8674785"
  },
  {
    "url": "docs/4.1/content/reboot/index.html",
    "revision": "06093cdb0cf139235b4ab270f16c7a27"
  },
  {
    "url": "docs/4.1/content/tables/index.html",
    "revision": "6bf57fce373280c613f966a9a5aa0fb4"
  },
  {
    "url": "docs/4.1/content/typography/index.html",
    "revision": "4e054528323ea125019986bb16b2e414"
  },
  {
    "url": "docs/4.1/dist/css/bootstrap-grid.css",
    "revision": "d97f0e994900859875d1bd0a1246eec6"
  },
  {
    "url": "docs/4.1/dist/css/bootstrap-grid.min.css",
    "revision": "030004b9206307c0b0c192f141a666c7"
  },
  {
    "url": "docs/4.1/dist/css/bootstrap-reboot.css",
    "revision": "df27f6df2eaf08845b8acea059ece473"
  },
  {
    "url": "docs/4.1/dist/css/bootstrap-reboot.min.css",
    "revision": "eb5fb7e0b867cae7a9fd2b0b5168cf13"
  },
  {
    "url": "docs/4.1/dist/css/bootstrap.css",
    "revision": "013405db42d6e4e2cdfc72eb6b20c681"
  },
  {
    "url": "docs/4.1/dist/css/bootstrap.min.css",
    "revision": "88d1b1c0fd447a75e6e60a61ca041aae"
  },
  {
    "url": "docs/4.1/dist/js/bootstrap.bundle.js",
    "revision": "8fc7478d98b8371855e0e051e3ff4ae1"
  },
  {
    "url": "docs/4.1/dist/js/bootstrap.bundle.min.js",
    "revision": "fb63ebd7050580f171cb88b16f94e00c"
  },
  {
    "url": "docs/4.1/dist/js/bootstrap.js",
    "revision": "ae4383e5e180778fdcb3cbbc33dce09e"
  },
  {
    "url": "docs/4.1/dist/js/bootstrap.min.js",
    "revision": "f92a3f337500984fbd20487501257dae"
  },
  {
    "url": "docs/4.1/examples/album/album.css",
    "revision": "e8343131a0fefafe6ae0f37db6d10f3c"
  },
  {
    "url": "docs/4.1/examples/album/index.html",
    "revision": "0514823e02817013165d058f74547577"
  },
  {
    "url": "docs/4.1/examples/blog/blog.css",
    "revision": "095c85e484178b56ad0446775869e628"
  },
  {
    "url": "docs/4.1/examples/blog/index.html",
    "revision": "26fccb60493a0c38bf73490f9e354574"
  },
  {
    "url": "docs/4.1/examples/carousel/carousel.css",
    "revision": "e1ef0ffa84cc98db13f90dd02b9981e7"
  },
  {
    "url": "docs/4.1/examples/carousel/index.html",
    "revision": "52f0215a5005cc7c21c5083dd7939a7e"
  },
  {
    "url": "docs/4.1/examples/checkout/form-validation.css",
    "revision": "d13d35a0c04021ceacd8c153719860bc"
  },
  {
    "url": "docs/4.1/examples/checkout/index.html",
    "revision": "a3beb88caa4b44de31976e74ad5eaa83"
  },
  {
    "url": "docs/4.1/examples/cover/cover.css",
    "revision": "211daf4eee015cb38fb10893c4645bbb"
  },
  {
    "url": "docs/4.1/examples/cover/index.html",
    "revision": "048fae28475f3bdd6d7d1612e8ece5cc"
  },
  {
    "url": "docs/4.1/examples/dashboard/dashboard.css",
    "revision": "419f2b36ccf58f5cb1b5b557658b65dd"
  },
  {
    "url": "docs/4.1/examples/dashboard/index.html",
    "revision": "2875509e000a7223d1ff26c2df02213c"
  },
  {
    "url": "docs/4.1/examples/floating-labels/floating-labels.css",
    "revision": "1f64933a824e890a19a1c3b91d0f87cb"
  },
  {
    "url": "docs/4.1/examples/floating-labels/index.html",
    "revision": "0889b053e0315e02b24128c8ad71590f"
  },
  {
    "url": "docs/4.1/examples/grid/grid.css",
    "revision": "4cd2e5cc5e19dc692d50ed6f077154ef"
  },
  {
    "url": "docs/4.1/examples/grid/index.html",
    "revision": "7754ea51ef4513e1c099aca97857fd37"
  },
  {
    "url": "docs/4.1/examples/index.html",
    "revision": "4ffd8a83fae256f8b55751b88f14f6bc"
  },
  {
    "url": "docs/4.1/examples/jumbotron/index.html",
    "revision": "9bb1da29cef11b3993343808dbb488cd"
  },
  {
    "url": "docs/4.1/examples/jumbotron/jumbotron.css",
    "revision": "0ef7edc6babea5a47645bda0c45368aa"
  },
  {
    "url": "docs/4.1/examples/navbar-bottom/index.html",
    "revision": "9d593c1276a24a936d31f9edfd7860df"
  },
  {
    "url": "docs/4.1/examples/navbar-fixed/index.html",
    "revision": "f7ead48d9f5f43f295f9635e5f18d6c2"
  },
  {
    "url": "docs/4.1/examples/navbar-fixed/navbar-top-fixed.css",
    "revision": "3d46ddff119cfe2886a34b72aefd42a6"
  },
  {
    "url": "docs/4.1/examples/navbar-static/index.html",
    "revision": "77004f809351706b609d3cbbf1aec27f"
  },
  {
    "url": "docs/4.1/examples/navbar-static/navbar-top.css",
    "revision": "ae704085e05c4bc6a705b225b03a5aea"
  },
  {
    "url": "docs/4.1/examples/navbars/index.html",
    "revision": "c7a79fd01d21b29cbdf2c398d71c7f48"
  },
  {
    "url": "docs/4.1/examples/navbars/navbar.css",
    "revision": "f95ea8bb033949bba31b05925773e223"
  },
  {
    "url": "docs/4.1/examples/offcanvas/index.html",
    "revision": "b9984f3c7a0f9de4109dc9b8ce5df671"
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
    "revision": "8b2d8e17f58af20329cb4bcd3b685175"
  },
  {
    "url": "docs/4.1/examples/pricing/pricing.css",
    "revision": "1e170831b26afb7a6bcde4f0bc2cb29b"
  },
  {
    "url": "docs/4.1/examples/product/index.html",
    "revision": "ad1b74128c5610403d3779965ebd4052"
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
    "revision": "253d015ba1f15d1a6bc38913e14f5850"
  },
  {
    "url": "docs/4.1/examples/sign-in/signin.css",
    "revision": "00e205f17ee0cd3f59d5e1e1e9cf3b3f"
  },
  {
    "url": "docs/4.1/examples/starter-template/index.html",
    "revision": "dbbfced32a95a6c50bdc755d460832ab"
  },
  {
    "url": "docs/4.1/examples/starter-template/starter-template.css",
    "revision": "8cb4aab3660723b641b6458f1a1d3ab1"
  },
  {
    "url": "docs/4.1/examples/sticky-footer-navbar/index.html",
    "revision": "06b2b2adf1ccdaf81f1a165ad7006f3b"
  },
  {
    "url": "docs/4.1/examples/sticky-footer-navbar/sticky-footer-navbar.css",
    "revision": "c5c610f36d8c2a89e7d587880ee0cd68"
  },
  {
    "url": "docs/4.1/examples/sticky-footer/index.html",
    "revision": "1e3e45e74e1d578ed001a4ba502fb3d0"
  },
  {
    "url": "docs/4.1/examples/sticky-footer/sticky-footer.css",
    "revision": "09630d01995ef9c0f8fc9ae622f00466"
  },
  {
    "url": "docs/4.1/examples/tooltip-viewport/index.html",
    "revision": "84df4402f0742fb12c26e24adece94d5"
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
    "revision": "e036adec805d877fc49a528b239baf6c"
  },
  {
    "url": "docs/4.1/extend/icons/index.html",
    "revision": "abb8272403db7002cc66da45f4794e22"
  },
  {
    "url": "docs/4.1/extend/index.html",
    "revision": "65b499362db159a4a704472c63830fc9"
  },
  {
    "url": "docs/4.1/getting-started/accessibility/index.html",
    "revision": "5c559e9a2ed49d56655c4f93ec3db85d"
  },
  {
    "url": "docs/4.1/getting-started/best-practices/index.html",
    "revision": "90fdfcb306c82c6c648e734cac3884ef"
  },
  {
    "url": "docs/4.1/getting-started/browsers-devices/index.html",
    "revision": "f177ccabf28eebc4681c6eca2f1c0967"
  },
  {
    "url": "docs/4.1/getting-started/build-tools/index.html",
    "revision": "a498046baadedfe70a395e0e0adf3541"
  },
  {
    "url": "docs/4.1/getting-started/contents/index.html",
    "revision": "b9ce542a045beb45ebc166bf8490bd96"
  },
  {
    "url": "docs/4.1/getting-started/download/index.html",
    "revision": "d135d759531abaef93d33c4c30c20bf9"
  },
  {
    "url": "docs/4.1/getting-started/index.html",
    "revision": "2a99454a339174673cab67bdf48f53a6"
  },
  {
    "url": "docs/4.1/getting-started/introduction/index.html",
    "revision": "430e6bf79852bef3dbc20ea5689ee2a5"
  },
  {
    "url": "docs/4.1/getting-started/javascript/index.html",
    "revision": "2ca11fdc101e02878c6f30fe944325e0"
  },
  {
    "url": "docs/4.1/getting-started/options/index.html",
    "revision": "4f372fe79f4cbd70d975b5c548b91842"
  },
  {
    "url": "docs/4.1/getting-started/theming/index.html",
    "revision": "1f9eed07a523b85c2dcdf2ddb29f7e1b"
  },
  {
    "url": "docs/4.1/getting-started/webpack/index.html",
    "revision": "3ada32007ea8d7d97004776150f71898"
  },
  {
    "url": "docs/4.1/history/index.html",
    "revision": "6bff6684e0bf43a6567d89fc3eeab570"
  },
  {
    "url": "docs/4.1/index.html",
    "revision": "2a99454a339174673cab67bdf48f53a6"
  },
  {
    "url": "docs/4.1/layout/grid/index.html",
    "revision": "3a9a67be5b1f36ab9515542efeec14b7"
  },
  {
    "url": "docs/4.1/layout/index.html",
    "revision": "3a5aa82f61680af25d644231a3658f70"
  },
  {
    "url": "docs/4.1/layout/media-object/index.html",
    "revision": "6346f260341c55427a3827f86e29cc56"
  },
  {
    "url": "docs/4.1/layout/overview/index.html",
    "revision": "dbb52ee70f8b420c5d7587cc84236b6c"
  },
  {
    "url": "docs/4.1/layout/utilities-for-layout/index.html",
    "revision": "3b39b069061885953b03d17aabf27721"
  },
  {
    "url": "docs/4.1/migration/index.html",
    "revision": "3a45c09ccab2353bcf03d7a0cd77123a"
  },
  {
    "url": "docs/4.1/team/index.html",
    "revision": "6bff6684e0bf43a6567d89fc3eeab570"
  },
  {
    "url": "docs/4.1/utilities/borders/index.html",
    "revision": "942125df79194caa20b7a83d472aa773"
  },
  {
    "url": "docs/4.1/utilities/clearfix/index.html",
    "revision": "1b30e2f06ae1b4cfe93747e3c5495571"
  },
  {
    "url": "docs/4.1/utilities/close-icon/index.html",
    "revision": "1e92dbb5a2807917985e088dcf62a90f"
  },
  {
    "url": "docs/4.1/utilities/colors/index.html",
    "revision": "02f815103c221d8cccb6fbd9893f8ffa"
  },
  {
    "url": "docs/4.1/utilities/display/index.html",
    "revision": "ce75d5b9cd354aa57db2767ee18c84d8"
  },
  {
    "url": "docs/4.1/utilities/embed/index.html",
    "revision": "d66bc37fa1f96a22df0c24f5b6d5ac89"
  },
  {
    "url": "docs/4.1/utilities/flex/index.html",
    "revision": "106af263d0a028a4df5a7a806a6f65f8"
  },
  {
    "url": "docs/4.1/utilities/float/index.html",
    "revision": "22d8d461cd39a8d3250bc203fbce074e"
  },
  {
    "url": "docs/4.1/utilities/image-replacement/index.html",
    "revision": "a786e883ea2d8993037e552b100d9ad0"
  },
  {
    "url": "docs/4.1/utilities/index.html",
    "revision": "141e5e7702b2fd059978c2c9efe623e8"
  },
  {
    "url": "docs/4.1/utilities/position/index.html",
    "revision": "0373dab777186abcdabe36ba3c0b1ca1"
  },
  {
    "url": "docs/4.1/utilities/screenreaders/index.html",
    "revision": "ac3349deeacbd0df2a40a6d4c9f12149"
  },
  {
    "url": "docs/4.1/utilities/shadows/index.html",
    "revision": "a43bd1b90b7ab1cf5fd2b7d33ad90f93"
  },
  {
    "url": "docs/4.1/utilities/sizing/index.html",
    "revision": "aa72105e6dacf1e53c432fb92f465c96"
  },
  {
    "url": "docs/4.1/utilities/spacing/index.html",
    "revision": "e3e22c7128633dbf9c63c03fe34d6dc8"
  },
  {
    "url": "docs/4.1/utilities/text/index.html",
    "revision": "77d448cb3baef93689c3ca6520ed1eba"
  },
  {
    "url": "docs/4.1/utilities/vertical-align/index.html",
    "revision": "4a310044e3d5fbe78afe45ca62c1d79d"
  },
  {
    "url": "docs/4.1/utilities/visibility/index.html",
    "revision": "cc6f8141cfb345e6b5112f9c4e3dd824"
  },
  {
    "url": "docs/getting-started/index.html",
    "revision": "2a99454a339174673cab67bdf48f53a6"
  },
  {
    "url": "docs/index.html",
    "revision": "2a99454a339174673cab67bdf48f53a6"
  },
  {
    "url": "examples/index.html",
    "revision": "55e08209972028cad8c86dd4cf03a0ae"
  },
  {
    "url": "index.html",
    "revision": "a4aec9ed29294d414a1163e1ba262961"
  },
  {
    "url": "redirects.json",
    "revision": "ff6e3f0da9bd52ce20975be0b056d464"
  }
])
