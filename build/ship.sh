#!/usr/bin/env bash
#
# Usage
# ---------------
# 1. Clone second version of Bootstrap in sibling directory named `bs-docs`.
# 2. Within `bs-docs` copy, switch to `gh-pages` branch.
# 3. Pull latest, re-bundle, re-npm.
# 4. Run script.

red=$'\e[1;31m'
green=$'\e[1;32m'
#blue=$'\e[1;34m'
magenta=$'\e[1;35m'
#cyan=$'\e[1;36m'
end=$'\e[0m'

# Get current version from package.json
current_version=$(node -p "require('./package.json').version")

if [[ $# -lt 1 ]]; then
  printf "\n%s⚠️  Shipping aborted. You must specify a version.\n%s" $red $end
  exit 1
fi

# Pulling latest changes, just to be sure
printf "\n%s=======================================================%s" $magenta $end
printf "\n%sPulling latest changes...%s" $magenta $end
printf "\n%s=======================================================\n\n%s" $magenta $end
git pull origin v4-dev

# Update version number
printf "\n%s=======================================================%s" $magenta $end
printf "\n%sUpdating version number...%s" $magenta $end
printf "\n%s=======================================================\n%s" $magenta $end
npm run release-version "$current_version" "$1"

# Build release
printf "\n%s=======================================================%s" $magenta $end
printf "\n%sBuilding release..%s" $magenta $end
printf "\n%s=======================================================\n%s" $magenta $end
npm run release

# Copy the contents of the built docs site over to `bs-docs` repo
printf "\n%s=======================================================%s" $magenta $end
printf "\n%sCopy it over...%s" $magenta $end
printf "\n%s=======================================================\n%s" $magenta $end
cp -rf _gh_pages/. ../bs-docs/
printf "\nDone!\n"

printf "\n%s=======================================================%s" $green $end
printf "\n%sSuccess, $1 is ready to review and publish.%s" $green $end
printf "\n%s=======================================================\n\n%s" $green $end
