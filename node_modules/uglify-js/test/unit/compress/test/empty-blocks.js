var x = 5;
function bar() { return --x; }
function foo() { while (bar()); }
function mak() { for(;;); }
