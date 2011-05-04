/**
 * hashgrid (jQuery version)
 * http://github.com/dotjay/hashgrid
 * Version 5, 3 Nov 2010
 * Written by Jon Gibbins, dotjay.co.uk, accessibility.co.uk
 * Contibutors:
 * Sean Coates, seancoates.com
 * Phil Dokas, jetless.org
 *
 * // Using a basic #grid setup
 * var grid = new hashgrid();
 *
 * // Using #grid with a custom id (e.g. #mygrid)
 * var grid = new hashgrid("mygrid");
 *
 * // Using #grid with additional options
 * var grid = new hashgrid({
 *     id: 'mygrid',            // id for the grid container
 *     modifierKey: 'alt',      // optional 'ctrl', 'alt' or 'shift'
 *     showGridKey: 's',        // key to show the grid
 *     holdGridKey: 'enter',    // key to hold the grid in place
 *     foregroundKey: 'f',      // key to toggle foreground/background
 *     jumpGridsKey: 'd',       // key to cycle through the grid classes
 *     numberOfGrids: 2,        // number of grid classes used
 *     classPrefix: 'class',    // prefix for the grid classes
 *     cookiePrefix: 'mygrid'   // prefix for the cookie name
 * });
 */
if (typeof jQuery == "undefined") {
	alert("Hashgrid: jQuery not loaded. Make sure it's linked to your pages.");
}


/**
 * hashgrid overlay
 */
