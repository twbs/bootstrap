#!/usr/bin/env python2.7
from __future__ import absolute_import, unicode_literals, print_function, division

import sys
import os
from json import dumps as json_serialize

from boto.s3.connection import S3Connection
from boto.s3.key import Key


try:
    BUCKET_NAME = os.environ['AWS_S3_BUCKET_TWBS_SCREENSHOTS']
except KeyError:
    raise SystemExit("AWS_S3_BUCKET_TWBS_SCREENSHOTS environment variable not set!")


def local_screenshot_filepaths():
    for dirpath, dirnames, filenames in os.walk('screenshots'):
        for filename in filenames:
            if filename.endswith('.png'):
                yield os.path.join(dirpath, filename)


def remote_filepath_for(local_filepath, commit_id):
    base_path, local_filename = os.path.split(local_filepath)
    extensionless_filename, extension = os.path.splitext(local_filename)
    browser, platform, version = extensionless_filename.split('-')
    if not version:
        version = 'latest'
    dest_filepath = os.path.join(base_path, browser, platform, version, commit_id) + extension
    return dest_filepath


if __name__ == '__main__':
    # Uses environment variables:
    #   AWS_ACCESS_KEY_ID -- AWS Access Key ID
    #   AWS_SECRET_ACCESS_KEY -- AWS Secret Access Key
    sys.argv.pop(0)
    if len(sys.argv) != 1:
        raise SystemExit("USAGE: store_screenshots.py <commit ID>")
    commit_id = sys.argv[0]

    conn = S3Connection()
    bucket = conn.lookup(BUCKET_NAME)
    if bucket is None:
        raise SystemExit("Could not access bucket!")

    local2remote = {local_filepath: remote_filepath_for(local_filepath, commit_id) for local_filepath in local_screenshot_filepaths()}
    manifest = {
        'screenshots': local2remote.keys()
    }
    manifest_json = json_serialize(manifest)
    manifest_filepath = 'commits/{}/manifest.json'.format(commit_id)

    manifest_key = Key(bucket, manifest_filepath)
    manifest_key.set_contents_from_string(manifest_json)
    print("Uploading manifest {} ...".format(manifest_filepath))

    for local_filepath, remote_filepath in local2remote.iteritems():
        print("Uploading screenshot {} ...".format(local_filepath))
        screenshot_key = Key(bucket, remote_filepath)
        screenshot_key.set_contents_from_filename(local_filepath)
