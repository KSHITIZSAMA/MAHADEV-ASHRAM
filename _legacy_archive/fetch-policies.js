const https = require('https');
const fs = require('fs');

const policies = [
  { name: 'privacy', url: 'https://mahadevashramtrust.org/privacy-policy/' },
  { name: 'terms', url: 'https://mahadevashramtrust.org/terms-and-conditions/' },
  { name: 'refund', url: 'https://mahadevashramtrust.org/refund-cancellation-policy/' }
];

policies.forEach(p => {
  https.get(p.url, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      fs.writeFileSync(`${p.name}.html`, d);
      console.log(`Fetched ${p.name}.html (${d.length} bytes)`);
    });
  }).on('error', e => console.error(e.message));
});
