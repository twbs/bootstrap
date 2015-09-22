/*
 * Translated default messages for bootstrap-select.
 * Locale: KO (Korean)
 * Region: KR (South Korea)
 */
(function ($) {
  $.fn.selectpicker.defaults = {
    noneSelectedText: '항목을 선택해주세요',
    noneResultsText: '{0} 검색 결과가 없습니다',
    countSelectedText: function (numSelected, numTotal) {
      return "{0}개를 선택하였습니다";
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        '{n}개까지 선택 가능합니다',
        '해당 그룹은 {n}개까지 선택 가능합니다'
      ];
    },
    selectAllText: '전체선택',
    deselectAllText: '전체해제',
    multipleSeparator: ', '
  };
})(jQuery);
