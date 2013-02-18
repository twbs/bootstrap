//
// Stub out `require` in rhino
//
function require(arg) {
    return less[arg.split('/')[1]];
};

