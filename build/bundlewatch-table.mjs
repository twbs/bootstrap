#!/usr/bin/env node

import { execSync } from 'child_process';

// Run bundlewatch and capture output
let stdout;
let exitCode = 0;

try {
  stdout = execSync('npx bundlewatch --config .bundlewatch.config.json', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
} catch (error) {
  stdout = error.stdout || '';
  exitCode = error.status || 1;
}

// Parse lines that contain PASS or FAIL
const lines = stdout.split('\n').filter(l => l.startsWith('PASS') || l.startsWith('FAIL'));

if (lines.length === 0) {
  console.log(stdout);
  process.exit(exitCode);
}

// Parse size string to number (KB)
const parseSize = (str) => parseFloat(str.replace('KB', ''));

// Calculate column widths and headroom
const rows = lines.map(line => {
  const match = line.match(/(PASS|FAIL)\s+(.+?):\s+([\d.]+KB)\s+([<>])\s+([\d.]+KB)/);
  if (match) {
    const sizeNum = parseSize(match[3]);
    const maxNum = parseSize(match[5]);
    const headroomNum = maxNum - sizeNum;
    const headroom = headroomNum.toFixed(2) + 'KB';
    return {
      status: match[1],
      file: match[2],
      size: match[3],
      max: match[5],
      headroomNum,
      headroom: match[1] === 'PASS' ? `+${headroom}` : `-${Math.abs(headroomNum).toFixed(2)}KB`
    };
  }
  return null;
}).filter(Boolean);

const maxFileLen = Math.max(...rows.map(r => r.file.length), 4);
const maxSizeLen = Math.max(...rows.map(r => r.size.length), 4);
const maxMaxLen = Math.max(...rows.map(r => r.max.length), 3);
const maxHeadroomLen = Math.max(...rows.map(r => r.headroom.length), 8);

// Build table
const hr = `+-${'-'.repeat(maxFileLen)}-+-${'-'.repeat(maxSizeLen)}-+-${'-'.repeat(maxMaxLen)}-+-${'-'.repeat(maxHeadroomLen)}-+`;

console.log('');
console.log('bundlewatch results');
console.log(hr);
console.log(`| ${'File'.padEnd(maxFileLen)} | ${'Size'.padStart(maxSizeLen)} | ${'Max'.padStart(maxMaxLen)} | ${'Headroom'.padStart(maxHeadroomLen)} |`);
console.log(hr);

const green = '\x1b[32m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

for (const row of rows) {
  const sizeColor = row.status === 'PASS' ? green : red;
  const coloredSize = `${sizeColor}${row.size.padStart(maxSizeLen)}${reset}`;
  const headroomColor = row.headroomNum > 0.25 ? red : '';
  const headroomReset = row.headroomNum > 0.25 ? reset : '';
  const coloredHeadroom = `${headroomColor}${row.headroom.padStart(maxHeadroomLen)}${headroomReset}`;
  console.log(`| ${row.file.padEnd(maxFileLen)} | ${coloredSize} | ${row.max.padStart(maxMaxLen)} | ${coloredHeadroom} |`);
}

console.log(hr);

// Summary
const passed = rows.filter(r => r.status === 'PASS').length;
const failed = rows.filter(r => r.status === 'FAIL').length;

console.log('');
if (failed > 0) {
  console.log(`\x1b[31mbundlewatch FAIL\x1b[0m - ${passed} passed, ${failed} failed`);
} else {
  console.log(`\x1b[32mbundlewatch PASS\x1b[0m - ${passed}/${rows.length} files within limits`);
}
console.log('');

process.exit(exitCode);
