#!/bin/sh
basedir=`dirname "$0"`

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../uglify-js/bin/uglifyjs" "$@"
  ret=$?
else 
  node  "$basedir/../uglify-js/bin/uglifyjs" "$@"
  ret=$?
fi
exit $ret
