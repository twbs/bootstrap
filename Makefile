BOOTSTRAP = ./docs/assets/css/bootstrap.css
BOOTSTRAP_LESS = ./less/bootstrap.less
DATE=$(shell date +%I:%M%p)
CHECK=\033[32m✔ Done\033[39m
HR=\033[37m--------------------------------------------------\033[39m
BIN_PREFIX=./node_modules/.bin/
JSHINT_BIN=$(BIN_PREFIX)jshint
RECESS_BIN=$(BIN_PREFIX)recess
UGLIFYJS_BIN=$(BIN_PREFIX)uglifyjs

#
# BUILD DOCS
#

FONTS=${wildcard fonts/*}
DOCS_FONTS=${patsubst fonts/%,docs/assets/fonts/%,${FONTS}}
JS=${wildcard js/*.js} js/tests/vendor/jquery.js
DOCS_JS=${patsubst js/%,docs/assets/js/%,${wildcard js/*.js}} docs/assets/js/jquery.js

build: splash js/.lastbuilt ${BOOTSTRAP} ${DOCS_FONTS} ${DOCS_JS} docs/assets/js/bootstrap.js docs/assets/js/bootstrap.min.js
	@echo "${HR}"
	@echo "\033[36mSuccess!\n\033[39m"
	@echo "\033[37mThanks for using Bootstrap,"
	@echo "<3 @mdo and @fat\n\033[39m"

docs/assets/js/bootstrap.js docs/assets/js/bootstrap.min.js: ${JS}
	@cat ${JS} > docs/assets/js/bootstrap.js
	@$(UGLIFYJS_BIN) -nc docs/assets/js/bootstrap.js > docs/assets/js/bootstrap.min.tmp.js
	@echo "/**\n* Bootstrap.js v3.0.0 by @fat & @mdo\n* Copyright 2012 Twitter, Inc.\n* http://www.apache.org/licenses/LICENSE-2.0.txt\n*/" > docs/assets/js/copyright.js
	@cat docs/assets/js/copyright.js docs/assets/js/bootstrap.min.tmp.js > docs/assets/js/bootstrap.min.js
	@rm docs/assets/js/copyright.js docs/assets/js/bootstrap.min.tmp.js
	@echo "Compiling and minifying javascript...       ${CHECK}"

${DOCS_FONTS} ${DOCS_JS}: ${FONTS} ${JS}
	@cp ${FONTS} docs/assets/fonts/
	@cp ${JS} docs/assets/js/
	@echo "Prepping fonts and JavaScript...            ${CHECK}"

splash:
	@echo "\n\n"
	@echo "\033[36mBuilding Bootstrap...\033[39m"
	@echo "${HR}"

js/.lastbuilt: js/*.js
	@$(JSHINT_BIN) js/*.js --config js/.jshintrc
	@$(JSHINT_BIN) js/tests/unit/*.js --config js/.jshintrc
	@touch js/.lastbuilt
	@echo "Running JSHint on javascript...             ${CHECK}"

${BOOTSTRAP}: ${BOOTSTRAP_LESS}
	@$(RECESS_BIN) --compile $^ > $@
	@echo "Compiling LESS with Recess...               ${CHECK}"
#
# RUN JSHINT & QUNIT TESTS IN PHANTOMJS
#

test:
	$(JSHINT_BIN) js/*.js --config js/.jshintrc
	$(JSHINT_BIN) js/tests/unit/*.js --config js/.jshintrc
	node js/tests/server.js &
	phantomjs js/tests/phantom.js "http://localhost:3000/js/tests"
	kill -9 `cat js/tests/pid.txt`
	rm js/tests/pid.txt

#
# CLEANS THE ROOT DIRECTORY OF PRIOR BUILDS
#

clean:
	-rm ${BOOTSTRAP}
	-rm js/.lastbuilt
	-rm ${DOCS_FONTS}
	-rm ${DOCS_JS}
	-rm -r bootstrap

#
# BUILD SIMPLE BOOTSTRAP DIRECTORY
# recess & uglifyjs are required
#

bootstrap: bootstrap-fonts bootstrap-css bootstrap-js


#
# JS COMPILE
#
bootstrap-js: bootstrap/js/*.js

bootstrap/js/*.js: js/*.js
	mkdir -p bootstrap/js
	cat $^ > bootstrap/js/bootstrap.js
	$(UGLIFYJS_BIN) -nc bootstrap/js/bootstrap.js > bootstrap/js/bootstrap.min.tmp.js
	echo "/*!\n* Bootstrap.js by @fat & @mdo\n* Copyright 2012 Twitter, Inc.\n* http://www.apache.org/licenses/LICENSE-2.0.txt\n*/" > bootstrap/js/copyright.js
	cat bootstrap/js/copyright.js bootstrap/js/bootstrap.min.tmp.js > bootstrap/js/bootstrap.min.js
	rm bootstrap/js/copyright.js bootstrap/js/bootstrap.min.tmp.js

#
# CSS COMPILE
#

bootstrap-css: bootstrap/css/*.css

bootstrap/css/*.css: less/*.less
	mkdir -p bootstrap/css
	$(RECESS_BIN) --compile ${BOOTSTRAP_LESS} > bootstrap/css/bootstrap.css
	$(RECESS_BIN) --compress ${BOOTSTRAP_LESS} > bootstrap/css/bootstrap.min.css
	$(RECESS_BIN) --compile ${BOOTSTRAP_RESPONSIVE_LESS} > bootstrap/css/bootstrap-responsive.css
	$(RECESS_BIN) --compress ${BOOTSTRAP_RESPONSIVE_LESS} > bootstrap/css/bootstrap-responsive.min.css

#
# FONTS
#

bootstrap-fonts: bootstrap/fonts/*

bootstrap/fonts/*: fonts/*
	mkdir -p bootstrap/fonts
	cp fonts/* bootstrap/fonts/


#
# MAKE FOR GH-PAGES 4 FAT & MDO ONLY (O_O  )
#

gh-pages: bootstrap
	rm -f docs/assets/bootstrap.zip
	zip -r docs/assets/bootstrap.zip bootstrap
	rm -r bootstrap
	rm -f ../bootstrap-gh-pages/assets/bootstrap.zip
	node docs/build production
	cp -r docs/* ../bootstrap-gh-pages

#
# WATCH LESS FILES
#

watch:
	@echo "Watching less files..."; \
	watchr -e "watch('less/.*\.less') { system 'make' }"


.PHONY: build test clean bootstrap bootstrap-js bootstrap-css bootstrap-fonts gh-pages watch splash
