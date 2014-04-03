#!/usr/bin/env python2.7
from __future__ import absolute_import, unicode_literals, print_function, division

from sys import argv
from os import environ, stat, remove as _delete_file
from os.path import isfile, dirname, basename, abspath
from hashlib import sha256
from subprocess import check_call as run
from contextlib import contextmanager
from datetime import datetime

from boto.s3.connection import S3Connection
from boto.s3.key import Key
from boto.exception import S3ResponseError


NEED_TO_UPLOAD_MARKER = '.need-to-upload'
BYTES_PER_MB = 1024 * 1024
try:
    BUCKET_NAME = environ['TWBS_S3_BUCKET']
except KeyError:
    raise SystemExit("TWBS_S3_BUCKET environment variable not set!")


@contextmanager
def timer():
    start = datetime.utcnow()
    yield
    end = datetime.utcnow()
    elapsed = end - start
    print("\tDone. Took", int(elapsed.total_seconds()), "seconds.")


def _sha256_of_file(filename):
    hasher = sha256()
    with open(filename, 'rb') as input_file:
        hasher.update(input_file.read())
    file_hash = hasher.hexdigest()
    print('sha256({}) = {}'.format(filename, file_hash))
    return file_hash


def _delete_file_quietly(filename):
    try:
        _delete_file(filename)
    except (OSError, IOError):
        pass


def _tarball_size(directory):
    kib = stat(_tarball_filename_for(directory)).st_size // BYTES_PER_MB
    return "{} MiB".format(kib)


def _tarball_filename_for(directory):
    return abspath('./{}.tar.gz'.format(basename(directory)))


def _create_tarball(directory):
    print("Creating tarball of {}...".format(directory))
    with timer():
        run(['tar', '-czf', _tarball_filename_for(directory), '-C', dirname(directory), basename(directory)])


def _extract_tarball(directory):
    print("Extracting tarball of {}...".format(directory))
    with timer():
        run(['tar', '-xzf', _tarball_filename_for(directory), '-C', dirname(directory)])


def download(directory):
    _delete_file_quietly(NEED_TO_UPLOAD_MARKER)
    try:
        print("Downloading {} tarball from S3...".format(friendly_name))
        with timer():
            key.get_contents_to_filename(_tarball_filename_for(directory))
    except S3ResponseError as err:
        open(NEED_TO_UPLOAD_MARKER, 'a').close()
        print(err)
        raise SystemExit("Cached {} download failed!".format(friendly_name))
    print("Downloaded {}.".format(_tarball_size(directory)))
    _extract_tarball(directory)
    print("{} successfully installed from cache.".format(friendly_name))


def upload(directory):
    _create_tarball(directory)
    print("Uploading {} tarball to S3... ({})".format(friendly_name, _tarball_size(directory)))
    with timer():
        key.set_contents_from_filename(_tarball_filename_for(directory))
    print("{} cache successfully updated.".format(friendly_name))
    _delete_file_quietly(NEED_TO_UPLOAD_MARKER)


if __name__ == '__main__':
    # Uses environment variables:
    #   AWS_ACCESS_KEY_ID -- AWS Access Key ID
    #   AWS_SECRET_ACCESS_KEY -- AWS Secret Access Key
    argv.pop(0)
    if len(argv) != 4:
        raise SystemExit("USAGE: s3_cache.py <download | upload> <friendly name> <dependencies file> <directory>")
    mode, friendly_name, dependencies_file, directory = argv

    conn = S3Connection()
    bucket = conn.lookup(BUCKET_NAME)
    if bucket is None:
        raise SystemExit("Could not access bucket!")

    dependencies_file_hash = _sha256_of_file(dependencies_file)

    key = Key(bucket, dependencies_file_hash)
    key.storage_class = 'REDUCED_REDUNDANCY'

    if mode == 'download':
        download(directory)
    elif mode == 'upload':
        if isfile(NEED_TO_UPLOAD_MARKER):  # FIXME
            upload(directory)
        else:
            print("No need to upload anything.")
    else:
        raise SystemExit("Unrecognized mode {!r}".format(mode))
