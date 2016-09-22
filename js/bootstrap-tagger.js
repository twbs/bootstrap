/*
 * tagger.js v0.1
 * jQuery plugin for tag management integrated with Twitter Bootstrap.
 *  
 * Licensed under MIT license
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright (c) 2012 Antonio Santiago
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
 * IN THE SOFTWARE.
 */
(function($, window, document, undefined) {

    //
    // Plugin name variable
    //
    var pluginName = 'tagger';

    //
    // The actual plugin constructor
    //
    function Plugin(element, options) {
        this.el = element;
        this.$el = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, options);

        this.tagList = {};  // The tag list
        this.tagger = null; // The root element
        this.tagsElement = null;    // Store the list of tags
        this.addIcon = null;    // Icon to show the form
        this.form = null;   // The form to add more tags
        this.inputElement = null; // Input element where to write tags
        this.buttonOk = null;   // Button to add more tags

        // Initialize the plugin instance
        this.init();
    }

    //
    // Plugin prototype
    //
    Plugin.prototype = {
        //
        // Initialize the plugin instance
        //
        init: function() {
            // Hide the element
            this.$el.css('display', 'none');
            // Create the tagger plugin elments
            this.tagger = $('<div />').addClass('tagger inline clear');
            this.tagsElement = $('<span/>').addClass('inline tagger-tag-list');
            this.tagger.append(this.tagsElement);
            this.$el.after(this.tagger);

            // Add initial tags specified in the input element
            if (this.$el.val()) {
                this.tags(this.$el.val());
            }

            // Create form elements if we are not in readOnly mode
            if (!this.options.readOnly) {

                // Create the icon to add new tags and register a click event listener
                this.addIcon = $('<i class="icon-plus"></i>');
                this.addIcon.on('click.' + pluginName, $.proxy(function() {
                    this._showForm();
                }, this));
                // Create the form
                this.form = $('<span/>').addClass('tagger-form form-inline control-group');
                // Create the input element and register a listener for the keyup event
                this.inputElement = $('<input type="text" class="input-small" placeholder="Add tags...">');
                this.inputElement.on('keyup.' + pluginName, $.proxy(function(event) {
                    this._inputKeyupHandler(event);
                }, this));
                // Create the OK button and register a click event listener
                this.buttonOk = $('<button class="btn btn-primary" disabled><i class="icon-ok icon-white"></i></button>');
                this.buttonOk.on('click.' + pluginName, $.proxy(function() {
                    var tags = this.inputElement.val();
                    this.tags(tags);
                    this._hideForm();
                }, this));
                // Create the Cancel button and register a click event listener
                var buttonCancel = $('<button class="btn"><i class="icon-remove"></i></button>');
                buttonCancel.on('click.' + pluginName, $.proxy(function() {
                    this._hideForm();
                }, this));

                // Add elements to the form
                this.form.append(this.inputElement)
                        .append(this.buttonOk)
                        .append(buttonCancel);

                this.tagger.append(this.addIcon)
                        .append(this.form);

                this.form.toggle();
            }
        },
        //
        // Free resources
        //
        destroy: function() {
            // Unbind events
            this.addIcon.off('.' + pluginName);
            this.inputElement.off('.' + pluginName);
            this.form.off('.' + pluginName, "button");

            // Unbind events for tags
            var $tag;
            for (var t in this.tagList) {
                $tag = this.tagList[t];
                $tag.off('.' + pluginName);
                $tag.find('i.icon-remove').off('.' + pluginName);
            }
            
            // Remove any existent tag
            this.clear();

            // Remove the plugin root
            this.tagger.remove();

            // Remove data
            this.$el.removeData();
        },
        //
        // Clear the current tag list
        //
        clear: function() {
            var tags = this._toArray().toString();
            this.remove(tags);

            // Call the callback
            this.options.onClear.call(this);
        },
        //
        // Adds one or more tags
        // If 'tags' is a string adds the specified tags to the list.
        // If 'tags' is undefined then returns the current tag list.
        //
        tags: function(tags) {
            if (typeof tags === undefined) {
                return this._toArray();
            }
            if (typeof tags === "string") {
                var ta = tags.split(this.options.fieldSeparator);
                for (var i = 0; i < ta.length; i++) {
                    this._addTag($.trim(ta[i]));
                }

                // Call the callback
                this.options.onTagsAdded.call(this, tags);
            }
        },
        //
        // Removes one or more tags
        //
        remove: function(tags) {
            var ta = tags.split(this.options.fieldSeparator);
            for (var i = 0; i < ta.length; i++) {
                this._removeTag($.trim(ta[i]));
            }

            // Call the callback
            this.options.onTagsRemoved.call(this, tags);
        },
        //
        // Transform the current tag list into an array
        //
        _toArray: function() {
            var tagArray = [];
            for (var t in this.tagList) {
                tagArray.push(t);
            }
            return tagArray;
        },
        //
        // Check if a tag is duplicated
        //
        _isDuplicatedTag: function(tag) {
            for (var t in this.tagList) {
                if (tag == t) {
                    return true;
                }
            }
            return false;
        },
        //
        // Show the input form
        //
        _showForm: function() {
            this.addIcon.toggle();
            this.form.toggle();
            this.inputElement.focus();
        },
        //
        // Hide the input form restoring its default values
        //
        _hideForm: function() {
            this.addIcon.toggle();
            this.form.toggle();

            this.form.removeClass('error');
            this.buttonOk.attr('disabled', 'disabled');
            this.inputElement.val('');
        },
        //
        // Handler for the keyup events in the input text.
        // It detect and add new tags
        //
        _inputKeyupHandler: function(event) {
            var tag = $.trim(this.inputElement.val());
            var lastChar = tag[tag.length - 1];

            if (lastChar == this.options.fieldSeparator) {
                // If the key pressed is the separator field then remove the 
                // separator char and add the new tag if valid
                tag = tag.replace(new RegExp(this.options.fieldSeparator, 'g'), '');
                if (tag != "" && !this._isDuplicatedTag(tag)) {
                    this.tags(tag);
                    this.inputElement.val('');
                } else {
                    this.inputElement.val(tag);
                    this.form.addClass('error');
                }
            } else {
                // If the key pressed is other than the separator field then check the
                // current text value is right
                if (tag = "" || this._isDuplicatedTag(tag)) {
                    this.form.addClass('error');
                    this.buttonOk.attr('disabled', 'disabled');
                } else {
                    // Remove the error style if applied
                    this.form.removeClass('error');
                    this.buttonOk.removeAttr('disabled');
                }
            }
        },
        //
        // Adds the specified tag to the tag list and create the required 
        // HTML elements.
        //
        _addTag: function(tag) {
            if (tag != "" && !this._isDuplicatedTag(tag)) {
                // If tag is not duplicated then add a new tag to the list
                var $tag;
                // Check if we are in readOnly mode
                if (this.options.readOnly) {
                    $tag = $('<span class="label">' + tag + '</span>');
                } else {
                    $tag = $('<span class="label">' + tag + '<i class="icon-remove"></i></span>');
                    // Bind event to the label
                    $tag.on('click.' + pluginName, $.proxy(function(event){
                        // Call the callback
                        this.options.onClick.call(this, tag);
                    }, this));
                    // Bind event to the close icon
                    $tag.find('i.icon-remove').on('click.' + pluginName, $.proxy(function(event) {
                        this.remove(tag);
                    }, this));
                }
                this.tagsElement.append($tag);

                // Store the new tag and the $tag element reference
                this.tagList[tag] = $tag;
            }
        },
        //
        // Removes a tag from the tag list
        // 
        _removeTag: function(tag) {
            if (this.tagList[tag]) {
                // Unbind the click event for the tag
                this.tagList[tag].find('i.icon-remove').off('click.' + pluginName);
                // Reomve the event
                this.tagList[tag].remove();
                delete this.tagList[tag];
            }
        }

    };

    //
    // Plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing any
    // public function (whose name doesn't start with an underscore) to be 
    // called via the jQuery plugin:
    // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
    //
    $.fn[pluginName] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            // Create a plugin instance for each selected element.
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a pluguin method for each selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
    };

    //
    // Names of the pluguin methods that can act as a getter method.
    //
    $.fn[pluginName].getters = ['tags'];

    //
    // Default options
    //
    $.fn[pluginName].defaults = {
        fieldSeparator: ",",
        readOnly: false,
        // Callback invoked when user calls the 'tags' method
        onTagsAdded: function() {
        },
        // Callback invoked when user calls the 'remove' method
        onTagsRemoved: function() {
        },
        // Callback invoked when user calls the 'clear' method. 
        // Note: Internally the 'clear' method uses the 'remove'.
        onClear: function() {
        },
        // Callback invoked when the user click a tag label
        onClick: function() {
        }
    };

})(jQuery, window, document);
