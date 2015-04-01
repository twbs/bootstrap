#! /bin/sh

grunt travis
rc=$?
if [ "$rc" -ne 0 ] ; then
    exit $rc
fi

# test compass install
FOUNDATION_COMPASS_TEMPLATE=foundation-compass-template
FOUNDATION_LIBSASS_TEMPLATE=foundation-libsass-template

mkdir test
cd test
if [ -d "${FOUNDATION_COMPASS_TEMPLATE}" ]; then
  rm -rf $FOUNDATION_COMPASS_TEMPLATE
fi
git clone git://github.com/zurb/${FOUNDATION_COMPASS_TEMPLATE}.git
cd $FOUNDATION_COMPASS_TEMPLATE
rm bower.json
bower install ../../dist/assets --save
cp -f bower_components/foundation/scss/foundation/_settings.scss scss/_settings.scss
bundle install
bundle exec compass compile
rc=$?
if [ "$rc" -ne 0 ] ; then
    echo "[FAILURE] Compass Build"
    exit $rc
fi
rm stylesheets/app.css
sed -e 's/^\/\/ @/@/' -e 's/^\/\/ \$/\$/' scss/_settings.scss > scss/_settings.scss
bundle exec compass compile
rc=$?
if [ "$rc" -ne 0 ] ; then
    echo "[FAILURE] Compass Build w/_settings.scss"
    exit $rc
fi
rm stylesheets/app.css
echo "[SUCCESS] Compass Build"

# test sass-only install
cp -f bower_components/foundation/scss/foundation/_settings.scss scss/_settings.scss
bundle exec sass --load-path bower_components/foundation/scss scss/app.scss:stylesheets/app.css
rc=$?
if [ "$rc" -ne 0 ] ; then
    echo "[FAILURE] Ruby Sass Build"
    exit $rc
fi
rm stylesheets/app.css
sed -e 's/^\/\/ @/@/' -e 's/^\/\/ \$/\$/' scss/_settings.scss > scss/_settings.scss
bundle exec sass --load-path bower_components/foundation/scss scss/app.scss:stylesheets/app.css
rc=$?
if [ "$rc" -ne 0 ] ; then
    echo "[FAILURE] Ruby Sass Build w/_settings.scss"
    exit $rc
fi
rm stylesheets/app.css
echo "[SUCCESS] Ruby Sass Build"

# test libsass install
#cd ..
#if [ -d "${FOUNDATION_LIBSASS_TEMPLATE}" ]; then
#  rm -rf $FOUNDATION_LIBSASS_TEMPLATE
#fi
#git clone git://github.com/zurb/${FOUNDATION_LIBSASS_TEMPLATE}.git
#cd $FOUNDATION_LIBSASS_TEMPLATE
#SUDO=''
#if (( $EUID != 0 )); then
#    SUDO='sudo'
#fi
#$SUDO npm install
#bower install ../../dist/assets --save
#cp -f bower_components/foundation/scss/foundation/_settings.scss scss/_settings.scss
#grunt sass:dist
#rc=$?
#if [ "$rc" -ne 0 ] ; then
#    echo "[FAILURE] Node Libsass Build"
#    exit $rc
#fi
#rm css/app.css
#sed -e 's/^\/\/ @/@/' -e 's/^\/\/ \$/\$/' scss/_settings.scss > scss/_settings.scss
#grunt sass:dist
#rc=$?
#if [ "$rc" -ne 0 ] ; then
#    echo "[FAILURE] Node Libsass Build w/_settings.scss"
#    exit $rc
#fi
#rm css/app.css
#echo "[SUCCESS] Node Libsass Build"
