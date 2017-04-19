#!/bin/bash
# Upload built docs to preview.twbsapps.com

# Add build metadata to version
sed -i "/^current_version:/ s/\$/+pr.${TRAVIS_COMMIT}/" _config.yml
bundle exec jekyll build --destination "$TRAVIS_COMMIT" --baseurl "/c/${TRAVIS_COMMIT}"

openssl aes-256-cbc -K $encrypted_2b749c8e6327_key -iv $encrypted_2b749c8e6327_iv -in build/gcp-key.json.enc -out build/gcp-key.json -d
gcloud auth activate-service-account "$GCP_SERVICE_ACCOUNT" --key-file build/gcp-key.json &> /dev/null || (echo 'GCP login failed!'; exit 1)

echo "Uploading to http://preview.twbsapps.com/c/${TRAVIS_COMMIT} ..."
time gsutil -q -m cp -z html,css,js,svg -r "./${TRAVIS_COMMIT}" gs://preview.twbsapps.com/c/
echo 'Done.'
