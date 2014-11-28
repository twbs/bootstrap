#!/bin/bash
# Publish package on Meteor's Atmosphere.js

# Make sure Meteor is installed, per https://www.meteor.com/install. The curl'ed script is totally safe; takes 2 minutes to read its source and check.
type meteor >/dev/null 2>&1 || { curl https://install.meteor.com/ | sh; }

# sanity check: make sure we're in the root directory of the checkout
cd "$( dirname "$0" )/.."


function cleanup() {
  # we copied the file as package.js, regardless of its original name
  rm package.js

  # temporary build files
  rm -rf ".build.$PACKAGE_NAME" versions.json
}


# publish separately any package*.js files we have, e.g. package.js, package-compat.js
for PACKAGE_FILE in meteor/package*.js; do

  # Meteor expects package.js to be in the root directory of the checkout, so copy there our package file under that name, temporarily
  cp $PACKAGE_FILE ./package.js

  # publish package, creating it if it's the first time we're publishing
  PACKAGE_NAME=$(grep -i name $PACKAGE_FILE | head -1 | cut -d "'" -f 2)
  ATMOSPHERE_NAME=${PACKAGE_NAME/://}

  echo "Publishing $PACKAGE_NAME..."

  # attempt to re-publish the package - the most common operation once the initial release has been made
  POTENTIAL_ERROR=$( meteor publish 2>&1 )

  if [[ $POTENTIAL_ERROR =~ "There is no package named" ]]; then
    # actually this is the first time the package is created, so pass the special --create flag and congratulate the maintainer
    echo "Thank you for creating the official Meteor package for this library!"
    if meteor publish --create; then
      echo "Please post the following to https://github.com/raix/Meteor-community-discussions/issues/14:

--------------------------------------------- 8< --------------------------------------------------------

Happy to announce that I've published the official $PACKAGE_NAME to Atmosphere. Please star!
https://atmospherejs.com/$ATMOSPHERE_NAME

--------------------------------------------- >8 --------------------------------------------------------

"
    else
      echo "We got an error. Please post it at https://github.com/raix/Meteor-community-discussions/issues/14"
      cleanup
      exit 1
    fi
  else
    if (( $? > 0 )); then
      # the error wasn't that the package didn't exist, so we need to ask for help
      echo "We got an error. Please post it at https://github.com/raix/Meteor-community-discussions/issues/14:
--------------------------------------------- 8< --------------------------------------------------------
$POTENTIAL_ERROR
--------------------------------------------- >8 --------------------------------------------------------
"
      cleanup
      exit 1
    else
      echo "Thanks for releasing a new version of $PACKAGE_NAME! You can see it at
https://atmospherejs.com/$ATMOSPHERE_NAME"
    fi
  fi

  cleanup

done
