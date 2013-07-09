/*!
* postjson jquery plugin
*/

// $.postJSON('/api/name', { data: 123 }, function() { alert('ok'); }, function(err) {}, function() { alert('complete.'); });
$.extend({
    postJSON: function(url, data, fn_success, fn_error, fn_always) {
        return jQuery.ajax({
            type: 'POST',
            url: url,
            data: data,
            dataType: 'json'
        }).done(function(data) {
            if (data && data.error) {
                if (fn_error) {
                    fn_error(data);
                }
            }
            else {
                if (fn_success) {
                    fn_success(data);
                }
            }
        }).fail(function(jqXHR, textStatus) {
            if (fn_error) {
                fn_error({'error': 'HTTP ' + jqXHR.status, 'message': ' Network error (HTTP ' + jqXHR.status + ')'});
            }
        }).always(function() {
            if (fn_always) {
                fn_always();
            }
        });
    }
});
