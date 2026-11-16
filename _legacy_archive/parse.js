const fs = require('fs');

const html = fs.readFileSync('homepage.html', 'utf8');

const titleMatch = html.match(/<title>(.*?)<\/title>/i);
console.log('TITLE:', titleMatch ? titleMatch[1] : 'No title');

const headings = [...html.matchAll(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi)]
  .map(m => m[1] + ': ' + m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());

console.log('\n--- HEADINGS ---');
headings.forEach(h => console.log(h));

const links = [...html.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)]
  .map(m => ({ text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(), href: m[1] }))
  .filter(l => l.text.length > 0 && l.text.length < 60);

console.log('\n--- LINKS ---');
const uniqueLinks = [];
const seen = new Set();
for (const l of links) {
  const key = `${l.text} -> ${l.href}`;
  if (!seen.has(key)) {
    seen.add(key);
    uniqueLinks.push(l);
  }
}
console.log(JSON.stringify(uniqueLinks, null, 2));

// Check images
const imgs = [...html.matchAll(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']?([^"'>]*)["']?/gi)]
  .map(m => ({ src: m[1], alt: m[2] }));
console.log('\n--- IMAGES ---');
console.log(JSON.stringify(imgs.slice(0, 20), null, 2));

// Generator or CMS indicator
const generator = html.match(/<meta[^>]*name=["']generator["'][^>]*content=["']([^"']*)["']/i);
console.log('\nGENERATOR:', generator ? generator[1] : 'Unknown');
