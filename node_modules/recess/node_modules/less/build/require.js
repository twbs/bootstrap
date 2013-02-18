//
// Stub out `require` in the browser
//
function require(arg) {
    return window.less[arg.split('/')[1]];
};

