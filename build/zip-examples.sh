#!/usr/bin/env bash

set -e

# Usage:
# ---------------
# Run zip-examples.sh from the repository root directory

# Get `version` and `version_short` from package.json
version=$(node -p "require('./package.json').version")
version_short=$(node -p "require('./package.json').version_short")

folder_name="bootstrap-$version-examples"

rm -rf "$folder_name"

cp -r "_gh_pages/docs/$version_short/examples/" "$folder_name"
cp -r "_gh_pages/docs/$version_short/dist/" "$folder_name"
rm "$folder_name/index.html"
find "$folder_name" -name "*.html" -exec sed -i "s#\"/docs/$version_short/#\"../#g" '{}' \;
find "$folder_name" -name "*.html" -exec sed -i "s#\(<link href=\"../.*\) integrity=\".*#\1>#" '{}' \;
find "$folder_name" -name "*.html" -exec sed -i "s#\(<script src=\"../.*\) integrity=\".*#\1></script>#" '{}' \;
zip -r9 "$folder_name.zip" "$folder_name"
rm -rf "$folder_name"
