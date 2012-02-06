# The h5bp ant build script

The build script is a tool that optimizes your code for production use on the web.

## Why use it?

Faster page load times and happy end users :)

## What it does

* Combines and minifies javascript (via yui compressor)
* Inlines stylesheets specified using `@import` in your CSS
* Combines and minifies CSS
* Optimizes JPGs and PNGs (with jpegtran & optipng)
* Removes development only code (any remaining console.log files, profiling, test suite)
* Basic to aggressive html minification (via htmlcompressor)
* Autogenerates a cache manifest file (and links from the `html` tag) when you enable a property in the project config file.
* Revises the file names of your assets so that you can use heavy caching (1 year expires).
* Upgrades the .htaccess to use heavier caching
* Updates your HTML to reference these new hyper-optimized CSS + JS files
* Updates your HTML to use the minified jQuery instead of the development version
* Remove unneeded references from HTML (like a root folder favicon)
* Runs your JavaScript through a code quality tool (optional)

<img src="http://html5boilerplate.com/img/chart.png">

## Add the build script to your project

Since we split out the build scripts from the main h5bp repo, you now have more options on how to integrate a build script into your project. Beyond the choice of technology, there's also the choice of how to integrate the build script of choice into your h5bp project or local repo. There is nothing stopping you from manually dropping the build script in to your HTML5 Boilerplate project. That works. 

However, if you'd like to merge it into your main repository and preserve the build script commit history, please follow this workflow: 

```
# Move into your project's git repository
cd my-project
# Create and checkout a new feature branch
git checkout -b ant-build-script
# Create a new remote called "h5bp-ant-bs".
# Fetch the build script from the remote repository.
git remote add -f h5bp-ant-bs git://github.com/h5bp/ant-build-script.git
git merge -s ours --no-commit h5bp-ant-bs/master
# Put the build script into a subdirectory `build/`
git read-tree --prefix=build/ -u h5bp-ant-bs/master
# Commit the merge (preserve the build script history too)
git commit -m "Subtree merge H5BP ant build script"
# Update the build script subtree if needed
git pull -s subtree h5bp-ant-bs master
# Merge back into master branch if everything went according to plan
```

