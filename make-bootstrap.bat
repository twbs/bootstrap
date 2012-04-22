@echo off

set "BOOTSTRAP=docs/assets/css/bootstrap.css"
set "BOOTSTRAP_LESS=less/bootstrap.less"
set "BOOTSTRAP_RESPONSIVE=docs/assets/css/bootstrap-responsive.css"
set "BOOTSTRAP_RESPONSIVE_LESS=less/responsive.less"

mkdir bootstrap\img
mkdir bootstrap\css
mkdir bootstrap\js
cp img/* bootstrap/img

call lessc %BOOTSTRAP_LESS% bootstrap/css/bootstrap.css
call lessc --compress %BOOTSTRAP_LESS% bootstrap/css/bootstrap.min.css
call lessc %BOOTSTRAP_RESPONSIVE_LESS% bootstrap/css/bootstrap-responsive.css
call lessc --compress %BOOTSTRAP_RESPONSIVE_LESS% bootstrap/css/bootstrap-responsive.min.css

cat js/bootstrap-transition.js js/bootstrap-alert.js js/bootstrap-button.js js/bootstrap-carousel.js js/bootstrap-collapse.js js/bootstrap-dropdown.js js/bootstrap-modal.js js/bootstrap-tooltip.js js/bootstrap-popover.js js/bootstrap-scrollspy.js js/bootstrap-tab.js js/bootstrap-typeahead.js > bootstrap/js/bootstrap.js

call uglifyjs -nc bootstrap/js/bootstrap.js > bootstrap/js/bootstrap.min.tmp.js

setlocal EnableDelayedExpansion
set "COPYRIGHT1=/**"
set "COPYRIGHT2=* Bootstrap.js by @fat & @mdo"
set "COPYRIGHT3=* Copyright 2012 Twitter, Inc."
set "COPYRIGHT4=* http://www.apache.org/licenses/LICENSE-2.0.txt"
set "COPYRIGHT5=*/"
echo !COPYRIGHT1! > bootstrap/js/copyright.js
echo.!COPYRIGHT2! >> bootstrap/js/copyright.js
echo.!COPYRIGHT3! >> bootstrap/js/copyright.js
echo.!COPYRIGHT4! >> bootstrap/js/copyright.js
echo.!COPYRIGHT5! >> bootstrap/js/copyright.js

cat bootstrap/js/copyright.js bootstrap/js/bootstrap.min.tmp.js > bootstrap/js/bootstrap.min.js
rm bootstrap/js/copyright.js bootstrap/js/bootstrap.min.tmp.js
