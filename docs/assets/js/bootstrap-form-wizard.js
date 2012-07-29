/* 
 * Created by jankoatwarpspeed.com ( http://www.jankoatwarpspeed.com/post/2009/09/28/webform-wizard-jquery.aspx )
 * Customize by twitter.com/mpunktm
 * 
 * */

(function($) {
    $.fn.formToWizard = function(options) {
        options = $.extend({  
        	stepText: 'Step ',
        	showSteps: true,
        	stepNextText: 'Next',
        	stepNextClass: 'btn btn-primary',
        	stepPrevText: 'Back',
        	stepPrevClass: 'btn',
            submitButton: ''  
        }, options); 
        
        var element = this;

        var steps = $(element).find("fieldset");
        var count = steps.size();
        var submmitButtonName = "#" + options.submitButton;
        $(submmitButtonName).hide();

        // 2
        $(element).before("<ul id='steps'></ul>");

        steps.each(function(i) {
            $(this).wrap("<div id='step" + i + "'></div>");
            $(this).append("<p id='step" + i + "commands'></p>");

            // 2
            var name = $(this).find("legend").html();
         
            $("#steps").append("<li id='stepDesc" + i + "'>" + options.stepText  + (i + 1) + "<span> " + name + "</span></li>");

            if (i == 0) {
                createNextButton(i);
                selectStep(i);
            }
            else if (i == count - 1) {
                $("#step" + i).hide();
                createPrevButton(i);
            }
            else {
                $("#step" + i).hide();
                createPrevButton(i);
                createNextButton(i);
            }
            
            if(options.showSteps == false) {
            	$('#steps').hide();
            }
        });

        function createPrevButton(i) {
            var stepName = "step" + i;
            $("#" + stepName + "commands").append("<a href='#' id='" + stepName + "Prev' class='" + options.stepPrevClass + "'>" + options.stepPrevText + "</a>");

            $("#" + stepName + "Prev").bind("click", function(e) {
                $("#" + stepName).hide();
                $("#step" + (i - 1)).show();
                $(submmitButtonName).hide();
                selectStep(i - 1);
            });
        }

        function createNextButton(i) {
            var stepName = "step" + i;
            $("#" + stepName + "commands").append("<a href='#' id='" + stepName + "Next' class='" + options.stepNextClass +"'>" + options.stepNextText + "</a>");

            $("#" + stepName + "Next").bind("click", function(e) {
                $("#" + stepName).hide();
                $("#step" + (i + 1)).show();
                if (i + 2 == count)
                    $(submmitButtonName).show();
                selectStep(i + 1);
            });
        }

        function selectStep(i) {
            $("#steps li").removeClass("current");
            $("#stepDesc" + i).addClass("current");
        }

    }
})(jQuery); 