/*
* markdown-editor.js
* 
* Markdown Editor plugin for jQuery.
*/

function markdown2html(text) {
    return markdown.toHTML(text);
}

!function($) {
    var Markdown = function(element, options, commands) {
        this.options = options;
        this.$textarea = $(element);
        if (! this.$textarea.is('textarea')) {
            alert('only textarea can change to markdown!');
            return;
        }
        this.buildMarkdown(commands);
    };

    var TextAreaDelegate = function(the_toolbar, the_textarea, the_preview, options) {
        this.$toolbar = the_toolbar;
        this.$textarea = the_textarea;
        this.$container = the_textarea.parent();
        this.$dom = the_textarea.get(0);
        this.$preview = the_preview;
        this.$options = options;
    };

    TextAreaDelegate.prototype = {

        constructor: TextAreaDelegate,

        enableAllButtons: function(enabled) {
            var btns = this.$toolbar.find('button[data-cmd]');
            if (enabled) {
                btns.removeAttr('disabled');
            }
            else {
                btns.attr('disabled', 'disabled');
            }
        },

        enableButton: function(key, enabled) {
            var btn = this.$toolbar.find('button[data-cmd="' + key + '"]');
            if (enabled) {
                btn.removeAttr('disabled');
            }
            else {
                btn.attr('disabled', 'disabled');
            }
        },

        getText: function() {
            return this.$textarea.val();
        },

        getOption: function(key) {
            return this.$options[key];
        },

        paste: function(s) {
            this.$dom.setRangeText(s);
        },

        getSelection: function() {
            return this.$dom.value.substring(this.$dom.selectionStart, this.$dom.selectionEnd);
        },

        selectCurrentLine: function() {
            var pos = this.getCaretPosition();
            var ss = this.$dom.value.split('\n');
            var start = 0;
            var end = 0;
            for (var i=0; i<ss.length; i++) {
                var s = ss[i];
                if ((start + s.length + 1) > pos) {
                    end = start + s.length;
                    break;
                }
                start += (s.length + 1);
            }
            this.setSelection(start, end);
            return this.getSelection();
        },

        getCaretPosition: function() {
            return this.$dom.selectionStart;
        },

        unselect: function() {
            var p = this.getCaretPosition();
            this.$dom.setSelectionRange(p, p);
        },

        setSelection: function(start, end) {
            this.$dom.setSelectionRange(start, end);
        },

        setCaretPosition: function(pos) {
            this.$dom.setSelectionRange(pos, pos);
        },
    };

    Markdown.prototype = {
        constructor: Markdown,

        applyCss: function() {
            var css = {
                'resize': 'none',
                'font-family': 'Monaco, Menlo, Consolas, "Courier New", monospace',
            };
            $that = this;
            $.map(css, function(v, k) {
                $that.$textarea.css(k, v);
            });
        },

        executeCommand: function(cmd) {
            console.log('Exec: ' + cmd);
            var fn = this.$commands[cmd];
            fn && fn(this.$delegate);
        },

        buildMarkdown: function(commands) {
            $that = this;
            var L = ['<div class="btn-toolbar markdown-toolbar"><div class="btn-group">'];
            $.each(this.options.buttons, function(index, ele) {
                if (ele=='|') {
                    L.push('</div><div class="btn-group">');
                }
                else {
                    $icon = $that.options.icons[ele] || 'icon-star';
                    $tooltip = $that.options.tooltips[ele] || '';
                    if (ele=='heading') {
                        L.push('<button class="btn dropdown-toggle" data-toggle="dropdown" data-cmd="heading" title="' + $tooltip + '"><i class="' + $icon + '"></i> <span class="caret"></span></button>');
                        L.push('<ul class="dropdown-menu">');
                        L.push('<li><a href="javascript:void(0)" data-type="md" data-cmd="heading1"># Heading 1</a></li>');
                        L.push('<li><a href="javascript:void(0)" data-type="md" data-cmd="heading2">## Heading 2</a></li>');
                        L.push('<li><a href="javascript:void(0)" data-type="md" data-cmd="heading3">### Heading 3</a></li>');
                        L.push('<li><a href="javascript:void(0)" data-type="md" data-cmd="heading4">#### Heading 4</a></li>');
                        L.push('<li><a href="javascript:void(0)" data-type="md" data-cmd="heading5">##### Heading 5</a></li>');
                        L.push('<li><a href="javascript:void(0)" data-type="md" data-cmd="heading6">###### Heading 6</a></li>');
                        L.push('</ul>');
                    }
                    else {
                        L.push('<button type="button" data-type="md" data-cmd="' + ele + '" title="' + $tooltip + '" class="btn' + ($icon.indexOf('icon-white')>=0 ? ' btn-info' : '') + '"><i class="' + $icon + '"></i></button>');
                    }
                }
            });
            var tw = this.$textarea.outerWidth() - 2;
            var th = this.$textarea.outerHeight() - 2;
            L.push('</div></div><div class="markdown-preview" style="display:none;padding:0;margin:0;width:' + tw + 'px;height:' + th + 'px;overflow:scroll;background-color:white;border:1px solid #ccc;border-radius:4px"></div>');
            this.$commands = commands;
            this.$textarea.before(L.join(''));
            this.$toolbar = this.$textarea.parent().find('div.markdown-toolbar');
            this.$preview = this.$textarea.parent().find('div.markdown-preview');
            this.$delegate = new TextAreaDelegate(this.$toolbar, this.$textarea, this.$preview, this.options);
            this.$toolbar.find('*[data-type=md]').each(function() {
                $btn = $(this);
                var cmd = $btn.attr('data-cmd');
                $btn.click(function() {
                    $that.executeCommand(cmd);
                });
                try {
                    //$btn.tooltip();
                }
                catch (e) { /* ignore if tooltip.js not exist */}
            });
            this.applyCss();
        },

        showBackdrop: function() {
            if (! this.$backdrop) {
                this.$backdrop = $('<div class="modal-backdrop" />').appendTo(document.body);
            }
        },

        hideBackdrop: function() {
            this.$backdrop && this.$backdrop.remove();
            this.$backdrop = null;
        },
    };

    function setHeading(s, heading) {
        var re = new RegExp('^#{1,6}\\s');
        var h = re.exec(s);
        if (h!=null) {
            s = s.substring(h[0].length);
        }
        return heading + s;
    }

    var commands = {

        heading1: function(delegate) {
            var line = delegate.selectCurrentLine();
            delegate.paste(setHeading(line, '# '));
        },

        heading2: function(delegate) {
            var line = delegate.selectCurrentLine();
            delegate.paste(setHeading(line, '## '));
        },

        heading3: function(delegate) {
            var line = delegate.selectCurrentLine();
            delegate.paste(setHeading(line, '### '));
        },

        heading4: function(delegate) {
            var line = delegate.selectCurrentLine();
            delegate.paste(setHeading(line, '#### '));
        },

        heading5: function(delegate) {
            var line = delegate.selectCurrentLine();
            delegate.paste(setHeading(line, '##### '));
        },

        heading6: function(delegate) {
            var line = delegate.selectCurrentLine();
            delegate.paste(setHeading(line, '###### '));
        },

        bold: function(delegate) {
            var s = delegate.getSelection();
            if (s=='') {
                delegate.paste('****');
                // make cursor to: **|**
                delegate.setCaretPosition(delegate.getCaretPosition() + 2);
            }
            else {
                delegate.paste('**' + s + '**');
            }
        },

        italic: function(delegate) {
            var s = delegate.getSelection();
            if (s=='') {
                delegate.paste('**');
                // make cursor to: *|*
                delegate.setCaretPosition(delegate.getCaretPosition() + 1);
            }
            else {
                delegate.paste('*' + s + '*');
            }
        },

        link: function(delegate) {
            var s = '<div data-backdrop="static" class="modal hide fade"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h3>Hyper Link</h3></div>'
                  + '<div class="modal-body"><form class="form-horizontal"><div class="control-group"><label class="control-label">Text:</label><div class="controls"><input name="text" type="text" value="" /></div></div>'
                  + '<div class="control-group"><label class="control-label">Link:</label><div class="controls"><input name="link" type="text" placeholder="http://" value="" /></div></div>'
                  + '</form></div><div class="modal-footer"><a href="#" class="btn btn-primary">OK</a><a href="#" class="btn" data-dismiss="modal">Close</a></div></div>';
            $('body').prepend(s);
            var $modal = $('body').children(':first');
            var sel = delegate.getSelection();
            if (sel != '') {
                $modal.find('input[name=text]').val(sel);
            }
            $modal.modal('show');
            $modal.find('.btn-primary').click(function() {
                var text = $.trim($modal.find('input[name=text]').val());
                var link = $.trim($modal.find('input[name=link]').val());
                if (link=='') link = 'http://';
                if (text=='') text = link;
                delegate.paste('[' + text + '](' + link + ')');
                $modal.modal('hide');
            });
            $modal.on('hidden', function() {
                $modal.remove();
            });
        },

        email: function(delegate) {
            var s = '<div data-backdrop="static" class="modal hide fade"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h3>Email Address</h3></div>'
                  + '<div class="modal-body"><form class="form-horizontal"><div class="control-group"><label class="control-label">Name:</label><div class="controls"><input name="text" type="text" value="" /></div></div>'
                  + '<div class="control-group"><label class="control-label">Email:</label><div class="controls"><input name="email" type="text" placeholder="email@example.com" value="" /></div></div>'
                  + '</form></div><div class="modal-footer"><a href="#" class="btn btn-primary">OK</a><a href="#" class="btn" data-dismiss="modal">Close</a></div></div>';
            $('body').prepend(s);
            var $modal = $('body').children(':first');
            var sel = delegate.getSelection();
            if (sel != '') {
                $modal.find('input[name=text]').val(sel);
            }
            $modal.modal('show');
            $modal.find('.btn-primary').click(function() {
                var text = $.trim($modal.find('input[name=text]').val());
                var email = $.trim($modal.find('input[name=email]').val());
                if (email=='') email = 'email@example.com';
                if (text=='') text = email;
                delegate.paste('[' + text + '](' + email + ')');
                $modal.modal('hide');
            });
            $modal.on('hidden', function() {
                $modal.remove();
            });
        },

        image: function(delegate) {
            var getObjectURL = function(file) {
                var url = '';
                if (window.createObjectURL!=undefined) // basic
                    url = window.createObjectURL(file);
                else if (window.URL!=undefined) // mozilla(firefox)
                    url = window.URL.createObjectURL(file);
                else if (window.webkitURL!=undefined) // webkit or chrome
                    url = window.webkitURL.createObjectURL(file);
                return url;
            };
            var s = '<div data-backdrop="static" class="modal hide fade"><div class="modal-header"><button type="button" class="close">&times;</button><h3>Insert Image</h3></div>'
                  + '<div class="modal-body"><div style="width:530px;"><div class="alert alert-error hide"></div><div class="row">'
                  + '<div class="span" style="width:230px"><div>Preview:</div><div class="preview" style="width:200px;height:150px;border:solid 1px #ccc;padding:4px;margin-top:5px;background-repeat:no-repeat;background-position:center center;background-size:cover;"></div></div>'
                  + '<div class="span" style="width:300px"><form>'
                  + '<label>Text:</label><input name="text" type="text" value="" />'
                  + '<label>File:</label><input name="file" type="file" />'
                  + '<label>Progress:</label><div class="progress progress-striped active" style="width:220px; margin-top:6px;margin-bottom:6px"><div class="bar" style="width:0%;"></div></div>'
                  + '</form></div>'
                  + '</div></div></div><div class="modal-footer"><button class="btn btn-primary">OK</button> <button class="btn btn-cancel">Close</button></div></div>';
            $('body').prepend(s);
            var $modal = $('body').children(':first');
            var $form = $modal.find('form');
            var $text = $modal.find('input[name="text"]');
            var $file = $modal.find('input[name="file"]');
            var $prog = $modal.find('div.bar');
            var $preview = $modal.find('div.preview');
            var $alert = $modal.find('div.alert');
            var $status = { 'uploading': false };
            $modal.modal('show');
            $file.change(function() {
                // clear error:
                $alert.removeClass('alert-error').hide();
                var f = $file.val();
                if (!f) {
                    $preview.css('background-image', '');
                    return;
                }
                var lf = $file.get(0).files[0];
                var ft = lf.type;
                if (ft=='image/png' || ft=='image/jpeg' || ft=='image/gif') {
                    $preview.css('background-image', 'url(' + getObjectURL(lf) + ')');
                    if ($text.val()=='') {
                        // extract filename without ext:
                        var pos = Math.max(f.lastIndexOf('\\'), f.lastIndexOf('/'));
                        if (pos>0) {
                            f = f.substring(pos + 1);
                        }
                        var pos = f.lastIndexOf('.');
                        if (pos>0) {
                            f = f.substring(0, pos);
                        }
                        $text.val(f);
                    }
                }
                else {
                    $preview.css('background-image', '');
                    $alert.text('Not a valid web image.').show();
                }
            });
            var cancel = function() {
                if ($status.uploading) {
                    if ( ! confirm('File is uploading, are you sure you want to cancel it?')) {
                        return;
                    }
                    if ($status.uploading) {
                        $status.xhr.abort();
                    }
                }
                $modal.modal('hide');
            };
            $modal.find('button.close').click(cancel);
            $modal.find('button.btn-cancel').click(cancel);
            $modal.find('.btn-primary').click(function() {
                // clear error:
                $alert.removeClass('alert-error').hide();
                // upload file:
                var f = $file.val();
                if (!f) {
                    $alert.text('Please select file.').addClass('alert-error').show();
                    return;
                }
                var $url = delegate.getOption('upload_image_url');
                if (!$url) {
                    $alert.text('upload_image_url not defined.').addClass('alert-error').show();
                    return;
                }
                try {
                    var text = $text.val();
                    var lf = $file.get(0).files[0];
                    // send XMLHttpRequest2:
                    var fd = null;
                    var form = $form.get(0);
                    try {
                        fd = form.getFormData();
                    }
                    catch(e) {
                        fd = new FormData(form);
                    }
                    var xhr = new XMLHttpRequest();
                    xhr.upload.addEventListener('progress', function(evt) {
                        if (evt.lengthComputable) {
                            var percent = evt.loaded * 100.0 / evt.total;
                            $prog.css('width', percent.toFixed(1) + '%');
                        }
                    }, false);
                    xhr.addEventListener('load', function(evt) {
                        var r = $.parseJSON(evt.target.responseText);
                        if (r.error) {
                            $alert.addClass('alert-error').text(r.message || r.error).show();
                            $status.uploading = false;
                        }
                        else {
                            // upload ok!
                            delegate.unselect();
                            var s = '\n![' + text.replace('[', '').replace(']', '') + '](' + r.url + ')\n';
                            delegate.paste(s);
                            delegate.setSelection(delegate.getCaretPosition() + 1, delegate.getCaretPosition() + s.length - 1);
                            $modal.modal('hide');
                        }
                    }, false);
                    xhr.addEventListener('error', function(evt) {
                        $alert.addClass('alert-error').text('Error: upload failed.').show();
                        $status.uploading = false;
                    }, false);
                    xhr.addEventListener('abort', function(evt) {
                        $status.uploading = false;
                    }, false);
                    xhr.open('post', $url);
                    xhr.send(fd);
                    $status.uploading = true;
                    $status.xhr = xhr;
                    $file.attr('disabled', 'disabled');
                }
                catch(e) {
                    $alert.addClass('alert-error').text('Could not upload.').show();
                }
                $(this).attr('disabled', 'disabled');
            });
            $modal.on('hidden', function() {
                $modal.remove();
            });
        },

        preview: function(delegate) {
            if ( ! delegate.is_preview) {
                delegate.is_preview = true;
                delegate.enableAllButtons(false);
                delegate.enableButton('preview', true);
                delegate.$textarea.hide();
                delegate.$preview.html('<div style="padding:3px;">' + markdown2html(delegate.$textarea.val()) + '</div>').show();
            }
            else {
                delegate.is_preview = false;
                delegate.enableAllButtons(true);
                delegate.$preview.html('').hide();
                delegate.$textarea.show();
            }
        },

        fullscreen: function(delegate) {
            if ( ! delegate.is_full_screen) {
                delegate.is_full_screen = true;
                delegate.enableButton('preview', false);
                // z-index=1040, on top of navbar, but on bottom of other modals:
                var s = '<div data-backdrop="false" class="modal hide" style="z-index:1040;top:0;left:0;margin-left:0;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;">'
                      + '<div class="left" style="margin:0;padding:0 2px 2px 2px;float:left;"></div><div class="right" style="float:left;padding:0;margin:0;border-left:solid 1px #ccc;overflow:scroll;"></div>'
                      + '</div>';
                $('body').prepend(s);
                var $modal = $('body').children(':first');
                var $left = $modal.find('div.left');
                var $right = $modal.find('div.right');
                $modal.modal('show');
                delegate.$fullscreen = $modal;
                delegate.$toolbar.appendTo($left);
                delegate.$textarea.appendTo($left);
                // store old width and height for textarea:
                delegate.$textarea_old_width = delegate.$textarea.css('width');
                delegate.$textarea_old_height = delegate.$textarea.css('height');
                // bind resize:
                delegate.$fn_resize = function() {
                    var w = $(window).width();
                    var h = $(window).height();
                    if (w<960) { w = 960; }
                    if (h<300) { h = 300; }
                    console.log('resize to: ' + w + ', ' + h);
                    var rw = parseInt(w / 2);
                    var $dom = delegate.$fullscreen;
                    $dom.css('width', w + 'px');
                    $dom.css('height', h + 'px');
                    $dom.find('div.right').css('width', (rw - 1) + 'px').css('height', h + 'px');
                    $dom.find('div.left').css('width', (w - rw - 4) + 'px').css('height', h + 'px');
                    delegate.$textarea.css('width', (w - rw - 18) + 'px').css('height', (h - 64) + 'px');
                };
                $(window).bind('resize', delegate.$fn_resize).trigger('resize');
                $right.html(markdown2html(delegate.getText()));
                // bind text change:
                delegate.$n_wait_for_update = 0;
                delegate.$b_need_update = false;
                delegate.$fn_update_count = function() {
                    if (delegate.$b_need_update && delegate.$n_wait_for_update > 10) {
                        delegate.$b_need_update = false;
                        delegate.$n_wait_for_update = 0;
                        $right.html(markdown2html(delegate.getText()));
                    }
                    else {
                        delegate.$n_wait_for_update ++;
                    }
                };
                setInterval(delegate.$fn_update_count, 100);
                delegate.$fn_keypress = function() {
                    console.log('Keypress...');
                    delegate.$b_need_update = true; // should update in N seconds
                    delegate.$n_wait_for_update = 0; // reset count from 0
                };
                delegate.$textarea.bind('keypress', delegate.$fn_keypress);
            }
            else {
                // unbind:
                delegate.$textarea.unbind('keypress', delegate.$fn_keypress);
                $(window).unbind('resize', delegate.$fn_resize);
                delegate.$fn_keypress = null;
                delegate.$fn_resize = null;
                delegate.$fn_update_count = null;

                delegate.is_full_screen = false;
                delegate.enableButton('preview', true);
                delegate.$toolbar.appendTo(delegate.$container);
                delegate.$preview.appendTo(delegate.$container);
                delegate.$textarea.appendTo(delegate.$container);
                delegate.$fullscreen.modal('hide');
                delegate.$fullscreen.remove();
                // restore width & height:
                delegate.$textarea.css('width', delegate.$textarea_old_width).css('height', delegate.$textarea_old_height);
            }
        },

    };

    $.fn.markdown = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('markdown');
            var options = $.extend({}, $.fn.markdown.defaults, typeof option == 'object' && option);
            if (!data) {
                data = new Markdown(this, options, commands);
                $this.data('markdown', data);
            }
        });
    };

    $.fn.markdown.defaults = {
        buttons: [
            'heading',
            '|',
            'bold', 'italic', 'ul', 'quote',
            '|',
            'link', 'email',
            '|',
            'image', 'video',
            '|',
            'preview',
            '|',
            'fullscreen',
        ],
        tooltips: {
            'heading': 'Set Heading',
            'bold': 'Bold',
            'italic': 'Italic',
            'ul': 'Unordered List',
            'quote': 'Quote',
            'link': 'Insert URL',
            'email': 'Insert email address',
            'image': 'Insert image',
            'video': 'Insert video',
            'preview': 'Preview content',
            'fullscreen': 'Fullscreen mode',
        },
        icons: {
            'heading': 'icon-font',
            'bold': 'icon-bold',
            'italic': 'icon-italic',
            'ul': 'icon-list',
            'quote': 'icon-comment',
            'link': 'icon-globe',
            'email': 'icon-envelope',
            'image': 'icon-picture',
            'video': 'icon-facetime-video',
            'preview': 'icon-eye-open',
            'fullscreen': 'icon-fullscreen icon-white',
        },
        upload_image_url: '',
        upload_file_url: '',
    };

    $.fn.markdown.Constructor = Markdown;

}(window.jQuery);
