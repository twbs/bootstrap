$(function () {
	'use strict';
  
   module('form')
         
   test('inputs and button heights should be the same', function(){
		var templateHTML = '<form>'
			+'<div class="form-group">'
			+'<div class="input-group">'
			+'<div class="input-group-btn">'
			+'<button type="submit" class="btn btn-success btn-lg">?</button>'
			+'</div>'
			+'<input type="text" class="form-control input-lg hidden-print"/>'
			+'</div>'
			+'</div>'
			+'</form>'
		$(templateHTML).appendTo(document.body)
		var $btn = $('.btn-lg').height()
		var $input = $('.input-lg').height()
		equal($btn, $input, "Large buttons and inputs not the same heights")
		$('form').remove()
   })
})