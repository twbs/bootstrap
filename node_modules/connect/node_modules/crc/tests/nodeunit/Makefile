PACKAGE = nodeunit
NODEJS = $(if $(shell test -f /usr/bin/nodejs && echo "true"),nodejs,node)

PREFIX ?= /usr/local
BINDIR ?= $(PREFIX)/bin
DATADIR ?= $(PREFIX)/share
MANDIR ?= $(PREFIX)/share/man
LIBDIR ?= $(PREFIX)/lib
NODEJSLIBDIR ?= $(LIBDIR)/$(NODEJS)

BUILDDIR = dist

DOCS = $(shell find doc -name '*.md' \
				|sed 's|.md|.1|g' \
				|sed 's|doc/|man1/|g' \
				)


$(shell if [ ! -d $(BUILDDIR) ]; then mkdir $(BUILDDIR); fi)

all: build doc

browser:
	# super hacky build script for browser version!
	mkdir -p $(BUILDDIR)/browser
	rm -rf $(BUILDDIR)/browser/*
	# build browser version of nodeunit.js
	cat share/license.js >> $(BUILDDIR)/browser/nodeunit.js
	echo "nodeunit = (function(){" >> $(BUILDDIR)/browser/nodeunit.js
	cat deps/json2.js >> $(BUILDDIR)/browser/nodeunit.js
	# make assert global
	echo "var assert = this.assert = {};" >> $(BUILDDIR)/browser/nodeunit.js
	echo "var types = {};" >> $(BUILDDIR)/browser/nodeunit.js
	echo "var core = {};" >> $(BUILDDIR)/browser/nodeunit.js
	echo "var nodeunit = {};" >> $(BUILDDIR)/browser/nodeunit.js
	echo "var reporter = {};" >> $(BUILDDIR)/browser/nodeunit.js
	cat deps/async.js >> $(BUILDDIR)/browser/nodeunit.js
	echo "(function(exports){" >> $(BUILDDIR)/browser/nodeunit.js
	cat lib/assert.js >> $(BUILDDIR)/browser/nodeunit.js
	echo "})(assert);" >> $(BUILDDIR)/browser/nodeunit.js
	echo "(function(exports){" >> $(BUILDDIR)/browser/nodeunit.js
	cat lib/types.js >> $(BUILDDIR)/browser/nodeunit.js
	echo "})(types);" >> $(BUILDDIR)/browser/nodeunit.js
	echo "(function(exports){" >> $(BUILDDIR)/browser/nodeunit.js
	cat lib/core.js >> $(BUILDDIR)/browser/nodeunit.js
	echo "})(core);" >> $(BUILDDIR)/browser/nodeunit.js
	echo "(function(exports){" >> $(BUILDDIR)/browser/nodeunit.js
	cat lib/reporters/browser.js >> $(BUILDDIR)/browser/nodeunit.js
	echo "})(reporter);" >> $(BUILDDIR)/browser/nodeunit.js
	echo "nodeunit = core;" >> $(BUILDDIR)/browser/nodeunit.js
	echo "nodeunit.assert = assert;" >> $(BUILDDIR)/browser/nodeunit.js
	echo "nodeunit.reporter = reporter;" >> $(BUILDDIR)/browser/nodeunit.js
	echo "nodeunit.run = reporter.run;" >> $(BUILDDIR)/browser/nodeunit.js
	echo "return nodeunit; })();" >> $(BUILDDIR)/browser/nodeunit.js
	sed -i "/\@REMOVE_LINE_FOR_BROWSER/d" $(BUILDDIR)/browser/nodeunit.js
	# copy nodeunit.css
	cp share/nodeunit.css $(BUILDDIR)/browser/nodeunit.css
	# create nodeunit.min.js
	uglifyjs $(BUILDDIR)/browser/nodeunit.js > $(BUILDDIR)/browser/nodeunit.min.js
	# create test scripts
	mkdir -p $(BUILDDIR)/browser/test
	cp test/test.html $(BUILDDIR)/browser/test/test.html
	# test-base.js
	echo "(function (exports) {" > $(BUILDDIR)/browser/test/test-base.js
	cat test/test-base.js >> $(BUILDDIR)/browser/test/test-base.js
	echo "})(this.test_base = {});" >> $(BUILDDIR)/browser/test/test-base.js
	sed -i "/\@REMOVE_LINE_FOR_BROWSER/d" $(BUILDDIR)/browser/test/test-base.js
	# test-runmodule.js
	echo "(function (exports) {" > $(BUILDDIR)/browser/test/test-runmodule.js
	cat test/test-runmodule.js >> $(BUILDDIR)/browser/test/test-runmodule.js
	echo "})(this.test_runmodule = {});" >> $(BUILDDIR)/browser/test/test-runmodule.js
	sed -i "/\@REMOVE_LINE_FOR_BROWSER/d" $(BUILDDIR)/browser/test/test-runmodule.js
	# test-runtest.js
	echo "(function (exports) {" > $(BUILDDIR)/browser/test/test-runtest.js
	cat test/test-runtest.js >> $(BUILDDIR)/browser/test/test-runtest.js
	echo "})(this.test_runtest = {});" >> $(BUILDDIR)/browser/test/test-runtest.js
	sed -i "/\@REMOVE_LINE_FOR_BROWSER/d" $(BUILDDIR)/browser/test/test-runtest.js
	# test-testcase.js
	echo "(function (exports) {" > $(BUILDDIR)/browser/test/test-testcase.js
	cat test/test-testcase.js >> $(BUILDDIR)/browser/test/test-testcase.js
	echo "})(this.test_testcase = {});" >> $(BUILDDIR)/browser/test/test-testcase.js
	sed -i "/\@REMOVE_LINE_FOR_BROWSER/d" $(BUILDDIR)/browser/test/test-testcase.js
	# copy nodeunit.js to dist/browser/test to make it easier for me to host and
	# run on windows VMs with IE
	cp $(BUILDDIR)/browser/nodeunit.js $(BUILDDIR)/browser/test/nodeunit.js
	cp $(BUILDDIR)/browser/nodeunit.css $(BUILDDIR)/browser/test/nodeunit.css

build: stamp-build

stamp-build: $(wildcard  deps/* lib/*.js)
	touch $@;
	mkdir -p $(BUILDDIR)/nodeunit
	cp -R bin deps index.js lib package.json $(BUILDDIR)/nodeunit
	printf '#!/bin/sh\n$(NODEJS) $(NODEJSLIBDIR)/$(PACKAGE)/bin/nodeunit $$@' > $(BUILDDIR)/nodeunit.sh

test:
	$(NODEJS) ./bin/nodeunit test

install: build
	install --directory $(NODEJSLIBDIR)
	cp -a $(BUILDDIR)/nodeunit $(NODEJSLIBDIR)
	install --mode=0755 $(BUILDDIR)/nodeunit.sh $(BINDIR)/nodeunit
	install --directory $(MANDIR)/man1/
	cp -a man1/nodeunit.1 $(MANDIR)/man1/

uninstall:
	rm -rf $(NODEJSLIBDIR)/nodeunit $(NODEJSLIBDIR)/nodeunit.js $(BINDIR)/nodeunit
	rm -rf $(MANDIR)/man1/nodeunit.1

clean:
	rm -rf $(BUILDDIR) stamp-build

lint:
	nodelint --config nodelint.cfg ./index.js ./bin/nodeunit ./bin/nodeunit.json ./lib/*.js ./lib/reporters/*.js ./test/*.js

doc: man1 $(DOCS)
	@true

man1:
	@if ! test -d man1 ; then mkdir -p man1 ; fi

# use `npm install ronn` for this to work.
man1/%.1: doc/%.md
	ronn --roff $< > $@

.PHONY: browser test install uninstall build all
