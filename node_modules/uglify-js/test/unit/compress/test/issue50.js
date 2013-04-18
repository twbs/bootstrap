function bar(a) {
        try {
                foo();
        } catch(e) {
                alert("Exception caught (foo not defined)");
        }
        alert(a);               // 10 in FF, "[object Error]" in IE
}
bar(10);
