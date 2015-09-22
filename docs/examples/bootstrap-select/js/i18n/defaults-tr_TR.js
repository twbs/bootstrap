/*
 * Translated default messages for bootstrap-select.
 * Locale: TR (Turkey)
 * Region: TR (Europe)
 * Author: Serhan Güney
 */
(function ($) {
  $.fn.selectpicker.defaults = {
    noneSelectedText: 'Hiçbiri seçilmedi',
    noneResultsText: 'Hiçbir sonuç bulunamadı {0}',
    countSelectedText: function (numSelected, numTotal) {
      return (numSelected == 1) ? "{0} öğe seçildi" : "{0} öğe seçildi";
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        (numAll == 1) ? 'Limit aşıldı (maksimum {n} sayıda öğe )' : 'Limit aşıldı (maksimum {n} sayıda öğe)',
        (numGroup == 1) ? 'Grup limiti aşıldı (maksimum {n} sayıda öğe)' : 'Grup limiti aşıldı (maksimum {n} sayıda öğe)'
      ];
    },
    selectAllText: 'Tümünü Seç',
    deselectAllText: 'Seçiniz',
    multipleSeparator: ', '
  };
})(jQuery);
