#!/usr/bin/env bash
#
# Before using, clone second version of Bootstrap into `bs-docs` folder and switch to `gh-pages` branch there.

red=$'\e[1;31m'
green=$'\e[1;32m'
blue=$'\e[1;34m'
magenta=$'\e[1;35m'
cyan=$'\e[1;36m'
end=$'\e[0m'

# Get current version from package.json
current_version=$(node -p "require('./package.json').version")

if [[ $# -lt 1 ]]; then
  printf "\n${red}⚠️  Shipping aborted. You must specify a version.\n${end}"
  exit 1
fi

# Pulling latest changes, just to be sure
printf "\n${magenta}🚧  Pulling latest changes...\n\n${end}"
git pull origin v4-dev

# Update version number
printf "\n${magenta}🚧  Updating version number...\n${end}"
npm run release-version $current_version $1

# Compile latest CSS and JS
printf "\n${magenta}🚧  Compile latest CSS and JS...\n${end}"
npm run dist

# Compress the dist files
printf "\n${magenta}🚧  Compressing the dist files...\n${end}"
npm run release-zip

# Compile the docs
printf "\n${magenta}🚧  Compile hosted documentation...\n${end}"
npm run docs-github

# Copy the contents of the built docs site over to `bs-docs` repo
printf "\n${magenta}🚧  Copy it over...\n${end}"
cp -rf _gh_pages/. ../alt-repo/

printf "\n${green}🏁  Success, $1 is ready to review and publish.\n${end}"
