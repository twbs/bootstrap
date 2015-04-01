describe('interchange:', function() {
  beforeEach(function() {
    this.addMatchers({
      // Place interchange-specific matchers here...
    });

    var origFunc = $.fn.foundation;
    spyOn($.fn, 'foundation').andCallFake(function() {
      var result = origFunc.apply(this, arguments);
      jasmine.Clock.tick(1000); // Let things settle...
      return result;
    });

    spyOn($, 'get').andCallFake(function(path, callback) {
      switch(path) {
        case 'default.html':
          callback('<h1 id="default">DEFAULT</h1>');
          break;
        case 'medium.html':
          callback('<h1 id="medium">MEDIUM</h1>');
          break;
        case 'large.html':
          callback('<h1 id="large">LARGE</h1>');
          break;
      }
    });
  });

  describe('when below the large breakpoint', when_not('large', function() {
    describe('when below the medium breakpoint', when_not('medium', function() {
      describe('with html content interchange', function() {
        beforeEach(function() {
          document.body.innerHTML = __html__['spec/interchange/basic.html'];
        });

        it('shows the default html content', function() {
          $(document).foundation();

          expect($('[data-interchange]').length).toBe(1);
          expect($('#medium').length).toBe(0);
          expect($('#large').length).toBe(0);
        });
      });
    }));
  }));

  describe('when above the large breakpoint', when('large', function() {
      describe('with html content interchange', function() {
        beforeEach(function() {
          document.body.innerHTML = __html__['spec/interchange/basic.html'];
        });

        // Disabling for now... HTML partials may be misbehaving.
        xit('shows the large html content', function() {
          $(document).foundation();

          expect($('#default').length).toBe(0);
          expect($('#medium').length).toBe(0);
          expect($('#large').length).toBe(1);
        });
      });
  }));

  describe('setting data-interchange-last-path', function() {
    describe('when below the large breakpoint', when_not('large', function() {
      beforeEach(function() {
        document.body.innerHTML = __html__['spec/interchange/basic.html'];
      });
      
      it('should set data-interchange-last-path on element when replace occurs', function() {
        expect($('div[data-interchange]').data('data-interchange-last-path')).toBe(undefined);
        
        // Last path shouldn't be set until we initialize foundation
        $(document).foundation();        
        expect($('div[data-interchange]').data('data-interchange-last-path')).toMatch('default.html');
      });
    }))
  });

  describe('events', function() {
    beforeEach(function() {
      document.body.innerHTML = __html__['spec/interchange/basic.html'];
      Foundation.libs.interchange.cache = {};
    });

    it('should handle emitting one event', function() {
      var callback = jasmine.createSpy('callback');

      $('div[data-interchange]').on('replace', callback);

      Foundation.libs.interchange.update_nodes();
      Foundation.libs.interchange.resize();

      expect(callback).toHaveBeenCalled();
    });

    it('should handle emitting multiple events', function() {
      var $element0 = $('div[data-interchange]').attr('id', 'element0'),
          $element1 = $element0.clone().attr('id', 'element1').appendTo('body'),
          callback0 = jasmine.createSpy('callback0'),
          callback1 = jasmine.createSpy('callback1');

      $.get.isSpy = false;
      spyOn($, 'get').andCallFake(function(path, callback) {
        runs(function() {
          callback('<h1>TWO EVENTS</h1>')
        });
      });

      $element0.on('replace', callback0);
      $element1.on('replace', callback1);

      Foundation.libs.interchange.update_nodes();
      Foundation.libs.interchange.resize();

      runs(function() {
        expect(callback0).toHaveBeenCalled();
        expect(callback1).toHaveBeenCalled();
      });
    });
  });
});
