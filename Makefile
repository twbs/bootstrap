# NOTE: you must have the less npm package installed globally to build!
# To install less package run: $npm install less -g
# watchr -e "watch('lib/.*\.less') { system 'make' }"

build:
	@lessc ./lib/bootstrap.less > ./bootstrap-1.0.0.css
	@lessc ./lib/bootstrap.less > ./bootstrap-1.0.0.min.css --compress
	@echo "Bootstrap successfully built! - `date`"

watch:
	@echo "Watching less files for changes..."
	@watchr -e "watch('lib/.*\.less') { system 'make' }"

.PHONY: build