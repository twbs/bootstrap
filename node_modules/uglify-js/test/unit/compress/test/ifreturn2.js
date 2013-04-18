function x(a) {
    if (typeof a === 'object')
        return a;

    if (a === 42)
        return 0;

    return a * 2;
}

function y(a) {
    if (typeof a === 'object')
        return a;

    return null;
};
