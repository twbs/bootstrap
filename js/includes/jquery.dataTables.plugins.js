jQuery.fn.dataTableExt.oApi.fnSetFilteringDelay = function ( oSettings, iDelay ) {
    /*
     * Type:        Plugin for DataTables (www.datatables.net) JQuery plugin.
     * Name:        dataTableExt.oApi.fnSetFilteringDelay
     * Version:     2.2.1
     * Description: Enables filtration delay for keeping the browser more
     *              responsive while searching for a longer keyword.
     * Inputs:      object:oSettings - dataTables settings object
     *              integer:iDelay - delay in miliseconds
     * Returns:     JQuery
     * Usage:       $('#example').dataTable().fnSetFilteringDelay(250);
     * Requires:      DataTables 1.6.0+
     *
     * Author:      Zygimantas Berziunas (www.zygimantas.com) and Allan Jardine (v2)
     * Created:     7/3/2009
     * Language:    Javascript
     * License:     GPL v2 or BSD 3 point style
     * Contact:     zygimantas.berziunas /AT\ hotmail.com
     */
    var
        _that = this,
        iDelay = (typeof iDelay == 'undefined') ? 250 : iDelay;
    
    this.each( function ( i ) {
        $.fn.dataTableExt.iApiIndex = i;
        var
            $this = this, 
            oTimerId = null, 
            sPreviousSearch = null,
            anControl = $( 'input', _that.fnSettings().aanFeatures.f );
        
            anControl.unbind( 'keyup' ).bind( 'keyup', function() {
            var $$this = $this;

            if (sPreviousSearch === null || sPreviousSearch != anControl.val()) {
                window.clearTimeout(oTimerId);
                sPreviousSearch = anControl.val();  
                oTimerId = window.setTimeout(function() {
                    $.fn.dataTableExt.iApiIndex = i;
                    _that.fnFilter( anControl.val() );
                }, iDelay);
            }
        });
        
        return this;
    } );
    return this;
}
