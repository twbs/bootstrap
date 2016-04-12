 // Checkbox classes 
+function ($) {
$(document).ready(function() {
         $(".check-hide input:checked").parent().remove()
         $(".check-strike input:checked").next().css( "text-decoration", "line-through" )
});
$(document).on('click',function() {
         $(".check-hide input:checked").parent().fadeOut('slow')
         $(".check-strike input:checked").next().css( "text-decoration", "line-through" )
         $(".check-strike input:checkbox:not(:checked)").next().css( "text-decoration", "none" )
})
}(jQuery);