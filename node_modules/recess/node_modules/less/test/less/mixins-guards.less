
// Stacking, functions..

.light (@a) when (lightness(@a) > 50%) {
  color: white;
}
.light (@a) when (lightness(@a) < 50%) {
  color: black;
}
.light (@a) {
  margin: 1px;
}

.light1 { .light(#ddd) }
.light2 { .light(#444) }

// Arguments against each other

.max (@a, @b) when (@a > @b) {
  width: @a;
}
.max (@a, @b) when (@a < @b) {
  width: @b;
}

.max1 { .max(3, 6) }
.max2 { .max(8, 1) }

// Globals inside guards

@g: auto;

.glob (@a) when (@a = @g) {
  margin: @a @g;
}
.glob1 { .glob(auto) }

// Other operators

.ops (@a) when (@a >= 0) {
  height: gt-or-eq;
}
.ops (@a) when (@a =< 0) {
  height: lt-or-eq;
}
.ops (@a) when not(@a = 0) {
  height: not-eq;
}
.ops1 { .ops(0) }
.ops2 { .ops(1) }
.ops3 { .ops(-1) }

// Scope and default values

@a: auto;

.default (@a: inherit) when (@a = inherit) {
  content: default;
}
.default1 { .default }

// true & false keywords
.test (@a) when (@a) {
    content: "true.";
}
.test (@a) when not (@a) {
    content: "false.";
}

.test1 { .test(true) }
.test2 { .test(false) }
.test3 { .test(1) }
.test4 { .test(boo) }
.test5 { .test("true") }

// Boolean expressions

.bool () when (true) and (false)                             { content: true and false } // FALSE
.bool () when (true) and (true)                              { content: true and true } // TRUE
.bool () when (true)                                         { content: true } // TRUE
.bool () when (false) and (false)                            { content: true } // FALSE
.bool () when (false), (true)                                { content: false, true } // TRUE
.bool () when (false) and (true) and (true),  (true)         { content: false and true and true, true } // TRUE
.bool () when (true)  and (true) and (false), (false)        { content: true and true and false, false } // FALSE
.bool () when (false), (true) and (true)                     { content: false, true and true } // TRUE
.bool () when (false), (false), (true)                       { content: false, false, true } // TRUE
.bool () when (false), (false) and (true), (false)           { content: false, false and true, false } // FALSE
.bool () when (false), (true) and (true) and (true), (false) { content: false, true and true and true, false } // TRUE
.bool () when not (false)                                    { content: not false }
.bool () when not (true) and not (false)                     { content: not true and not false }
.bool () when not (true) and not (true)                      { content: not true and not true }
.bool () when not (false) and (false), not (false)           { content: not false and false, not false }

.bool1 { .bool }

.equality-unit-test(@num) when (@num = 1%) {
  test: fail;
}
.equality-unit-test(@num) when (@num = 2) {
  test: pass;
}
.equality-units {
  .equality-unit-test(1px);
  .equality-unit-test(2px);
}

.colorguard(@col) when (@col = red)							{ content: is @col; }
.colorguard(@col) when not (blue = @col)					{ content: is not blue its @col; }
.colorguard(@col)											{}
.colorguardtest {
    .colorguard(red);
	.colorguard(blue);
	.colorguard(purple);
}

.stringguard(@str) when (@str = "theme1")					{ content: is theme1; }
.stringguard(@str) when not ("theme2" = @str)				{ content: is not theme2; }
.stringguard(@str) when (~"theme1" = @str)					{ content: is theme1 no quotes; }
.stringguard(@str)											{}
.stringguardtest {
    .stringguard("theme1");
	.stringguard("theme2");
	.stringguard(theme1);
}