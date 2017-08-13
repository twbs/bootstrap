#!/usr/bin/env bash
#
# Approach:
# 1. Find variable declaration in the form of "$my-var: anyvalue"
# 2. Loop through found variables and find occurrences of each variable in all sass files
# 3. Filter out vars that occurred only once
#
# Run from command line with `build/lint-vars.sh scss`.
#
# Source: https://gist.github.com/badsyntax/6193491

if [ -z "$1" ]; then
	echo "Please specify a directory as the first argument."
	exit 1
fi
if [ ! -d "$1" ]; then
	echo "Not a valid directory."
	exit 1
fi

echo "Finding unused variables. This might take some time..."

vars=$(find "$1" -type f -name "*.scss" -exec grep --color=never -h '^$[a-zA-Z0-9_-][^:]*' {} \; | sed 's/$\([a-zA-Z0-9_-][^:]*\).*/\1/')

for var in $vars; do
	echo -n "Occurrences of \"\$$var\":"
	find "$1" -type f -name "*.scss" -exec grep --color=never -h "$var" "{}" \; | wc -l
done | grep ' 1$'