var hashgrid = function(set) {

	var options = {
		id: 'grid',             // id for the grid container
		modifierKey: null,      // optional 'ctrl', 'alt' or 'shift'
		showGridKey: 'g',       // key to show the grid
		holdGridKey: 'h',       // key to hold the grid in place
		foregroundKey: 'f',     // key to toggle foreground/background
		jumpGridsKey: 'j',      // key to cycle through the grid classes
		numberOfGrids: 1,       // number of grid classes used
		classPrefix: 'grid-',   // prefix for the grid classes
		cookiePrefix: 'hashgrid'// prefix for the cookie name
	};
	var overlayOn = false,
		sticky = false,
		overlayZState = 'B',
		overlayZBackground = -1,
		overlayZForeground = 9999,
		classNumber = 1;

	// Apply options
	if (typeof set == 'object') {
		var k;
		for (k in set) options[k] = set[k];
	}
	else if (typeof set == 'string') {
		options.id = set;
	}

	// Remove any conflicting overlay
	if ($('#' + options.id).length > 0) {
		$('#' + options.id).remove();
	}

	// Create overlay, hidden before adding to DOM
	var overlayEl = $('<div></div>');
	overlayEl
		.attr('id', options.id)
		.css({
			display: 'none',
			'pointer-events': 'none'
		});
	$("body").prepend(overlayEl);
	var overlay = $('#' + options.id);

	// Unless a custom z-index is set, ensure the overlay will be behind everything
	if (overlay.css('z-index') == 'auto') overlay.css('z-index', overlayZBackground);

	// Override the default overlay height with the actual page height
	var pageHeight = parseFloat($(document).height());
	overlay.height(pageHeight);

	// Add the first grid line so that we can measure it
	overlay.append('<div id="' + options.id + '-horiz" class="horiz first-line">');

	// Position off-screen and display to calculate height
	var top = overlay.css("top");
	overlay.css({
		top: "-999px",
		display: "block"
	});

	// Calculate the number of grid lines needed
	var line = $('#' + options.id + '-horiz'),
		lineHeight = line.outerHeight();

	// Hide and reset top
	overlay.css({
		display: "none",
		top: top
	});

	// Break on zero line height
	if (lineHeight <= 0) return true;

	// Add the remaining grid lines
	var i, numGridLines = Math.floor(pageHeight / lineHeight);
	for (i = numGridLines - 1; i >= 1; i--) {
		overlay.append('<div class="horiz"></div>');
	}

	// vertical grid
	overlay.append($('<div class="vert-container"></div>'));
	var overlayVert = overlay.children('.vert-container');
	var gridWidth = overlay.width();
	overlayVert.css({width: gridWidth, position: 'absolute', top: 0});
	overlayVert.append('<div class="vert first-line">&nbsp;</div>');

	// 30 is an arbitrarily large number...
	// can't calculate the margin width properly
	for (i = 0; i < 30; i++) {
		overlayVert.append('<div class="vert">&nbsp;</div>');
	}

	overlayVert.children()
		.height(pageHeight)
		.css({display: 'inline-block'});

	// Check for saved state
	var overlayCookie = readCookie(options.cookiePrefix + options.id);
	if (typeof overlayCookie == 'string') {
		var state = overlayCookie.split(',');
		state[2] = Number(state[2]);
		if ((typeof state[2] == 'number') && !isNaN(state[2])) {
			classNumber = state[2].toFixed(0);
			overlay.addClass(options.classPrefix + classNumber);
		}
		if (state[1] == 'F') {
			overlayZState = 'F';
			overlay.css('z-index', overlayZForeground);
		}
		if (state[0] == '1') {
			overlayOn = true;
			sticky = true;
			showOverlay();
		}
	}
	else {
		overlay.addClass(options.classPrefix + classNumber);
	}

	// Keyboard controls
	$(document).bind('keydown', keydownHandler);
	$(document).bind('keyup', keyupHandler);

	/**
	 * Helpers
	 */

	function getModifier(e) {
		if (options.modifierKey == null) return true; // Bypass by default
		var m = true;
		switch(options.modifierKey) {
			case 'ctrl':
				m = (e.ctrlKey ? e.ctrlKey : false);
				break;

			case 'alt':
				m = (e.altKey ? e.altKey : false);
				break;

			case 'shift':
				m = (e.shiftKey ? e.shiftKey : false);
				break;
		}
		return m;
	}

	function getKey(e) {
		var k = false, c = (e.keyCode ? e.keyCode : e.which);
		// Handle keywords
		if (c == 13) k = 'enter';
		// Handle letters
		else k = String.fromCharCode(c).toLowerCase();
		return k;
	}

	function saveState() {
		createCookie(options.cookiePrefix + options.id, (sticky ? '1' : '0') + ',' + overlayZState + ',' + classNumber, 1);
	}

	function showOverlay() {
		overlay.show();
		overlayVert.css({width: overlay.width()});
		// hide any vertical blocks that aren't at the top of the viewport
		overlayVert.children('.vert').each(function () {
			$(this).css('display','inline-block');
			if ($(this).offset().top > 0) {
				$(this).hide();
			}
		});
	}

	/**
	 * Event handlers
	 */

	function keydownHandler(e) {
		var source = e.target.tagName.toLowerCase();
		if ((source == 'input') || (source == 'textarea') || (source == 'select')) return true;
		var m = getModifier(e);
		if (!m) return true;
		var k = getKey(e);
		if (!k) return true;
		switch(k) {
			case options.showGridKey:
				if (!overlayOn) {
					showOverlay();
					overlayOn = true;
				}
				else if (sticky) {
					overlay.hide();
					overlayOn = false;
					sticky = false;
					saveState();
				}
				break;
			case options.holdGridKey:
				if (overlayOn && !sticky) {
					// Turn sticky overlay on
					sticky = true;
					saveState();
				}
				break;
			case options.foregroundKey:
				if (overlayOn) {
					// Toggle sticky overlay z-index
					if (overlay.css('z-index') == overlayZForeground) {
						overlay.css('z-index', overlayZBackground);
						overlayZState = 'B';
					}
					else {
						overlay.css('z-index', overlayZForeground);
						overlayZState = 'F';
					}
					saveState();
				}
				break;
			case options.jumpGridsKey:
				if (overlayOn && (options.numberOfGrids > 1)) {
					// Cycle through the available grids
					overlay.removeClass(options.classPrefix + classNumber);
					classNumber++;
					if (classNumber > options.numberOfGrids) classNumber = 1;
					overlay.addClass(options.classPrefix + classNumber);
					showOverlay();
					if (/webkit/.test( navigator.userAgent.toLowerCase() )) {
						forceRepaint();
					}
					saveState();
				}
				break;
		}
	}

	function keyupHandler(e) {
		var m = getModifier(e);
		if (!m) return true;
		var k = getKey(e);
		if (!k) return true;
		if ((k == options.showGridKey) && !sticky) {
			overlay.hide();
			overlayOn = false;
		}
	}

	/**
	 * Cookie functions
	 *
	 * By Peter-Paul Koch:
	 * http://www.quirksmode.org/js/cookies.html
	 */
	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		createCookie(name,"",-1);
	}

	/**
	 * Forces a repaint (because WebKit has issues)
	 * http://www.sitepoint.com/forums/showthread.php?p=4538763
	 * http://www.phpied.com/the-new-game-show-will-it-reflow/
	 */
	function forceRepaint() {
		var ss = document.styleSheets[0];
		try {
			ss.addRule('.xxxxxx', 'position: relative');
			ss.removeRule(ss.rules.length - 1);
		} catch(e){}
	}

}


/**
 * You can call hashgrid from your own code, but it's loaded here as
 * an example for your convenience.
 */
$(document).ready(function() {

	var grid = new hashgrid({
		numberOfGrids: 2
	});

});
