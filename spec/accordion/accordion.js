describe('accordion:', function() {
  beforeEach(function() {
    this.addMatchers({
      // Place accordion-specific matchers here...
    });

    var origFunc = $.fn.foundation;
    spyOn($.fn, 'foundation').andCallFake(function() {
      var result = origFunc.apply(this, arguments);
      jasmine.Clock.tick(1000); // Let things settle...
      return result;
    });
  });

  describe('basic accordion with tab child', function() {
    beforeEach(function() {
      document.body.innerHTML = __html__['spec/accordion/basic.html'];
    });

    it('should default to the active tab', function() {
      $(document).foundation();

      expect($('#panel1')).toBeVisible();
      expect($('#panel2-1')).toBeVisible();
      expect($('#panel2-2')).toBeHidden();
      expect($('#panel2')).toBeHidden();
      expect($('#panel3')).toBeHidden();
    });

    it('should switch to the clicked section', function() {
      $(document).foundation();

      $('#panel2').prev().click();

      expect($('#panel1')).toBeHidden();
      expect($('#panel2-1')).toBeHidden();
      expect($('#panel2-2')).toBeHidden();
      expect($('#panel2')).toBeVisible();
      expect($('#panel3')).toBeHidden();
    });
  });

  describe('embedded grid accordion', function() {
    beforeEach(function() {
      document.body.innerHTML = __html__['spec/accordion/grid.html'];
    });

    it('should switch to the clicked section', function() {
      $(document).foundation();

      $('#panel1c').prev().click();

      expect($('#panel1c')).toBeVisible();
      expect($('#panel2c')).toBeHidden();
      expect($('#panel3c')).toBeHidden();
      expect($('#panel4c')).toBeHidden();
      expect($('#panel5c')).toBeHidden();
      expect($('#panel6c')).toBeHidden();

      $('#panel4c').prev().click();

      expect($('#panel1c')).toBeHidden();
      expect($('#panel2c')).toBeHidden();
      expect($('#panel3c')).toBeHidden();
      expect($('#panel4c')).toBeVisible();
      expect($('#panel5c')).toBeHidden();
      expect($('#panel6c')).toBeHidden();
    });
  });

  describe('multi-expand accordion', function() {
    beforeEach(function() {
      document.body.innerHTML = __html__['spec/accordion/multiexpand.html'];
    });

    it('should default to the active panel', function() {
      $(document).foundation('accordion', { multi_expand: true });

      expect($('#panel1')).toBeHidden();
      expect($('#panel2')).toBeVisible();
      expect($('#panel3')).toBeHidden();
    });

    it('should open the clicked section, leaving previous active panels open', function() {
      $(document).foundation('accordion', { multi_expand: true });

      $('#panel3').prev().click();

      expect($('#panel1')).toBeHidden();
      expect($('#panel2')).toBeVisible();
      expect($('#panel3')).toBeVisible();
    });
  });
});
