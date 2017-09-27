'use strict'

const childProcess = require('child_process')
const fs = require('fs')

if (fs.existsSync('vnu.jar')) {
  childProcess.exec('java -version', function (error) {
    if (error) {
      console.error('skipping HTML lint test. java missing.')
      return
    }

    const vnu = childProcess.spawn(
                                   'java',
                                   ['-jar', 'vnu.jar', '--skip-non-html', '_gh_pages/'],
                                   { stdio: 'inherit' }
                                  )

    vnu.on('exit', process.exit)
  })
} else {
  console.error('skipping HTML lint test. vnu.jar missing.')
}
