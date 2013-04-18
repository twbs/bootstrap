module.exports = {
    reporter: function (results) {
        var len = results.length,
            str = '',
            file, error;

        results.forEach(function (result) {
            file = result.file;
            error = result.error;
            str += file  + ': line ' + error.line + ', col ' +
                error.character + ', ' + error.reason + '\n';
        });

        if (str) {
            process.stdout.write(str + "\n" + len + ' error' + ((len === 1) ? '' : 's') + "\n");
        }
    }
};
