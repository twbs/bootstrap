describe('equalizer:', function() {
  beforeEach(function() {
    this.addMatchers({
      // Place equalize-specific matchers here...
    });

    var origFunc = $.fn.foundation;
    spyOn($.fn, 'foundation').andCallFake(function() {
      var result = origFunc.apply(this, arguments);
      jasmine.Clock.tick(1000); // Let things settle...
      return result;
    });
  });

  describe('basic height', function() {
    beforeEach(function() {
      document.body.innerHTML = __html__['spec/equalizer/basic.html'];
    });

    it('should have equal heights on load', function() {
      $(document).foundation();

      var equalized = $('[data-equalizer-watch]');

      equalized.each(function(){
        expect($(this).outerHeight()).toBe(equalized.first().outerHeight());
      });
    });
  });
});
