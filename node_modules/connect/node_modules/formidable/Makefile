SHELL := /bin/bash

test:
	@./test/run.js

build: npm test

npm:
	npm install .

clean:
	rm test/tmp/*

.PHONY: test clean build
