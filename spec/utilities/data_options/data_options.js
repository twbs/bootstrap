describe('data_options:', function() {
  beforeEach(function() {
    this.addMatchers({
      // Place data_options-specific matchers here...
    });

    var origFunc = $.fn.foundation;
    spyOn($.fn, 'foundation').andCallFake(function() {
      var result = origFunc.apply(this, arguments);
      jasmine.Clock.tick(1000); // Let things settle...
      return result;
    });
  });

  describe('passing options', function() {
    beforeEach(function() {
      document.body.innerHTML = __html__['spec/utilities/data_options/basic.html'];
    });

    it('parses options from data-options', function() {
      $(document).foundation();

      var settings = Foundation.utils.data_options($('#default'));
      expect(settings.animal).toBe('unicorn');
    });
    it('parses options from a custom options attribute', function() {
      $(document).foundation();

      var settings = Foundation.utils.data_options($('#custom_name'), 'custom-opts');
      expect(settings.animal).toBe('bear');
    });
    it('parses values with colons', function() {
      $(document).foundation();

      var settings = Foundation.utils.data_options($('#colon_value'));
      expect(settings.event).toBe('custom:scoped:event');
    });
  });
});
