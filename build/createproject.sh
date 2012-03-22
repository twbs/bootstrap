#!/usr/bin/env bash

#Generate a new project from your HTML5 Boilerplate repo clone
#by: Rick Waldron & Michael Cetrulo


##first run
# $ cd  html5-boilerplate/build
# $ chmod +x createproject.sh && ./createproject.sh [new_project]

##usage
# $ cd  html5-boilerplate/build
# $ ./createproject.sh [new_project]

#
# If [new_project] is not specified the user we will prompted to enter it.
#
# The format of [new_project] should ideally be lowercase letters with no
# spaces as it represents the directory name that your new project will live
# in.
#
# If the new project is specified as just a name ( "foo" ) then the path
# will be a sibling to html5-boilerplate's directory.
#
# If the new project is specified with an absolute path ( "/home/user/foo" )
# that path will be used.
#

# find project root (also ensure script is ran from within repo)
src=$(git rev-parse --show-toplevel) || {
  echo "try running the script from within html5-boilerplate directories." >&2
  exit 1
}
[[ -d $src ]] || {
  echo "fatal: could not determine html5-boilerplate's root directory." >&2
  echo "try updating git." >&2
  exit 1
}

if [ $# -eq 1 ]
then
    # get a name for new project from command line arguments
    name="$1"
fi

# get a name for new project from input
while [[ -z $name ]]
do
    echo "To create a new html5-boilerplate project, enter a new directory name:"
    read name || exit
done

if [[ "$name" = /* ]]
then
    dst=$name
else
    dst=$src/../$name
fi

if [[ -d $dst ]]
then
    echo "$dst exists"
else
    #create new project
    mkdir -p -- "$dst" || exit 1

    #success message
    echo "Created Directory: $dst"

    cd -- "$src"
    cp -vr -- css js img build *.html *.xml *.txt *.png *.ico .htaccess "$dst"

    #success message
    echo "Created Project: $dst"
fi

