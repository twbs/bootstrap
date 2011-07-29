DATE=$(shell DATE)
BOOTSTRAP = ./bootstrap-1.0.0.css
BOOTSTRAP_MIN = ./bootstrap-1.0.0.min.css
BOOTSTRAP_LESS = ./lib/bootstrap.less
LESS_COMPESSOR ?= `which lessc`
WATCHR ?= `which watchr`

build:
	@@if test ! -z ${LESS_COMPESSOR}; then \
		sed 's/@DATE/'"${DATE}"'/' ${BOOTSTRAP_LESS} >${BOOTSTRAP_LESS}.tmp; \
		lessc ${BOOTSTRAP_LESS}.tmp > ${BOOTSTRAP}; \
		lessc ${BOOTSTRAP_LESS}.tmp > ${BOOTSTRAP_MIN} --compress; \
		rm -f ${BOOTSTRAP_LESS}.tmp; \
		echo "Bootstrap successfully built! - `date`"; \
	else \
		echo "You must have the LESS compiler installed in order to build Bootstrap."; \
		echo "You can install it by running: npm install less -g"; \
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