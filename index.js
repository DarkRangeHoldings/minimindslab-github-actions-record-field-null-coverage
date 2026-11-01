import { appendFileSync } from 'node:fs';

const payloadRaw = process.env.INPUT_PAYLOAD;
const outputPath = process.env.GITHUB_OUTPUT;

function fail(message) {
  throw new Error(message);
}

if (typeof payloadRaw !== 'string') fail('Invalid input');
if (typeof outputPath !== 'string' || outputPath.length === 0) fail('Invalid output');

let parsed;
try {
  parsed = JSON.parse(payloadRaw);
} catch {
  fail('Invalid input');
}

if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) fail('Invalid input');

const { records, field } = parsed;

if (!Array.isArray(records)) fail('Invalid input');
if (typeof field !== 'string' || field.length === 0) fail('Invalid input');

let missing = 0;
let nulls = 0;
let present = 0;

for (const record of records) {
  if (record === null || typeof record !== 'object' || Array.isArray(record)) fail('Invalid input');
  if (Object.prototype.hasOwnProperty.call(record, field)) {
    present += 1;
    if (record[field] === null) nulls += 1;
  } else {
    missing += 1;
  }
}

const result = { missing, nulls, present, total: records.length };
appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);