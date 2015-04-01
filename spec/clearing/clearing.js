describe('clearing:', function() {
  beforeEach(function() {
    this.addMatchers({
      // Place clearing-specific matchers here...
    });

    var origFunc = $.fn.foundation;
    spyOn($.fn, 'foundation').andCallFake(function() {
      var result = origFunc.apply(this, arguments);
      jasmine.Clock.tick(1000); // Let things settle...
      return result;
    });
  });

  describe('basic clearing', function() {
    beforeEach(function() {
      document.body.innerHTML = __html__['spec/clearing/basic.html'];
    });

    // TODO: Disabled - PhantomJS fails during Travis for this but works during watch...needs investigation.
    xit('displays the first image on click', function() {
      $(document).foundation();

      $('#image1').click();

      expect($('#image1').hasClass('visible')).toBe(true);
      expect($('#image2').hasClass('visible')).toBe(false);
      expect($('#image3').hasClass('visible')).toBe(false);
    });

  // TODO: Disabled - PhantomJS fails during Travis for this but works during watch...needs investigation.
      xit('displays the second image on click', function() {
      $(document).foundation();

      $('#image2').click();

      expect($('#image1').hasClass('visible')).toBe(false);
      expect($('#image2').hasClass('visible')).toBe(true);
      expect($('#image3').hasClass('visible')).toBe(false);
    });

    // TODO: Works in Firefox but nowhere else... disabling test until this is figured out.
    xit('goes to the next slide on next', function() {
      $(document).foundation();

      $('#image1').click();

      $('.clearing-main-next').click();

      expect($('#image1').hasClass('visible')).toBe(false);
      expect($('#image2').hasClass('visible')).toBe(true);
      expect($('#image3').hasClass('visible')).toBe(false);
    });
  });
});
