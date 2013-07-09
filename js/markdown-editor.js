/*
* markdown-editor.js
* 
* Markdown Editor plugin for jQuery.
*/

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

    var TextAreaDelegate = function(element) {
        this.$dom = element;
    };

    TextAreaDelegate.prototype = {

        constructor: TextAreaDelegate,

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
            var L = ['<div class="btn-toolbar"><div class="btn-group">'];
            $.each(this.options.buttons, function(index, ele) {
                if (ele=='|') {
                    L.push('</div><div class="btn-group">');
                }
                else {
                    $icon = $that.options.icons[ele] || 'icon-star';
                    $tooltip = $that.options.tooltips[ele] || '';
                    if (ele=='heading') {
                        L.push('<button class="btn dropdown-toggle" data-toggle="dropdown" title="' + $tooltip + '"><i class="' + $icon + '"></i> <span class="caret"></span></button>');
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
            L.push('</div></div>');
            this.$commands = commands;
            this.$delegate = new TextAreaDelegate(this.$textarea.get(0));
            this.$textarea.before(L.join(''));
            this.$textarea.prev().find('*[data-type=md]').each(function() {
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
            this.$textarea.keypress(function() {
                console.log('TEXTAREA:keypress.');
            });
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
            var s = '<div class="modal hide fade"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h3>Hyper Link</h3></div>'
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
                $modal.attr('result', 'ok');
                $modal.modal('hide');
            });
            $modal.on('hidden', function() {
                if ($modal.attr('result')) {
                    var text = $modal.find('input[name=text]').val();
                    var link = $modal.find('input[name=link]').val();
                    delegate.paste('[' + text + '](' + link + ')');
                }
                $modal.remove();
            });
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
        }
    };

    $.fn.markdown.Constructor = Markdown;

}(window.jQuery);
