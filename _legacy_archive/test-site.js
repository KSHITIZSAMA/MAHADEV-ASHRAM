const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- CHECKING ASSETS ---');
let missing = 0;
$('img').each((i, el) => {
  const src = $(el).attr('src');
  if (src && !src.startsWith('http')) {
    const fullPath = path.join(__dirname, src);
    if (!fs.existsSync(fullPath)) {
      console.error(`MISSING IMAGE: ${src}`);
      missing++;
    } else {
      console.log(`FOUND: ${src} (${fs.statSync(fullPath).size} bytes)`);
    }
  }
});

console.log('--- CHECKING INTERNAL SECTION IDS ---');
const ids = new Set();
$('[id]').each((i, el) => ids.add($(el).attr('id')));

$('a[href^="#"]').each((i, el) => {
  const href = $(el).attr('href').substring(1);
  if (href && !ids.has(href)) {
    console.error(`BROKEN ANCHOR: #${href}`);
  }
});

console.log('Total missing assets:', missing);
console.log('Check complete!');
