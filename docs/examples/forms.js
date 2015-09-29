
$(document).ready(function() {
	function clickNeighbourInput(event) {
		console.log("clicky");
		$(this).parents('label').find('input').click();
		event.stopPropagation();
	}
	function onFocus() {
		$(this).parents('.form-group, .checkbox > label, .radio > label').addClass('focus');
	}
	function onBlur() {
		$(this).parents('.form-group, .checkbox > label, .radio > label').removeClass('focus');
	}
	function onKeypress(event) {
		if((event.keyCode ? event.keyCode : event.which) == 13) { // Space
			clickNeighbourInput(e);
		}
	}

	var checkReplace =
		$("<button type='button' class='input-replacement'><span class='glyphicon glyphicon-ok'></span></button>"+
		"<span class='disabled-replacement input-replacement'><span><span></span>")
		.keypress(onKeypress)
		.click(clickNeighbourInput)
		.focus(onFocus)
		.blur(onBlur);

	var radioReplace =
		$("<button type='button' class='input-replacement'><span></span></button>"+
		"<span class='disabled-replacement input-replacement'><span><span></span>")
		.keypress(onKeypress)
		.click(clickNeighbourInput)
		.focus(onFocus)
		.blur(onBlur);

	$("select").selectpicker();

	$('.form-group input:checkbox')
		.hide()
		.after(checkReplace);

	$('.form-group input:radio')
		.hide()
		.after(radioReplace);


	$('.form-group input, .form-group select, .form-group .bootstrap-select .btn, .form-group textarea')
		.focus(function() {
			$(this).parents('.form-group').addClass('focus');
		})
		.blur(function() {
			$(this).parents('.form-group').removeClass('focus');
		});

});
