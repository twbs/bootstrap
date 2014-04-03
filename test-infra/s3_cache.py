#!/usr/bin/env python2.7
# pylint: disable=C0301
from __future__ import absolute_import, unicode_literals, print_function, division

from sys import argv
from os import environ, stat, chdir, remove as _delete_file
from os.path import dirname, basename, abspath, realpath, expandvars
from hashlib import sha256
from subprocess import check_call as run
from json import load, dump as save
from contextlib import contextmanager
from datetime import datetime

from boto.s3.connection import S3Connection
from boto.s3.key import Key
from boto.exception import S3ResponseError


CONFIG_FILE = './S3Cachefile.json'
UPLOAD_TODO_FILE = './S3CacheTodo.json'
BYTES_PER_MB = 1024 * 1024


@contextmanager
def timer():
    start = datetime.utcnow()
    yield
    end = datetime.utcnow()
    elapsed = end - start
    print("\tDone. Took", int(elapsed.total_seconds()), "second(s).")


@contextmanager
def todo_file(writeback=True):
    try:
        with open(UPLOAD_TODO_FILE, 'rt') as json_file:
            todo = load(json_file)
    except (IOError, OSError, ValueError):
        todo = {}

    yield todo

    if writeback:
        try:
            with open(UPLOAD_TODO_FILE, 'wt') as json_file:
                save(todo, json_file)
        except (OSError, IOError) as save_err:
            print("Error saving {}:".format(UPLOAD_TODO_FILE), save_err)


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


def mark_needs_uploading(cache_name):
    with todo_file() as todo:
        todo[cache_name] = True


def mark_uploaded(cache_name):
    with todo_file() as todo:
        todo.pop(cache_name, None)


def need_to_upload(cache_name):
    with todo_file(writeback=False) as todo:
        return todo.get(cache_name, False)


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
    mark_uploaded(cache_name)  # reset
    try:
        print("Downloading {} tarball from S3...".format(cache_name))
        with timer():
            key.get_contents_to_filename(_tarball_filename_for(directory))
    except S3ResponseError as err:
        mark_needs_uploading(cache_name)
        raise SystemExit("Cached {} download failed!".format(cache_name))
    print("Downloaded {}.".format(_tarball_size(directory)))
    _extract_tarball(directory)
    print("{} successfully installed from cache.".format(cache_name))


def upload(directory):
    _create_tarball(directory)
    print("Uploading {} tarball to S3... ({})".format(cache_name, _tarball_size(directory)))
    with timer():
        key.set_contents_from_filename(_tarball_filename_for(directory))
    print("{} cache successfully updated.".format(cache_name))
    mark_uploaded(cache_name)


if __name__ == '__main__':
    # Uses environment variables:
    #   AWS_ACCESS_KEY_ID -- AWS Access Key ID
    #   AWS_SECRET_ACCESS_KEY -- AWS Secret Access Key
    argv.pop(0)
    if len(argv) != 2:
        raise SystemExit("USAGE: s3_cache.py <download | upload> <cache name>")
    mode, cache_name = argv
    script_dir = dirname(realpath(__file__))
    chdir(script_dir)
    try:
        with open(CONFIG_FILE, 'rt') as config_file:
            config = load(config_file)
    except (IOError, OSError, ValueError) as config_err:
        print(config_err)
        raise SystemExit("Error when trying to load config from JSON file!")

    try:
        cache_info = config[cache_name]
        key_file = expandvars(cache_info["key"])
        fallback_cmd = cache_info["generate"]
        directory = expandvars(cache_info["cache"])
    except (TypeError, KeyError) as load_err:
        print(load_err)
        raise SystemExit("Config for cache named {!r} is missing or malformed!".format(cache_name))

    try:
        try:
            BUCKET_NAME = environ['TWBS_S3_BUCKET']
        except KeyError:
            raise SystemExit("TWBS_S3_BUCKET environment variable not set!")

        conn = S3Connection()
        bucket = conn.lookup(BUCKET_NAME)
        if bucket is None:
            raise SystemExit("Could not access bucket!")

        key_file_hash = _sha256_of_file(key_file)

        key = Key(bucket, key_file_hash)
        key.storage_class = 'REDUCED_REDUNDANCY'

        if mode == 'download':
            download(directory)
        elif mode == 'upload':
            if need_to_upload(cache_name):
                upload(directory)
            else:
                print("No need to upload anything.")
        else:
            raise SystemExit("Unrecognized mode {!r}".format(mode))
    except BaseException as exc:
        if mode != 'download':
            raise
        print("Error!:", exc)
        print("Unable to download from cache.")
        print("Running fallback command to generate cache directory {!r}: {}".format(directory, fallback_cmd))
        with timer():
            run(fallback_cmd, shell=True)
