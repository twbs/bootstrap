all:
	npm -g i .

lint:
	npm run-script pretest

test:
	npm test

coverage: test
	rm -rRf ../ycssmin-pages/*
	cp -R ./coverage/lcov-report/* ../ycssmin-pages/

.PHONY: lint coverage test
