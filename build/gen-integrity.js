const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function generateIntegrity(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha384').update(fileBuffer).digest('base64');
  console.log(`${path.basename(filePath)}:\nsha384-${hash}`);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node build/gen-integrity.js <file>");
  process.exit(1);
}

args.forEach(generateIntegrity);