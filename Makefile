BOOTSTRAP_LESS = ./less/hq-bootstrap.less
BOOTSTRAP_RESPONSIVE_LESS = ./less/responsive.less
DIRECT_LESS_COMMAND = nodejs /opt/lessc/bin/lessc
HQ_BOOTSTRAP_SRC = ../core-hq-src/corehq/apps/hqwebapp/static/hq-bootstrap
FORMDESIGNER_CSS_SRC = ../formdesigner/css

LESS_COMPRESSOR ?= `which less`
WATCHR ?= `which watchr`

#
# BUILD CommCareHQ BOOTSTRAP DIRECTORY
# lessc & uglifyjs are required
#

bootstrap:
	rm -rf ${HQ_BOOTSTRAP_SRC}/img
	rm -rf ${HQ_BOOTSTRAP_SRC}/js
	rm -rf ${HQ_BOOTSTRAP_SRC}/css

	mkdir -p ${HQ_BOOTSTRAP_SRC}/img
	cp img/* ${HQ_BOOTSTRAP_SRC}/img/

	mkdir -p ${HQ_BOOTSTRAP_SRC}/css
	lessc ${BOOTSTRAP_LESS} > ${HQ_BOOTSTRAP_SRC}/css/hq-bootstrap.css
	mkdir -p ${HQ_BOOTSTRAP_SRC}/css/old
	lessc ./less/old/core.less > ${HQ_BOOTSTRAP_SRC}/css/old/core.css
	lessc ./less/old/app_manager.less >  ${HQ_BOOTSTRAP_SRC}/css/old/app_manager.css

	lessc ./less/formdesigner-old/formdesigner.less > ${FORMDESIGNER_CSS_SRC}/formdesigner.css
	lessc ./less/formdesigner-old/screen.less > ${FORMDESIGNER_CSS_SRC}/screen.css

	mkdir -p ${HQ_BOOTSTRAP_SRC}/js
	cp -r js/includes/* ${HQ_BOOTSTRAP_SRC}/js/

	cat js/bootstrap-transition.js js/bootstrap-alert.js js/bootstrap-button.js js/bootstrap-carousel.js js/bootstrap-collapse.js js/bootstrap-dropdown.js js/bootstrap-modal.js js/bootstrap-tooltip.js js/bootstrap-popover.js js/bootstrap-scrollspy.js js/bootstrap-tab.js js/bootstrap-typeahead.js > ${HQ_BOOTSTRAP_SRC}/js/bootstrap.js
	uglifyjs -nc ${HQ_BOOTSTRAP_SRC}/js/bootstrap.js > ${HQ_BOOTSTRAP_SRC}/js/bootstrap.min.js


#
# Direct LESS command for conflicts with the less gem on staging which is kind of broken. stupid ruby
#

direct:
	rm -rf ${HQ_BOOTSTRAP_SRC}/img
	rm -rf ${HQ_BOOTSTRAP_SRC}/js
	rm -rf ${HQ_BOOTSTRAP_SRC}/css

	mkdir -p ${HQ_BOOTSTRAP_SRC}/img
	cp img/* ${HQ_BOOTSTRAP_SRC}/img/

	mkdir -p ${HQ_BOOTSTRAP_SRC}/css
	${DIRECT_LESS_COMMAND} ${BOOTSTRAP_LESS} > ${HQ_BOOTSTRAP_SRC}/css/hq-bootstrap.css
	mkdir -p ${HQ_BOOTSTRAP_SRC}/css/old
	${DIRECT_LESS_COMMAND} ./less/old/core.less > ${HQ_BOOTSTRAP_SRC}/css/old/core.css
	${DIRECT_LESS_COMMAND} ./less/old/app_manager.less >  ${HQ_BOOTSTRAP_SRC}/css/old/app_manager.css

	${DIRECT_LESS_COMMAND} ./less/formdesigner-old/formdesigner.less > ${FORMDESIGNER_CSS_SRC}/formdesigner.css
	${DIRECT_LESS_COMMAND} ./less/formdesigner-old/screen.less > ${FORMDESIGNER_CSS_SRC}/screen.css

	mkdir -p ${HQ_BOOTSTRAP_SRC}/js
	cp -r js/includes/* ${HQ_BOOTSTRAP_SRC}/js/

	cat js/bootstrap-transition.js js/bootstrap-alert.js js/bootstrap-button.js js/bootstrap-carousel.js js/bootstrap-collapse.js js/bootstrap-dropdown.js js/bootstrap-modal.js js/bootstrap-tooltip.js js/bootstrap-popover.js js/bootstrap-scrollspy.js js/bootstrap-tab.js js/bootstrap-typeahead.js > ${HQ_BOOTSTRAP_SRC}/js/bootstrap.js
	uglifyjs -nc ${HQ_BOOTSTRAP_SRC}/js/bootstrap.js > ${HQ_BOOTSTRAP_SRC}/js/bootstrap.min.js

#
# non-css only
#

extra:
	mkdir -p ${HQ_BOOTSTRAP_SRC}/img
	cp img/* ${HQ_BOOTSTRAP_SRC}/img/

	rm -rf ${HQ_BOOTSTRAP_SRC}/js
	mkdir -p ${HQ_BOOTSTRAP_SRC}/js
	cp -r js/includes/* ${HQ_BOOTSTRAP_SRC}/js/

	cat js/bootstrap-transition.js js/bootstrap-alert.js js/bootstrap-button.js js/bootstrap-carousel.js js/bootstrap-collapse.js js/bootstrap-dropdown.js js/bootstrap-modal.js js/bootstrap-tooltip.js js/bootstrap-popover.js js/bootstrap-scrollspy.js js/bootstrap-tab.js js/bootstrap-typeahead.js > ${HQ_BOOTSTRAP_SRC}/js/bootstrap.js
	uglifyjs -nc ${HQ_BOOTSTRAP_SRC}/js/bootstrap.js > ${HQ_BOOTSTRAP_SRC}/js/bootstrap.min.js

#
# WATCH LESS FILES
#

watch:
	echo "Watching less files..."; \
	watchr -e "watch('less/.*\.less') { system 'make' }"