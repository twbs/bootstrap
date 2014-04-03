#!/bin/bash
set -e
cd ..  # /bootstrap/
cp test-infra/npm-shrinkwrap.canonical.json npm-shrinkwrap.json
npm install
rm npm-shrinkwrap.json
