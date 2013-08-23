var TWBSClipboard

TWBSClipboard = new ((function() {

  function _Class() {
    var _this = this
    this.value = ""
    $(document).keydown(function(e) {
      var _ref, _ref1
      if (!_this.value || !(e.ctrlKey || e.metaKey)) {
        return
      }
      if ($(e.target).is("input:visible,textarea:visible")) {
        return
      }
      if (typeof window.getSelection === "function" ? (_ref = window.getSelection()) != null ? _ref.toString() : void 0 : void 0) {
        return
      }
      if ((_ref1 = document.selection) != null ? _ref1.createRange().text : void 0) {
        return
      }

      var $clipboardContainer = $("#glyphicon-clipboard-container")
      $clipboardContainer.empty().show()
      return $("<textarea id='glyphicon-clipboard'></textarea>").val(_this.value).appendTo($clipboardContainer).focus().select()
    })
    $(document).keyup(function(e) {
      if ($(e.target).is("#glyphicon-clipboard")) {
        return $("#glyphicon-clipboard-container").empty().hide()
      }
    })
  }

  _Class.prototype.set = function(value) {
    this.value = value
  }

  return _Class

})())


!function ($) {

  $(function(){

    var copyKey = navigator.platform.indexOf("Mac") != -1 ? "Cmd" : "Ctrl"

    $(".bs-glyphicons li").mouseenter(function() {
      var span = $(this).children("span").clone().wrap('<div>').parent().html()
      TWBSClipboard.set(span)
    }).tooltip({
      title: copyKey+"+C to Copy",
      delay: { show: 800, hide: 100 }
    })

  })

}(window.jQuery)