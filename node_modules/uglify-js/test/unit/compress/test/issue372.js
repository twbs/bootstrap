"use strict";
"use strict";

function a() {
    void "a";
    function b() {
        "use strict";
        void "b";
        function c() {
            "use strict";
            void "c";
        }
        function d() {
            "salmon";
            void "d";
        }
    }
    function e() {
        "salmon";
        void "e";
        function f() {
            "use strict";
            "salmon";
            void "f";
            for (var i = 0; i < 10; i++) var g = function() {
                "use strict";
                "salmon";
                void "g";
            }();
        }
    }
};
