describe('add_custom_rule:', function() {
  beforeEach(function() {
    this.addMatchers({
      // Place add_custom_rule-specific matchers here...
    });

    var origFunc = $.fn.foundation;
    spyOn($.fn, 'foundation').andCallFake(function() {
      var result = origFunc.apply(this, arguments);
      jasmine.Clock.tick(1000); // Let things settle...
      return result;
    });
  });

  describe('adding custom CSS rules', function() {
    beforeEach(function() {
      document.body.innerHTML = __html__['spec/utilities/add_custom_rule/basic.html'];
    });

    it('Applies custom rules unspecified breakpoint', function() {
      $(document).foundation();

      Foundation.utils.add_custom_rule('div#toggledContent { display:none;}');
      expect($('div#toggledContent')).toBeHidden();
    });

    it('Applies custom rules for small and up breakpoint', function() {
      $(document).foundation();

      Foundation.utils.add_custom_rule('div#toggledContent { display:none;}', 'small');
      expect($('div#toggledContent')).toBeHidden();
    });
  });
});
