/* ========================================================================
* Bootstrap: tablesort.js v3.0.0
* http://twbs.github.com/bootstrap/javascript.html#tablesort
* ========================================================================
* Copyright 2013 Twitter, Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ======================================================================== */


+function ($) { "use strict";

  // TABLESORT CLASS DEFINITION
  // ======================

  var Selector = '[data-sort="true"]'
  var Tablesort = function (el) {
    $(el).on('click', Selector, this.sort)
  }

  Tablesort.prototype.sort = function (e) {
	var $this = $(this)
	var sorted = $this.attr('data-sorting')
	var sorting = "DESC";
	
	if(sorted){
		if(sorted == "DESC"){
			sorting = "ASC";
		}
	}
	
	$this.attr("data-sorting", sorting);
	
	var Table = $this.closest("table");
	
	var TH = [];
	var TD = [];

	$("thead th", Table).each(function(index, item){
		var arrayItem = {};
		arrayItem[0] = $(item).html();
		arrayItem[1] = $(item).attr('data-sort');
		if($(item).attr('data-sorting')){
			arrayItem[2] = $(item).attr('data-sorting');
		}else{
			arrayItem[2] = "DESC";
		}
		TH[index] = arrayItem;
	});
	$("tbody tr", Table).each(function(i, it){
		var arrayItem = {};
		$("td", $(this)).each(function(index, item){
			arrayItem[index] = $(item).html();
		});
		TD[i] = arrayItem;
	});

	
	for (var i=0;i<TH.length;i++){
		if(TH[i][1] == "true"){
			$(".debug").append("Sorting by "+TH[i][0]+" "+TH[i][2]+"<br>");
			
			TD.sort(function(a,b) {
			
				var d1p = a[i].split(".");
				var d2p = b[i].split(".");
				

				var d1 = new Date(d1p[2], (d1p[1] - 1), d1p[0]);
				var d2 = new Date(d2p[2], (d2p[1] - 1), d2p[0]);

				if(d1 != "Invalid Date" && d2 != "Invalid Date"){
					if (d1 < d2) return -1;
					if (d1 > d2) return 1;
				}else{
					if (a[i] < b[i]) return -1;
					if (a[i] > b[i]) return 1;
				}
				return 0;
			});
			if(TH[i][2] == "DESC"){
				TD.reverse();
			}
		}
	}
	
	Table.html("<thead></thead><tbody></tbody>");
	var Thead = $("thead", Table);
	var Tbody = $("tbody", Table);
	
	var toAppend = "<tr>";
	for (var i=0;i<TH.length;i++){
		Thead.each(function() {
			var tsort = "";
			var tsorting = "";
			if(TH[i][1] == "true"){
				tsort = " data-sort=\"true\" ";
			}
			if(TH[i][2] == "DESC" || TH[i][2] == "ASC"){
				tsorting = " data-sorting=\""+TH[i][2]+"\" ";
			}
			toAppend += "<th"+tsort+tsorting+">"+TH[i][0]+"</th>";
		});
	}
	toAppend += "</tr>";
	Thead.append(toAppend);
	
	var jsonstr_td = JSON.stringify(TD);
	
	
	var json_td = jQuery.parseJSON(jsonstr_td);
	jQuery.each(json_td, function(_index1, _itemData1) {
		toAppend = "<tr>";
		jQuery.each(_itemData1, function(_index2, _itemData2) {
			toAppend += "<td>"+_itemData2+"</td>";
		});
		toAppend += "</tr>";
		Tbody.append(toAppend);
	});

	
  }


  // TABLESORT PLUGIN DEFINITION
  // =======================

  var old = $.fn.tablesort

  $.fn.tablesort = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data = $this.data('bs.tablesort')

      if (!data) $this.data('bs.tablesort', (data = new Tablesort(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.tablesort.Constructor = Tablesort


  // TABLESORT NO CONFLICT
  // =================

  $.fn.tablesort.noConflict = function () {
    $.fn.tablesort = old
    return this
  }


  // TABLESORT DATA-API
  // ==============

  $(document).on('click.bs.tablesort.data-api', Selector, Tablesort.prototype.sort)

}(window.jQuery);
