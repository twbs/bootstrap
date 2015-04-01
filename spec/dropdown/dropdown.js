describe('dropdown:', function() {
  beforeEach(function() {
    this.addMatchers({
      // Place dropdown-specific matchers here...
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
      document.body.innerHTML = __html__['spec/dropdown/basic.html'];
    });

    it('is hidden on initialization', function() {
      $(document).foundation();

      expect($('#drop1').hasClass('open')).toBe(false);
      expect($('#drop2').hasClass('open')).toBe(false);
      expect($('#drop3').hasClass('open')).toBe(false);
      expect($('#drop4').hasClass('open')).toBe(false);
    });

    it('displays the dropdown on click', function() {
      $(document).foundation();

      $('#drop1link').click();

      expect($('#drop1').hasClass('open')).toBe(true);
      expect($('#drop2').hasClass('open')).toBe(false);
      expect($('#drop3').hasClass('open')).toBe(false);
      expect($('#drop4').hasClass('open')).toBe(false);
    });

    it('displays the content dropdown on click', function() {
      $(document).foundation();

      $('#drop2link').click();

      expect($('#drop1').hasClass('open')).toBe(false);
      expect($('#drop2').hasClass('open')).toBe(true);
      expect($('#drop3').hasClass('open')).toBe(false);
      expect($('#drop4').hasClass('open')).toBe(false);
    });

    it('closes an open dropdown when another is clicked', function() {
      $(document).foundation();

      $('#drop1link').click();
      $('#drop2link').click();

      expect($('#drop1').hasClass('open')).toBe(false);
      expect($('#drop2').hasClass('open')).toBe(true);
      expect($('#drop3').hasClass('open')).toBe(false);
      expect($('#drop4').hasClass('open')).toBe(false);
    });

    it('closes an open dropdown when the document is clicked elsewhere', function() {
      $(document).foundation();

      $('#drop1link').click();
      $('body').click();

      expect($('#drop1').hasClass('open')).toBe(false);
      expect($('#drop2').hasClass('open')).toBe(false);
      expect($('#drop3').hasClass('open')).toBe(false);
      expect($('#drop4').hasClass('open')).toBe(false);
    });

    it('displays a dropdown even if the dropdown button has deeply nested content', function() {
      $(document).foundation();

      $('#drop3span').click();

      expect($('#drop1').hasClass('open')).toBe(false);
      expect($('#drop2').hasClass('open')).toBe(false);
      expect($('#drop3').hasClass('open')).toBe(true);
      expect($('#drop4').hasClass('open')).toBe(false);
    });

    it('does not display a disabled dropdown', function() {
      $(document).foundation();

      $('#drop4link').click();

      expect($('#drop1').hasClass('open')).toBe(false);
      expect($('#drop2').hasClass('open')).toBe(false);
      expect($('#drop3').hasClass('open')).toBe(false);
      expect($('#drop4').hasClass('open')).toBe(false);
    });
 });

  describe('miss sides of container', when('medium', function() {
    beforeEach(function() {
      document.body.innerHTML = __html__['spec/dropdown/miss.html'];
    });

    it('displays top-aligned dropdowns below when close to the top', function() {
      $(document).foundation();

      $('a[data-dropdown="missTop"]').click();

      expect($('#missTop').hasClass('drop-top')).toBe(false);
    });

    it('displays right-aligned dropdowns below when close to the right', function() {
      $(document).foundation();

      $('a[data-dropdown="missRight"]').click();

      expect($('#missRight').hasClass('drop-right')).toBe(false);
    });

    it('displays left-aligned dropdowns below when close to the left', function() {
      $(document).foundation();

      $('a[data-dropdown="missLeft"]').click();

      expect($('#missLeft').hasClass('drop-left')).toBe(false);
    });

    it('displays top-aligned dropdowns above when there is space', function() {
      $(document).foundation();

      $('a[data-dropdown="top"]').click();

      expect($('#top').hasClass('drop-top')).toBe(true);
    });

    it('displays right-aligned dropdowns right when there is space', function() {
      $(document).foundation();

      $('a[data-dropdown="right"]').click();

      expect($('#right').hasClass('drop-right')).toBe(true);
    });

    it('displays left-aligned dropdowns left when there is space', function() {
      $(document).foundation();

      $('a[data-dropdown="left"]').click();

      expect($('#left').hasClass('drop-left')).toBe(true);
    });

    it('fits dropdowns into the top-level .row element', function() {
      $(document).foundation();

      $('a[data-dropdown="trigRight"]').click();

      expect($('#trigRight').offset().left).toBeGreaterThan($('.row:first').offset().left);
      expect($('#trigRight').offset().left).toBeLessThan($('a[data-dropdown="trigRight"]').offset().left);
    });
  }));

  describe('pip alignment', function() {
    beforeEach(function() {
      document.body.innerHTML = __html__['spec/dropdown/pips.html'];
    });

    it('horizontally centers pips', function() {
      $(document).foundation();

      $('a[data-dropdown="left"]').click();
      expect($('#left').hasClass('open')).toBe(true);
      var pipstyle = window.getComputedStyle(document.querySelector('#left'),':before');
      var pip_position = parseFloat(pipstyle.left);

      $('a[data-dropdown="leftCenterPip"]').click();
      expect($('#leftCenterPip').hasClass('open')).toBe(true);
      var pipcenterstyle = window.getComputedStyle(document.querySelector('#leftCenterPip'),':before');
      var pipcenter_position = parseFloat(pipcenterstyle.left);

      expect(pip_position).toBeLessThan(pipcenter_position);
    });

    // This test works when it is run manually line-by-line in an inspector
    // window, but not in Jasmine.  Timing problem?
    xit('horizontally centers right-aligned pips', when('medium', function() {
      $('a[data-dropdown="right"]').click();
      expect($('#right').hasClass('open')).toBe(true);
      var pipstyle = window.getComputedStyle(document.querySelector('#right'),':before');
      var pip_position = parseFloat(pipstyle.left);

      $('a[data-dropdown="rightCenterPip"]').click();
      expect($('#rightCenterPip').hasClass('open')).toBe(true);
      var pipcenterstyle = window.getComputedStyle(document.querySelector('#rightCenterPip'),':before');
      var pipcenter_position = parseFloat(pipcenterstyle.left);

      expect(pip_position).toBeGreaterThan(pipcenter_position);
    }));

    it('is globally settable', function() {
      $(document).foundation({
        dropdown: {
          pip: 'center'
        }
      });

      $('a[data-dropdown="left"]').click();
      expect($('#left').hasClass('open')).toBe(true);
      var pipstyle = window.getComputedStyle(document.querySelector('#left'),':before');
      var pip_position = parseFloat(pipstyle.left);

      $('a[data-dropdown="leftCenterPip"]').click();
      expect($('#leftCenterPip').hasClass('open')).toBe(true);
      var pipcenterstyle = window.getComputedStyle(document.querySelector('#leftCenterPip'),':before');
      var pipcenter_position = parseFloat(pipcenterstyle.left);

      expect(pip_position).toEqual(pipcenter_position);

      $('a[data-dropdown="right"]').click();
      expect($('#right').hasClass('open')).toBe(true);
      var pipstyle = window.getComputedStyle(document.querySelector('#right'),':before');
      var pip_position = parseFloat(pipstyle.left);

      $('a[data-dropdown="rightCenterPip"]').click();
      expect($('#rightCenterPip').hasClass('open')).toBe(true);
      var pipcenterstyle = window.getComputedStyle(document.querySelector('#rightCenterPip'),':before');
      var pipcenter_position = parseFloat(pipcenterstyle.left);

      expect(pip_position).toEqual(pipcenter_position);
    });

    it('centers small dropdowns on large buttons', when('medium', function() {
      $(document).foundation();

      $('a[data-dropdown="largeButton"]').click();
      expect($('#largeButton').offset().left).toBeGreaterThan($('a[data-dropdown="largeButton"]').offset().left);
    }));
  });
});
