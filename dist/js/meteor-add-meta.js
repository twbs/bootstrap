if (Inject.rawHeads['bootstrap-meta'] === undefined) {
  Inject.rawHead('bootstrap-meta',
  // <meta charset="utf-8"> should not be needed because Meteor server sets the encoding via HTTP header.
  // See discussion at https://github.com/twbs/bootstrap/pull/16880.
  '  <meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
  '  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  '  <!-- The above meta tags *must* come first in the head; any other head content must come *after* these tags -->\n' +
  '  <!-- If you must replace them, run "meteor add meteorhacks:inject-initial" and add server code like this: -->\n' +
  '  <!--   Inject.rawHead("bootstrap-meta", "YOUR REPLACEMENT"); -->\n');
}
