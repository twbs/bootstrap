VERSION=1.4.0
DATE=$(shell date)
BOOTSTRAP = ./bootstrap.css
BOOTSTRAP_MIN = ./bootstrap.min.css
BOOTSTRAP_LESS = ./lib/bootstrap.less
LESS_COMPRESSOR ?= `which lessc`
UGLIFY_JS ?= `which uglifyjs`
WATCHR ?= `which watchr`

build:
	@@if test ! -z ${LESS_COMPRESSOR}; then \
		sed -e 's/@VERSION/'"v${VERSION}"'/' -e 's/@DATE/'"${DATE}"'/' <${BOOTSTRAP_LESS} >${BOOTSTRAP_LESS}.tmp; \
		lessc ${BOOTSTRAP_LESS}.tmp > ${BOOTSTRAP}; \
		lessc ${BOOTSTRAP_LESS}.tmp > ${BOOTSTRAP_MIN} --compress; \
		rm -f ${BOOTSTRAP_LESS}.tmp; \
		echo "Bootstrap successfully built! - `date`"; \
	else \
		echo "You must have the LESS compiler installed in order to build Bootstrap."; \
		echo "You can install it by running: npm install less -g"; \
	fi

js/min:
	@@if test ! -z ${UGLIFY_JS}; then \
		mkdir -p js/min; \
		uglifyjs -o js/min/bootstrap-alerts.min.js    js/bootstrap-alerts.js;\
		uglifyjs -o js/min/bootstrap-buttons.min.js   js/bootstrap-buttons.js;\
		uglifyjs -o js/min/bootstrap-dropdown.min.js  js/bootstrap-dropdown.js;\
		uglifyjs -o js/min/bootstrap-modal.min.js     js/bootstrap-modal.js;\
		uglifyjs -o js/min/bootstrap-popover.min.js   js/bootstrap-popover.js;\
		uglifyjs -o js/min/bootstrap-scrollspy.min.js js/bootstrap-scrollspy.js;\
		uglifyjs -o js/min/bootstrap-tabs.min.js      js/bootstrap-tabs.js;\
		uglifyjs -o js/min/bootstrap-twipsy.min.js    js/bootstrap-twipsy.js;\
	else \
		echo "You must have the UGLIFYJS minifier installed in order to minify Bootstrap's js."; \
		echo "You can install it by running: npm install uglify-js -g"; \
	fi

watch:
	@@if test ! -z ${WATCHR}; then \
	  echo "Watching less files..."; \
	  watchr -e "watch('lib/.*\.less') { system 'make' }"; \
	else \
		echo "You must have the watchr installed in order to watch Bootstrap less files."; \
		echo "You can install it by running: gem install watchr"; \
	fi

.PHONY: build watch