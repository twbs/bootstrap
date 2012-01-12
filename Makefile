VERSION=2.0.0
BOOTSTRAP = ./bootstrap.css
BOOTSTRAP_MIN = ./bootstrap.min.css
BOOTSTRAP_LESS = ./lib/bootstrap.less
LESS_COMPESSOR ?= `which lessc`
UGLIFY_JS ?= `which uglifyjs`
WATCHR ?= `which watchr`

build:
	@@if test ! -z ${LESS_COMPESSOR}; then \
		sed -e 's/@VERSION/'"v${VERSION}"'/' -e 's/@DATE/'"`date`"'/' <${BOOTSTRAP_LESS} >${BOOTSTRAP_LESS}.tmp; \
		lessc ${BOOTSTRAP_LESS}.tmp > ${BOOTSTRAP}; \
		lessc ${BOOTSTRAP_LESS}.tmp > ${BOOTSTRAP_MIN} --compress; \
		rm -f ${BOOTSTRAP_LESS}.tmp; \
		echo "Bootstrap successfully built! - `date`"; \
	else \
		echo "You must have the LESS compiler installed in order to build Bootstrap."; \
		echo "You can install it by running: npm install less -g"; \
	fi

uglify:
	@@if test ! -z ${UGLIFY_JS}; then \
		mkdir -p js/min; \
		uglifyjs -o js/min/bootstrap-alerts.js js/bootstrap-alert.js;\
		uglifyjs -o js/min/bootstrap-buttons.js js/bootstrap-button.js;\
		uglifyjs -o js/min/bootstrap-carousel.js js/bootstrap-carousel.js;\
		uglifyjs -o js/min/bootstrap-collapse.js js/bootstrap-collapse.js;\
		uglifyjs -o js/min/bootstrap-dropdown.js js/bootstrap-dropdown.js;\
		uglifyjs -o js/min/bootstrap-modal.js js/bootstrap-modal.js;\
		uglifyjs -o js/min/bootstrap-popover.js js/bootstrap-popover.js;\
		uglifyjs -o js/min/bootstrap-scrollspy.js js/bootstrap-scrollspy.js;\
		uglifyjs -o js/min/bootstrap-tabs.js js/bootstrap-tab.js;\
		uglifyjs -o js/min/bootstrap-transitions.js js/bootstrap-transition.js;\
		uglifyjs -o js/min/bootstrap-tooltip.js js/bootstrap-tooltip.js;\
	else \
		echo "You must have the UGLIFYJS minifier installed in order to minify Bootstrap's js."; \
		echo "You can install it by running: npm install uglify-js -g"; \
	fi

watch:
	@@if test ! -z ${WATCHR}; then \
	  echo "Watching less files..."; \
	  watchr -e "watch('lib/.*\.less') { system 'make' }"; \
	else \
		echo "You must have the watchr installed in order to watch Bootstrap Less files."; \
		echo "You can install it by running: gem install watchr"; \
	fi

.PHONY: build watch