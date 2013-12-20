$(document).ready(function() {
  $('#list').click(function(){
    $('#grid-list-switcher .item').addClass('list-view-item')
  })
  $('#grid').click(function(){
    $('#grid-list-switcher .item').removeClass('list-view-item')
  })
})