const fs = require('fs');

const d = fs.readFileSync('donation.html', 'utf8');
const upiMatches = d.match(/[a-zA-Z0-9.\-_]+@[a-zA-Z]+/g) || [];
console.log('UPI or email matches in donation.html:', upiMatches);

const qrIdx = d.indexOf('qr-mahadev');
console.log('Context around QR code:');
console.log(d.substring(qrIdx - 300, qrIdx + 400));
