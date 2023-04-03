import * as path from 'path';
import { argv } from 'node:process';
import * as fs from 'fs/promises';
import { getCssClasses } from './getCssClasses.mjs';

try {
  const args = argv.slice(2);

  const fileClasses = await getCssClasses(args[0]);

  const outputFilePath = args[1] ?? `${path.parse(args[0]).name}.json`

  await fs.writeFile(outputFilePath, JSON.stringify(fileClasses))
}
catch (error) {
  // console.log(error)
  // TODO: inputPath could be an HTTP link
  console.log(`Usage: node glossary.mjs <inputPath> <outputPath>
  - inputPath: CSS file to parse
  - outputPath: JSON file (optional). Default value is: <inputPath>.json
  `)
}
