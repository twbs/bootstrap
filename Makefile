BOOTSTRAP = ./docs/assets/css/bootstrap.css
BOOTSTRAP_LESS = ./less/bootstrap.less
BOOTSTRAP_RESPONSIVE = ./docs/assets/css/bootstrap-responsive.css
BOOTSTRAP_RESPONSIVE_LESS = ./less/responsive.less
LESS_COMPRESSOR ?= `which lessc`
WATCHR ?= `which watchr`

#
# Build less files + docs
#

build:
	@if test ! -z ${LESS_COMPRESSOR}; then \
		lessc ${BOOTSTRAP_LESS} > ${BOOTSTRAP}; \
		lessc ${BOOTSTRAP_RESPONSIVE_LESS} > ${BOOTSTRAP_RESPONSIVE}; \
		node docs/build; \
		cp img/* docs/assets/img/; \
	else \
		echo "You must have the LESS compiler installed in order to build Bootstrap."; \
		echo "You can install it by running: npm install less -g"; \
	fi

#
# Watch less files
#

watch:
	@if test ! -z ${WATCHR}; then \
	  echo "Watching less files..."; \
	  watchr -e "watch('less/.*\.less') { system 'make' }"; \
	else \
		echo "You must have the watchr installed in order to watch Bootstrap Less files."; \
		echo "You can install it by running: gem install watchr"; \
	fi

.PHONY: build watch