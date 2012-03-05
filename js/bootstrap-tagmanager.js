/*


*/

(function (jQuery) {
   var SourceArray = ["Lombardia", "Abruzzo", "Toscana", "Liguria"];
   var SourceAjaxArray = new Array();

   var delimeters = new Array();
   var backspace = new Array();
   var inputObj = null;
   var tagList = new Array();
   var tagLiID = new Array();
   var lastTagId = 0;
   var hiddenTagList = null;

   var tagManagerOptions = null;

   inputObj = this;

   jQuery.fn.trimTag = function (tag) {
      var txt = jQuery.trim(tag);

      var l = txt.length;
      var t = 0;

      //          console.log(
      //                "tag to trim : " + txt
      //              );
      //remove from end
      for (var i = l - 1; i >= 0; i--) {
         //            console.log(
         //                "char to evaluate : " + txt[i] + " (" + txt.charCodeAt(i) + ")"
         //              );
         if (-1 != jQuery.inArray(txt.charCodeAt(i), delimeters)) {
            //              console.log(
            //                "char to remove from end: " + txt[i]
            //              );
            t++;
         } else
            break;
      }
      txt = txt.substring(0, l - t);
      l = txt.length;
      t = 0;
      //remove from head
      for (var i = 0; i < l; i++) {
         //            console.log(
         //                "char to evaluate : " + txt[i] + " (" + txt.charCodeAt(i) + ")"
         //              );
         if (-1 != jQuery.inArray(txt.charCodeAt(i), delimeters)) {
            //              console.log(
            //                "char to remove from head: " + txt[i]
            //              );
            t++;
         } else
            break;
      }

      txt = txt.substring(t, l);
      //          console.log(
      //                "trimmed to : " + txt
      //              );

      return txt;
   };

   jQuery.fn.setupTypeahead = function (tag) {
      var obj = jQuery(this);

      if (tagManagerOptions.typeaheadSource != null) {
         obj.typeahead();
         obj.data('active', true);
         obj.data('typeahead').source = tagManagerOptions.typeaheadSource;
         obj.data('active', false);
      } else if (tagManagerOptions.typeaheadAjaxSource != null) {
         obj.typeahead();
         jQuery.getJSON(tagManagerOptions.typeaheadAjaxSource, function (data) {
            if (data != undefined && data.tags != undefined) {
               //SourceAjaxArray.clear();
               jQuery.each(data.tags, function (key, val) {
                  var a = 1;
                  //jQuery('#addexpenses select[name="who"]').append('<option value="' + val.who + '">' + val.name + '</option>');
                  SourceAjaxArray.push(val.tag);
                  //obj.attr("data-sources", SourceArray);
                  obj.data('active', true);
                  obj.data('typeahead').source = SourceAjaxArray;
                  obj.data('active', false);
                  //obj.attr("data-sources", SourceAjaxArray.join(", "));
               });
            }
         });
      }
   };

   jQuery.fn.refreshHiddenTagList = function (robj) {
      var obj;
      if (robj == null)
         obj = jQuery(this);
      else
         obj = robj;

      if (hiddenTagList == null || hiddenTagList == undefined) {
         var lhiddenTagList = obj.siblings("input[name='hiddenTagList']");
         if (lhiddenTagList != null && lhiddenTagList != undefined && lhiddenTagList[0] != undefined)
            hiddenTagList = lhiddenTagList[0];
         else {
            html = "";
            html += "<input name='hiddenTagList' type='hidden' value=''/>";
            obj.before(html);
            lhiddenTagList = obj.siblings("input[name='hiddenTagList']");
            if (lhiddenTagList != null && lhiddenTagList != undefined && lhiddenTagList[0] != undefined)
               hiddenTagList = lhiddenTagList[0];
         }
      }
      if (hiddenTagList != null || hiddenTagList != undefined && lhiddenTagList[0] != undefined) {
         jQuery(hiddenTagList).val(tagList.join(","));
      }
   };

   jQuery.fn.spliceTag = function (TagId) {
      console.log(
              "TagIdToRemove: " + TagId
            );
      var p = jQuery.inArray(TagId, tagLiID)
      console.log(
              "position: " + p
            );
      if (-1 != p) {
         jQuery("#myTag_" + TagId).remove();
         tagList.splice(p, 1);
         tagLiID.splice(p, 1);
         jQuery(inputObj).refreshHiddenTagList();
         console.log(tagList);
      }
   };

   jQuery.fn.popTag = function (robj) {
      var obj;
      if (robj == null)
         obj = jQuery(this);
      else
         obj = robj;

      if (tagLiID.length > 0) {
         var TagId = tagLiID.pop();
         tagList.pop();
         console.log(
              "TagIdToRemove: " + TagId
            );
         jQuery("#myTag_" + TagId).remove();
         jQuery(obj).refreshHiddenTagList();
         console.log(tagList);
      }
   };

   jQuery.fn.pushTag = function (tag, robj) {
      if (!tag || tag.length <= 0) {
         return;
      }
      if (tagManagerOptions.CapitalizeFirstLetter && tag.length > 1) {
         tag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
      }

      var obj;
      if (robj == null)
         obj = jQuery(this);
      else
         obj = robj;

      var alreadyInList = false;
      var p = jQuery.inArray(tag, tagList);
      if (-1 != p) {
         console.log(
                "tag:" + tag + " !!already in list!!"
              );
         alreadyInList = true;
      }

      if (alreadyInList) {
         var pTagId = tagLiID[p];
         jQuery("#myTag_" + pTagId).stop().animate({ backgroundColor: tagManagerOptions.blinkBGColor_1 }, 100).animate({ backgroundColor: tagManagerOptions.blinkBGColor_2 }, 100).animate({ backgroundColor: tagManagerOptions.blinkBGColor_1 }, 100).animate({ backgroundColor: tagManagerOptions.blinkBGColor_2 }, 100).animate({ backgroundColor: tagManagerOptions.blinkBGColor_1 }, 100).animate({ backgroundColor: tagManagerOptions.blinkBGColor_2 }, 100);
      } else {
         var TagId = lastTagId++;
         tagList.push(tag);
         tagLiID.push(TagId);

         var html = '';
         html += '<span class="myTag" id="myTag_' + TagId + '"><span>' + tag + '&nbsp;&nbsp;</span><a href="#" class="myTagRemover" id="myRemover_' + TagId + '" TagIdToRemove="' + TagId + '" title="Removing tag">x</a></span>';
         console.log(
              "tagList: " + tagList
            );
         obj.before(html);
         jQuery("#myRemover_" + TagId).on("click", function (e) {
            var TagIdToRemove = parseInt(jQuery(this).attr("TagIdToRemove"));
            jQuery(this).spliceTag(parseInt(jQuery(this).attr("TagIdToRemove")));
         });

         obj.refreshHiddenTagList(obj);

      }
      obj.val("");

   };

   jQuery.fn.tagsManager = function (options) {
      tagManagerOptions = {
         prefilled: null,
         CapitalizeFirstLetter: true,
         preventSubmitOnEnter: true,
         typeahead: false,
         typeaheadAjaxSource: null,
         typeaheadSource: null,
         delimeters: [44, 188, 13],
         backspace: [8]
      };
      jQuery.extend(tagManagerOptions, options);

      var obj = jQuery(this);

      delimeters = tagManagerOptions.delimeters;
      backspace = tagManagerOptions.backspace;
      hiddenTagList = null;

      if (lastTagId > 0) {
         while (lastTagId > 0) {
            obj.popTag(obj);
            lastTagId--;
         }
      }

      if (tagManagerOptions.typeahead) {
         obj.setupTypeahead();
         //obj.typeahead({ source: SourceArray })
      }

      // disable submit on enter for this input field
      obj.on("focus", function (e) {
         if (jQuery(this).popover) {
            jQuery(this).popover("hide");
            //jQuery(this).popover = null;
         }
      });

      obj.on("keypress", function (e) {
         if (jQuery(this).popover) {
            jQuery(this).popover("hide");
            //jQuery(this).popover = null;
         }
         if (tagManagerOptions.preventSubmitOnEnter) {
            if (e.which == 13) {
               e.cancelBubble = true;
               e.returnValue = false;
               e.stopPropagation();
               e.preventDefault();
               //e.keyCode = 9;
            }
         }
      });

      obj.on("keyup", function (e) {
         var p = jQuery.inArray(e.which, delimeters);
         if (-1 != p) {
            //user just entered a valid delimeter
            var user_input = jQuery(this).val(); //user_input = jQuery().inArray(delimeters[p]);
            user_input = jQuery(this).trimTag(user_input);
            jQuery(this).pushTag(user_input);
         }
      });

      obj.on("keydown", function (e) {
         var p = jQuery.inArray(e.which, backspace);
         if (-1 != p) {
            //user just entered backspace or equivalent
            var user_input = jQuery(this).val(); //user_input = jQuery().inArray(delimeters[p]);
            var i = user_input.length;
            if (i <= 0) {
               console.log(
                  "backspace detected"
                );
               jQuery(this).popTag();
            }
         }
      });

      if (!tagManagerOptions.typeahead) {
         obj.on("blur", function (e) {
            //lost focus
            var user_input = jQuery(this).val(); //user_input = jQuery().inArray(delimeters[p]);
            user_input = jQuery(this).trimTag(user_input);
            jQuery(this).pushTag(user_input);
         });
      }

      if (tagManagerOptions.prefilled != null) {
         if (typeof (tagManagerOptions.prefilled) == "object") {
            var pta = tagManagerOptions.prefilled;
            jQuery.each(pta, function (key, val) {
               var a = 1;
               obj.pushTag(val, obj);
            });
         } else if (typeof (tagManagerOptions.prefilled) == "string") {
            var pta = tagManagerOptions.prefilled.split(',');

            jQuery.each(pta, function (key, val) {
               var a = 1;
               obj.pushTag(val, obj);
            });

         }
      }

   }
})(jQuery);
