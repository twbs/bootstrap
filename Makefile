BOOTSTRAP ?= ./docs/assets/css/bootstrap.css
BOOTSTRAP_LESS ?= ./less/bootstrap.less
DATE=$(shell date +%I:%M%p)
CHECK=\033[32m✔ Done\033[39m
HR=\033[37m--------------------------------------------------\033[39m
PATH := ./node_modules/.bin:$(PATH)


#
# BUILD DOCS
#

build:
	@echo "\n\n"
	@echo "\033[36mBuilding Bootstrap...\033[39m"
	@echo "${HR}"
	@printf "Running JSHint on JavaScript..."
	@jshint js/*.js --config js/.jshintrc
	@jshint js/tests/unit/*.js --config js/.jshintrc
	@echo "             ${CHECK}"
	@printf "Compiling LESS with Recess..."
	@recess --compile ${BOOTSTRAP_LESS} > ${BOOTSTRAP}
	@echo "               ${CHECK}"
	@printf "Prepping documentation assets..."
	@cp js/tests/vendor/jquery.js docs/assets/js/
	@echo "            ${CHECK}"
	@printf "Compiling and minifying JavaScript..."
	@cat js/transition.js js/alert.js js/button.js js/carousel.js js/collapse.js js/dropdown.js js/modal.js js/tooltip.js js/popover.js js/scrollspy.js js/tab.js js/affix.js > docs/assets/js/bootstrap.js
	@uglifyjs -nc docs/assets/js/bootstrap.js > docs/assets/js/bootstrap.min.tmp.js
	@echo "/**\n* Bootstrap.js v3.0.0 by @fat & @mdo\n* Copyright 2012 Twitter, Inc.\n* http://www.apache.org/licenses/LICENSE-2.0.txt\n*/" > docs/assets/js/copyright.js
	@cat docs/assets/js/copyright.js docs/assets/js/bootstrap.min.tmp.js > docs/assets/js/bootstrap.min.js
	@rm docs/assets/js/copyright.js docs/assets/js/bootstrap.min.tmp.js
	@echo "       ${CHECK}"
	@echo "${HR}"
	@echo "\033[36mSuccess!\n\033[39m"
	@echo "\033[37mThanks for using Bootstrap,"
	@echo "<3 @mdo and @fat\n\033[39m"

#
# RUN JSHINT & QUNIT TESTS IN PHANTOMJS
#

test:
	jshint js/*.js --config js/.jshintrc
	jshint js/tests/unit/*.js --config js/.jshintrc
	node js/tests/server.js &
	phantomjs js/tests/phantom.js "http://localhost:3000/js/tests"
	kill -9 `cat js/tests/pid.txt`
	rm js/tests/pid.txt

#
# CLEANS THE ROOT DIRECTORY OF PRIOR BUILDS
#

clean:
	rm -r bootstrap

#
# BUILD SIMPLE BOOTSTRAP DIRECTORY
# recess & uglifyjs are required
#

bootstrap: bootstrap-css bootstrap-js


#
# JS COMPILE
#
bootstrap-js: bootstrap/js/*.js

bootstrap/js/*.js: js/*.js
	mkdir -p bootstrap/js
	cat js/transition.js js/alert.js js/button.js js/carousel.js js/collapse.js js/dropdown.js js/modal.js js/tooltip.js js/popover.js js/scrollspy.js js/tab.js js/affix.js > bootstrap/js/bootstrap.js
	uglifyjs -nc bootstrap/js/bootstrap.js > bootstrap/js/bootstrap.min.tmp.js
	echo "/*!\n* Bootstrap.js by @fat & @mdo\n* Copyright 2012 Twitter, Inc.\n* http://www.apache.org/licenses/LICENSE-2.0.txt\n*/" > bootstrap/js/copyright.js
	cat bootstrap/js/copyright.js bootstrap/js/bootstrap.min.tmp.js > bootstrap/js/bootstrap.min.js
	rm bootstrap/js/copyright.js bootstrap/js/bootstrap.min.tmp.js

#
# CSS COMPILE
#

bootstrap-css: bootstrap/css/*.css

bootstrap/css/*.css: less/*.less
	mkdir -p bootstrap/css
	recess --compile ${BOOTSTRAP_LESS} > bootstrap/css/bootstrap.css
	recess --compress ${BOOTSTRAP_LESS} > bootstrap/css/bootstrap.min.css

#
# WATCH LESS FILES
#

watch:
	echo "Watching less files..."; \
	watchr -e "watch('less/.*\.less') { system 'make' }"

#
# BUILD AND START SERVER
#

run: build
	jekyll build && jekyll server

.PHONY: docs watch gh-pages bootstrap-css bootstrap-js
