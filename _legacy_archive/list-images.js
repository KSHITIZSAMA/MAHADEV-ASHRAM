const fs = require('fs');
const cheerio = require('cheerio');

const files = ['homepage.html', 'about.html', 'our-work.html', 'our-member.html', 'donation.html', 'contact.html'];
const allImages = new Set();

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html);
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src && !src.includes('gravatar') && !src.includes('wp-content/plugins')) {
      allImages.add(src);
    }
  });
}

console.log('--- ALL UNIQUE IMAGES ---');
console.log([...allImages]);
