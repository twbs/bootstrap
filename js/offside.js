// Init / usage:
// $(document).ready(function () { 
//	$('[data-toggle=off-canvas]').offcanvas();
// });
//
// Examples:
// <a href="#" data-toggle="off-canvas" data-target="#off-canvas-container" data-param="oc-show-panel-1">Show panel 1</a>
//
// Parameters:
// data-target - (default selector: #off-canvas-container) selector for the item, where data-classes are applied
// data-param - (default: oc-left-push) this oc-* class will be toggled on target (other oc-* classes will be removed)
//
// Allowed oc-* values:
// oc-left/right-slide/push, oc-show-panel-1..N
// oc-exit
//
// http://scotch.io/tutorials/oc-menus-with-css3-transitions-and-transforms
//
jQuery.fn.extend({

	offcanvas: function () {
		"use strict";

		function removeWordsWithPrefix(el, prefix) {
			var regx = new RegExp("\\b" + prefix + "[^\\s]*\\s?", "gi");
			return el.replace(regx, "");
		}

		var $this = $(this), href;

		$this.each(function (index, value) {

			var $value = $(value);

			$value.click(function (e) {
				var $this = $(this), href;

				// target selector
				var target = $this.attr('data-target')
					|| e.preventDefault()
					|| (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); //strip for ie7
				target = (typeof target !== 'undefined') ? target : '#off-canvas-container';
				var $target = $(target);

				// parameter
				var param = $this.attr('data-param');
				param = (typeof param !== 'undefined') ? param : 'oc-left-push';

				// check $param prefix
				var validParam = param.indexOf('oc-') == 0 && param.length > 'oc-'.length;
				if (!validParam)
					$.error('data-param value must start with oc- prefix');

				// class was set before
				var paramClassWasSetBefore = $target.hasClass(param);
				var parmIsForPanel = param.indexOf('oc-show-panel-') == 0;

				// oc-exit - should remove all oc- elements, but not assign any...if used with panels, the first panel will be toggled
				var parmIsOcExit = param.indexOf('oc-exit') == 0;

				// remove all oc-*
				if (typeof ($target.attr('class')) !== 'undefined')
					$target.attr('class', $.trim(removeWordsWithPrefix($target.attr('class'), "oc-")));
	
				// if parameter is a panel value, we won't toggle that value (we have to keep it, thus we have to set it)
				// if parameter is a left/right menu value, then we do toggling, so we keep that class removed if it was present before
				if (paramClassWasSetBefore === false || parmIsForPanel) {
					if (!parmIsOcExit) $target.addClass(param);
				}

			});

		});

	}

});
