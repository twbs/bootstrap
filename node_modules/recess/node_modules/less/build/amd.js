// amd.js
//
// Define Less as an AMD module.
if (typeof define === "function" && define.amd) {
    define("less", [], function () { return less; } );
}
