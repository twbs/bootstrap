describe('slider:', function() {
  beforeEach(function() {
    var origFunc = $.fn.foundation;
    spyOn($.fn, 'foundation').andCallFake(function() {
      var result = origFunc.apply(this, arguments);
      jasmine.Clock.tick(1000); // Let things settle...
      return result;
    });
  });

 describe('label', function() {
    beforeEach(function() {
      document.body.innerHTML = __html__['spec/slider/label.html'];
    });

    it('displays value when initialized', function() {
      $(document).foundation();

      var sliderValue = $('.range-slider').attr('data-slider');
      expect($('#sliderOutput').text()).toBe(sliderValue);
    });
 });
});
