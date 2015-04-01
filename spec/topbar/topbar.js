describe('topbar:', function() {
  beforeEach(function() {
    this.addMatchers({
      // Place topbar-specific matchers here...
    });

    var origFunc = $.fn.foundation;
    spyOn($.fn, 'foundation').andCallFake(function() {
      var result = origFunc.apply(this, arguments);
      jasmine.Clock.tick(1000); // Let things settle...
      return result;
    });
  });

  describe('when above the topbar breakpoint', when('topbar', function() {
    describe('sticky', function() {
      beforeEach(function() {
        document.body.innerHTML = __html__['spec/topbar/sticky.html'];
      });

      // Can't use this test right now because it fails in PhantomJS.
      // I couldn't find a way to manipulate the scroll position that it would allow.
      /*it('should become fixed when scrolled', function() {
        $(document).foundation();

        var settings = Foundation.libs.topbar.settings;
        var sticky = $('.' + settings.sticky_class);

        $(window).scrollTop(document.body.scrollHeight);
        $(window).triggerHandler('scroll');

        expect(sticky.hasClass('fixed')).toBe(true);
        expect($('body').hasClass('f-topbar-fixed')).toBe(true);
      });*/
    });

    describe('with multiple dropdowns with defaults', function() {
      beforeEach(function() {
        document.body.innerHTML = __html__['spec/topbar/multidropdown.html'];
      });

      it('should not have a toggle button', function() {
        $(document).foundation();

        var settings = Foundation.libs.topbar.settings;
        var topbar = $('[data-topbar]');
        var toggle = topbar.find('.toggle-topbar:hidden');
        expect(toggle.length).toBe(1);
      });
    });
  }));

  describe('when below the topbar breakpoint', when_not('topbar', function () {
    describe('multiple dropdowns with defaults', function() {
      beforeEach(function() {
        document.body.innerHTML = __html__['spec/topbar/multidropdown.html'];
      });

      it('should have a toggle button', function() {
        $(document).foundation();

        var settings = Foundation.libs.topbar.settings;
        var topbar = $('[data-topbar]');
        var toggle = topbar.find('.toggle-topbar:not(:hidden)');
        expect(toggle.length).toBe(1);
      });

      it('should expand when the toggle is clicked', function() {
        $(document).foundation();

        var topbar = $('[data-topbar]');
        var toggle = topbar.find('.toggle-topbar');

        spyOn(Foundation.libs.topbar, 'toggle').andCallThrough();

        toggle.click();

        expect(Foundation.libs.topbar.toggle).toHaveBeenCalled();
        expect(topbar.hasClass('expanded')).toBe(true);
      });

      it('should collapse after being expanded by the toggle', function() {
        $(document).foundation();

        var topbar = $('[data-topbar]');
        var toggle = topbar.find('.toggle-topbar');

        toggle.click();
        toggle.click();

        expect(topbar.hasClass('expanded')).toBe(false);
      });
    });

  }));
});
