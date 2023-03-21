// import * as path from 'path';
import * as fs from 'fs/promises';
import * as diff from 'fast-array-diff';
// import { argv } from 'node:process';
import { getCssClasses } from './getCssClasses.mjs';

// TODO: not run this script all the time
// TODO: retrieve the lists of Bootstrap versions (with GitHub API)
const versions = ["4.6.2", "5.0.0", "5.1.3"]
const currentVersion = "5.3.0"
const currentShortVersion = "5.3"

const currentVersionClasses = await getCssClasses('dist/css/bootstrap.css')

for (const version of versions) {
  const bootstrapCssPath = `https://cdn.jsdelivr.net/npm/bootstrap@${version}/dist/css/bootstrap.css`

  const versionClasses = await getCssClasses(bootstrapCssPath)

  const outputJSONContent = diff.diff(
    versionClasses.classes,
    currentVersionClasses.classes
  )

  outputJSONContent['same'] = diff.same(
    versionClasses.classes,
    currentVersionClasses.classes
  )

  const outputFileDir = `./site/static/docs/${currentShortVersion}/assets/json/diffs/`
  await fs.mkdir(outputFileDir, { recursive: true })

  const outputFilePath = `${outputFileDir}/bootstrap-from-${version}-to-${currentVersion}.diff.json`
  await fs.writeFile(outputFilePath, JSON.stringify(outputJSONContent))
}

/*
try {
  const args = argv.slice(2);

  // TODO: check the size of args: must be 2
  const fromPath = args[0]
  const toPath = args[1]

  const from = await fs.readFile(fromPath, 'utf8');
  const to = await fs.readFile(toPath, 'utf8');

  const fromClasses = JSON.parse(from)["classes"];
  const toClasses = JSON.parse(to)["classes"];

  const outputJSONContent = diff.diff(
    fromClasses,
    toClasses
  )

  outputJSONContent['same'] = diff.same(
    fromClasses,
    toClasses
  )

  // TODO: add "from"/"to" keys?

  const outputFilePath = args[2] ?? `from_${path.parse(fromPath).name}_to_${path.parse(toPath).name}.diff.json`
  await fs.writeFile(outputFilePath, JSON.stringify(outputJSONContent))
}
catch(error) {
  // console.log(error)
  console.log(`Usage: node diff.mjs <fromPath> <toPath> <outputPath>
  - fromPath: JSON file
  - toPath: JSON file
  - outputPath: JSON file (optional). Default value will be 'from_<fromPath>_to_<toPath>.diff.json'
  `)
}
*/
