/* ============================================================
 * bootstrap-accordion.js v1.0.0
 * ============================================================
 * Copyright (c) 2011 Sandro Pasquali (spasquali@gmail.com)
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
 * ============================================================ */

!function($) {

    "use strict";
    
    $.fn.accordion = function(opts) {
    
        opts    = opts || {};
        
        var onBeforeOpen    = opts.onBeforeOpen     || $.noop;
        var onBeforeClose   = opts.onBeforeClose    || $.noop;
        var onOpen          = opts.onOpen           || $.noop;
        var onClose         = opts.onClose          || $.noop;
        var onOver          = opts.onOver           || $.noop;
        var onOut           = opts.onOut            || $.noop;
        
        var openSpeed       = opts.openSpeed === void 0 ? 300 : opts.openSpeed;
        var closeSpeed      = opts.closeSpeed === void 0 ? 300 : opts.closeSpeed;
        
        //  #speed a shortcut to normalizing #openSpeed, #closeSpeed.
        //
        if(opts.speed) {
            openSpeed = closeSpeed = opts.speed;
        }        

        var curr = {};
        
        this.find(".accordion-trigger")
        
            .click(function(e) {
                
                //  #next == body attached to trigger
                //
                var $t  = $(this);
                var $n  = $t.next();
        
                //  Close any open body
                //
                (function(cb, lt) {
                    if(cb) {
                        onBeforeClose(lt, e);
                        cb.slideUp(closeSpeed, function() {
                            onClose(lt, e);
                        });
                    }
                })(curr.body, curr.trig); 

                //  Open selected body
                //
                if($n.is(':hidden')) {
                    onBeforeOpen($t, e);
                    $n.slideDown(openSpeed, function() {
                        curr.body = $n;
                        curr.trig = $t;
                        
                        onOpen($t, e);
                    });
                 } 
             })
             
            .mouseover(function(e) {
                onOver($(this), e);
            })
            
            .mouseout(function(e) {
                onOut($(this), e);
            });
        
        //  Hide all elements; slide open desired on start.
        //
        this.find(".accordion-body").hide();
        this.find(".accordion-startopen").trigger("click");
        
        return this;
    };

}(window.jQuery || window.ender);
