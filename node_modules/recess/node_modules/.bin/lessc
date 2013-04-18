#!/bin/sh
basedir=`dirname "$0"`

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../less/bin/lessc" "$@"
  ret=$?
else 
  node  "$basedir/../less/bin/lessc" "$@"
  ret=$?
fi
exit $ret
