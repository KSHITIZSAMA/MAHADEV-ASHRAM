const fs = require('fs');

const about = fs.readFileSync('about.html', 'utf8');
console.log('about.html length:', about.length);
console.log('Sample from about.html (first 2000 chars):');
console.log(about.substring(0, 2000));
