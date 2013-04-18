@x: red;
@x: blue;
@z: transparent;
@mix: none;

.mixin {
  @mix: #989;
}
@mix: blue;
.tiny-scope {
  color: @mix; // #989
  .mixin;
}

.scope1 {
  @y: orange;
  @z: black;
  color: @x; // blue
  border-color: @z; // black
  .hidden {
    @x: #131313;
  }
  .scope2 {
    @y: red;
    color: @x; // blue
    .scope3 {
      @local: white;
      color: @y; // red
      border-color: @z; // black
      background-color: @local; // white
    }
  }
}

#namespace {
  .scoped_mixin() {
    @local-will-be-made-global: green;
    .scope {
      scoped-val: @local-will-be-made-global;
	}
  }
}

#namespace > .scoped_mixin();

.setHeight(@h) { @height: 1024px; }
.useHeightInMixinCall(@h) { .useHeightInMixinCall { mixin-height: @h; } }
@mainHeight: 50%;
.setHeight(@mainHeight);
.heightIsSet { height: @height; }
.useHeightInMixinCall(@height);

.importRuleset() {
  .imported {
    exists: true;
  }
}
.importRuleset();
.testImported {
  .imported;
}

@parameterDefault: 'top level';
@anotherVariable: 'top level';
//mixin uses top-level variables
.mixinNoParam(@parameter: @parameterDefault) when (@parameter = 'top level') {
  default: @parameter;
  scope: @anotherVariable;
  sub-scope-only: @subScopeOnly;
}

#allAreUsedHere {
  //redefine top-level variables in different scope
  @parameterDefault: 'inside';
  @anotherVariable: 'inside';
  @subScopeOnly: 'inside';
  //use the mixin
  .mixinNoParam();
}