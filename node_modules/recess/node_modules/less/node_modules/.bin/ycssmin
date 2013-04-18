#!/bin/sh
basedir=`dirname "$0"`

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../ycssmin/bin/cssmin" "$@"
  ret=$?
else 
  node  "$basedir/../ycssmin/bin/cssmin" "$@"
  ret=$?
fi
exit $ret
