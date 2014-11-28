#!/bin/sh
# Test Meteor package before publishing to Atmospherejs.com

# Make sure Meteor is installed, per https://www.meteor.com/install. The curl'ed script is totally safe; takes 2 minutes to read its source and check.
type meteor >/dev/null 2>&1 || { curl https://install.meteor.com/ | sh; }

# sanity check: make sure we're in the root directory of the checkout
cd "$( dirname "$0" )/.."

# run tests and delete the temporary package.js even if Ctrl+C is pressed
int_trap() {
  echo
  printf "Tests interrupted. Hopefully you verified in the browser that tests pass?\n\n"
}

trap int_trap INT

# test any package*.js packages we may have, e.g. package.js, package-compat.js
for PACKAGE_FILE in meteor/package*.js; do

  PACKAGE_NAME=$(grep -i name $PACKAGE_FILE | head -1 | cut -d "'" -f 2)

  echo "Testing $PACKAGE_NAME..."

  # Meteor expects package.js to be in the root directory of the checkout, so copy there our package file under that name, temporarily
  cp $PACKAGE_FILE ./package.js

  # provide an invalid MONGO_URL so Meteor doesn't bog us down with an empty Mongo database
  MONGO_URL=mongodb:// meteor test-packages ./

  rm -rf ".build.$PACKAGE_NAME"
  rm -rf ".build.local-test:$PACKAGE_NAME"
  rm versions.json 2>/dev/null

  rm package.js

done
