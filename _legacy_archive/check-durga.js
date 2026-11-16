const fs = require('fs');

const html = fs.readFileSync('our-work.html', 'utf8');
const idx = html.indexOf('Durga');
console.log(html.substring(idx - 200, idx + 1000));
