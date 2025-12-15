import fs from 'fs';
import Papa from 'papaparse';

const csv = fs.readFileSync('./public/spells.csv', 'utf8');
const parsed = Papa.parse(csv, { header: true });
const sources = new Set();
parsed.data.forEach(row => {
  if (row.source) sources.add(row.source);
});
console.log([...sources].sort().join('\n'));
console.log('\nTotal sources:', sources.size);

