Directions for upgrading bootstrap core
===========

Using bootstrap extras requires using the LESS framework in your development environment. 
At this time, you can avoid having to do this by simply downloading the latest releases of Bootstrap extras from GitHub.

1. Download complete bootstrap files from http://twitter.github.com/bootstrap
2. Simply paste everything into the root of this directory (at the same level as index.html and 404.html)
3. Edit /less/bootstrap.less
4. After this line:

@import "variables.less"; // Modify this for custom colors, font-sizes, etc

Add this line: 

@import "../overrides/less/variables.less"; // Use our own variables if we want.

So it should look like this:

// Core variables and mixins
@import "variables.less"; // Modify this for custom colors, font-sizes, etc
@import "../overrides/less/variables.less"; // Use our own variables if we want.
@import "mixins.less";

5. In the same file add this to the very end:

//Overrides
@import "../overrides/less/overrides.less";

6. Compile and you're set.