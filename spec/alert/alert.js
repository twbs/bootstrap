describe('alert:', function() {
  beforeEach(function() {
    this.addMatchers({
      // Place alert-specific matchers here...
    });

    var origFunc = $.fn.foundation;
    spyOn($.fn, 'foundation').andCallFake(function() {
      var result = origFunc.apply(this, arguments);
      jasmine.Clock.tick(1000); // Let things settle...
      return result;
    });
  });

  describe('basic alert', function() {
    beforeEach(function() {
      document.body.innerHTML = __html__['spec/alert/basic.html'];
    });

    it('should be visible by default', function() {
      $(document).foundation();

      expect($('#myAlert')).toBeVisible();
    });

    it('should be hidden when close is clicked', function() {
      $(document).foundation();

      // TODO: Figure out how to get this working... more difficult than it seems.  :)
      // $('a.close').click();
      // jasmine.Clock.tick(1000);
      //expect($('#alertClose')).not.toBeVisible();
    });
  });
});
