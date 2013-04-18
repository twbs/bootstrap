this.suite2 = {
    'another test': function (test) {
        setTimeout(function () {
            // lots of assertions
            test.ok(true, 'everythings ok');
            test.ok(true, 'everythings ok');
            test.ok(true, 'everythings ok');
            test.ok(true, 'everythings ok');
            test.ok(true, 'everythings ok');
            test.done();
        }, 10);
    }
};
