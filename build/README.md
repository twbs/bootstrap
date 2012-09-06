# Twitter Bootstrap Build System

For quick help, type `./build/build` in the top level of the repo.

## Usage

    node ./build/build [target]

The targets are either specific distros of Twitter Bootstrap, or cleaning all the built distros.

## Targets

### docs

This is the original "bootstrap" target. It provides documentation, and some easy-to-folow examples.

### minimal

Very tiny example, that uses jquery from Google's CDN. This is a good start for a new project.

### clean

__BE CAREFUL!__ this will delete all the files, without warning, in your distro dir.

## Make your own

It's a snap to add your own, just make a node.js module in build/targets/YOURTARGET/build. You can use "minimal" as an example that uses javascript microtemplates, and "docs" is an example made with mustache. Your module needs to have a `build(argv)` function, where argv is all the pre-parsed command-line options. Make sure you have a package.json file that looks like this:

    {
      "name": "bootstrap-minimal-builder",
      "version": "0.0.1",
      "description": "build minimal bootstrap starter",
      "dependencies": { }
    }

The "description" field will be used in the help for the build system.
