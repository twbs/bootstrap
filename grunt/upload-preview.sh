#!/bin/bash
# Upload built docs to preview.twbsapps.com

if [ "$TRAVIS_REPO_SLUG" != twbs-savage/bootstrap ]; then exit 0; fi

# Add build metadata to version
sed -i "/^current_version:/ s/\$/+pr.${TRAVIS_COMMIT}/" _config.yml
# Fix URLs since the site's root is now a subdirectory
echo "baseurl: /c/${TRAVIS_COMMIT}" >> _config.yml
bundle exec jekyll build --destination "$TRAVIS_COMMIT"

# Install gcloud & gsutil
GSUTIL_VERSION=$(gsutil version | cut -d ' ' -f 3)
if [ ! -d "${HOME}/google-cloud-sdk" ] || [ "${GSUTIL_VERSION}" != '4.19' ]; then
  rm -rf "${HOME}/google-cloud-sdk" # Kill Travis' outdated non-updateable preinstalled version
  echo 'Installing google-cloud-sdk...'
  export CLOUDSDK_CORE_DISABLE_PROMPTS=1
  time (curl -S -s https://sdk.cloud.google.com | bash &>/dev/null)
  echo 'Done.'
fi
source "${HOME}/google-cloud-sdk/path.bash.inc"

openssl aes-256-cbc -K $encrypted_2b749c8e6327_key -iv $encrypted_2b749c8e6327_iv -in grunt/gcp-key.json.enc -out grunt/gcp-key.json -d
gcloud auth activate-service-account "$GCP_SERVICE_ACCOUNT" --key-file grunt/gcp-key.json &> /dev/null || (echo 'GCP login failed!'; exit 1)

echo "Uploading to http://preview.twbsapps.com/c/${TRAVIS_COMMIT} ..."
time gsutil -q -m cp -z html,css,js,svg -r "./${TRAVIS_COMMIT}" gs://preview.twbsapps.com/c/
echo 'Done.'
