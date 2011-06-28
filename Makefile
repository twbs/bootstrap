# NOTE: you must have the less npm package installed globally to build!
# To install run: npm install less -g
# ProTip: watchr -e "watch('lib/.*\.less') { system 'make' }"

build:
	@lessc ./lib/bootstrap.less > ./bootstrap-1.0.0.css
	@lessc ./lib/bootstrap.less > ./bootstrap-1.0.0.min.css --compress
	@echo "Bootstrap successfully built! - `date`"

.PHONY: build