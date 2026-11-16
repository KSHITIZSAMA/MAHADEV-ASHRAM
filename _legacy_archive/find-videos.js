const fs = require('fs');

const files = ['homepage.html', 'about.html', 'our-work.html', 'our-member.html', 'donation.html', 'contact.html'];
const videos = new Set();

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const matches = [...html.matchAll(/https:\/\/[^"'\s>]+\.mp4/gi)];
  matches.forEach(m => videos.add(m[0]));
}

console.log('Videos found:', [...videos]);
