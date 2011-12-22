VERSION=1.4.0
DATE=$(shell DATE)
BOOTSTRAP = ./static/css/bootstrap.css
BOOTSTRAP_MIN = ./static/css/bootstrap.min.css
BOOTSTRAP_LESS = ./static/less/bootstrap.less
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
		mkdir -p static/js/min; \
		uglifyjs -o static/js/min/bootstrap-alerts.min.js    static/js/bootstrap-alerts.js;\
		uglifyjs -o static/js/min/bootstrap-buttons.min.js   static/js/bootstrap-buttons.js;\
		uglifyjs -o static/js/min/bootstrap-dropdown.min.js  static/js/bootstrap-dropdown.js;\
		uglifyjs -o static/js/min/bootstrap-modal.min.js     static/js/bootstrap-modal.js;\
		uglifyjs -o static/js/min/bootstrap-popover.min.js   static/js/bootstrap-popover.js;\
		uglifyjs -o static/js/min/bootstrap-scrollspy.min.js static/js/bootstrap-scrollspy.js;\
		uglifyjs -o static/js/min/bootstrap-tabs.min.js      static/js/bootstrap-tabs.js;\
		uglifyjs -o static/js/min/bootstrap-twipsy.min.js    static/js/bootstrap-twipsy.js;\
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
