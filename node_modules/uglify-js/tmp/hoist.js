function foo(arg1, arg2, arg3, arg4, arg5, arg6) {
        var a = 5;
        {
                var d = 10, mak = 20, buz = 30;
                var q = buz * 2;
        }
        if (moo) {
                var a, b, c;
        }
        for (var arg1 = 0, d = 20; arg1 < 10; ++arg1)
                console.log(arg3);
        for (var i in mak) {}
        for (j in d) {}
        var d;

        function test() {
                
        };

        //test();

        (function moo(first, second){
                console.log(first);
        })(1);

        (function moo(first, second){
                console.log(moo());
        })(1);
}


var foo;
var bar;
