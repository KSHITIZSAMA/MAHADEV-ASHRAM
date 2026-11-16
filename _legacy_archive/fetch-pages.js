const fs = require('fs');
const https = require('https');

const pages = [
  { name: 'about', url: 'https://mahadevashramtrust.org/about/' },
  { name: 'our-work', url: 'https://mahadevashramtrust.org/our-work/' },
  { name: 'our-member', url: 'https://mahadevashramtrust.org/our-member/' },
  { name: 'donation', url: 'https://mahadevashramtrust.org/donation/' },
  { name: 'contact', url: 'https://mahadevashramtrust.org/contact/' }
];

function fetchPage(p) {
  return new Promise((resolve) => {
    https.get(p.url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(`${p.name}.html`, data);
        console.log(`Saved ${p.name}.html (${data.length} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error fetching ${p.name}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  for (const p of pages) {
    await fetchPage(p);
  }
  console.log('All fetched.');
}

run();
