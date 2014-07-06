#!/bin/bash
set -e
cd ..  # /bootstrap/
cp test-infra/npm-shrinkwrap.json npm-shrinkwrap.json
npm install
rm npm-shrinkwrap.json
