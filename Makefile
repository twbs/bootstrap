BOOTSTRAP = ./assets/css/bootstrap.css
BOOTSTRAP_LESS = ./less/bootstrap.less
BOOTSTRAP_RESPONSIVE = ./assets/css/bootstrap-responsive.css
BOOTSTRAP_RESPONSIVE_LESS = ./less/responsive.less

HQ_BOOTSTRAP_SRC = ../core-hq-src/corehq/apps/hqwebapp/static/hq-bootstrap

LESS_COMPRESSOR ?= `which lessc`
WATCHR ?= `which watchr`

#
# BUILD CommCareHQ BOOTSTRAP DIRECTORY
# lessc & uglifyjs are required
#

bootstrap:
	mkdir -p ${HQ_BOOTSTRAP_SRC}/img
	mkdir -p ${HQ_BOOTSTRAP_SRC}/css
	mkdir -p ${HQ_BOOTSTRAP_SRC}/js
	cp img/* ${HQ_BOOTSTRAP_SRC}/img/

	lessc ${BOOTSTRAP_LESS} > ${HQ_BOOTSTRAP_SRC}/css/bootstrap.css
	lessc --compress ${BOOTSTRAP_LESS} > ${HQ_BOOTSTRAP_SRC}/css/bootstrap.min.css
	lessc ${BOOTSTRAP_RESPONSIVE_LESS} > ${HQ_BOOTSTRAP_SRC}/css/bootstrap-responsive.css
	#lessc --compress ${BOOTSTRAP_RESPONSIVE_LESS} > ${HQ_BOOTSTRAP_SRC}/css/bootstrap-responsive.min.css
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