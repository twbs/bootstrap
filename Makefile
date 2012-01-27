VERSION=2.0.0
BOOTSTRAP = ./docs/assets/css/bootstrap.css
BOOTSTRAP_LESS = ./less/bootstrap.less
BOOTSTRAP_RESPONSIVE = ./docs/assets/css/bootstrap-responsive.css
BOOTSTRAP_RESPONSIVE_LESS = ./less/responsive.less
LESS_COMPRESSOR ?= `which lessc`
UGLIFY_JS ?= `which uglifyjs`
WATCHR ?= `which watchr`

#
# Build less files + docs
#

build:
	@@if test ! -z ${LESS_COMPRESSOR}; then \
		sed -e 's/@VERSION/'"v${VERSION}"'/' -e 's/@DATE/'"`date`"'/' <${BOOTSTRAP_LESS} >${BOOTSTRAP_LESS}.tmp; \
		lessc ${BOOTSTRAP_LESS}.tmp > ${BOOTSTRAP}; \
		rm -f ${BOOTSTRAP_LESS}.tmp; \
		sed -e 's/@VERSION/'"v${VERSION}"'/' -e 's/@DATE/'"`date`"'/' <${BOOTSTRAP_RESPONSIVE_LESS} >${BOOTSTRAP_RESPONSIVE_LESS}.tmp; \
		lessc ${BOOTSTRAP_RESPONSIVE_LESS}.tmp > ${BOOTSTRAP_RESPONSIVE}; \
		rm -f ${BOOTSTRAP_RESPONSIVE_LESS}.tmp; \
		node docs/build; \
		cp img/* docs/assets/img/; \
		echo "Bootstrap successfully built! - `date`"; \
	else \
		echo "You must have the LESS compiler installed in order to build Bootstrap."; \
		echo "You can install it by running: npm install less -g"; \
	fi

#
# Watch less files
#

watch:
	@@if test ! -z ${WATCHR}; then \
	  echo "Watching less files..."; \
	  watchr -e "watch('less/.*\.less') { system 'make' }"; \
	else \
		echo "You must have the watchr installed in order to watch Bootstrap Less files."; \
		echo "You can install it by running: gem install watchr"; \
	fi


.PHONY: build watch