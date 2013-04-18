#
# Run all tests
#
test: 
	node test/less-test.js

#
# Run benchmark
#
benchmark:
	node benchmark/less-benchmark.js

#
# Build less.js
#
SRC = lib/less
HEADER = build/header.js
VERSION = `cat package.json | grep version \
														| grep -o '[0-9]\.[0-9]\.[0-9]\+'`
DIST = dist/less-${VERSION}.js
RHINO = dist/less-rhino-${VERSION}.js
DIST_MIN = dist/less-${VERSION}.min.js

browser-prepare: DIST := test/browser/less.js

less:
	@@mkdir -p dist
	@@touch ${DIST}
	@@cat ${HEADER} | sed s/@VERSION/${VERSION}/ > ${DIST}
	@@echo "(function (window, undefined) {" >> ${DIST}
	@@cat build/require.js\
	      build/ecma-5.js\
	      ${SRC}/parser.js\
	      ${SRC}/functions.js\
	      ${SRC}/colors.js\
	      ${SRC}/tree/*.js\
	      ${SRC}/tree.js\
	      ${SRC}/browser.js\
	      build/amd.js >> ${DIST}
	@@echo "})(window);" >> ${DIST}
	@@echo ${DIST} built.
	
browser-prepare: less
	node test/browser-test-prepare.js
	
browser-test: browser-prepare
	phantomjs test/browser/phantom-runner.js

browser-test-server: browser-prepare
	phantomjs test/browser/phantom-runner.js --no-tests

rhino:
	@@mkdir -p dist
	@@touch ${RHINO}
	@@cat build/require-rhino.js\
	      build/ecma-5.js\
	      ${SRC}/parser.js\
	      ${SRC}/functions.js\
	      ${SRC}/colors.js\
	      ${SRC}/tree/*.js\
	      ${SRC}/tree.js\
	      ${SRC}/rhino.js > ${RHINO}
	@@echo ${RHINO} built.

min: less
	@@echo minifying...
	@@uglifyjs ${DIST} > ${DIST_MIN}
	@@echo ${DIST_MIN} built.

server: less
	cp dist/less-${VERSION}.js test/html/
	cd test/html && python -m SimpleHTTPServer

clean:
	git rm dist/*

dist: clean min
	git add dist/*
	git commit -a -m "(dist) build ${VERSION}"
	git archive master --prefix=less/ -o less-${VERSION}.tar.gz
	npm publish less-${VERSION}.tar.gz

stable:
	npm tag less ${VERSION} stable


.PHONY: test benchmark
