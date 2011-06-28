# NOTE: you must have the less npm package installed globally to build!
# To install run: npm install less -g

build:
	@lessc ./lib/bootstrap.less > ./bootstrap-1.0.0.css
	@lessc ./lib/bootstrap.less > ./bootstrap-1.0.0.min.css --compress

.PHONY: build