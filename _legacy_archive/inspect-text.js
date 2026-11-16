const fs = require('fs');

function cleanText(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const files = ['homepage.html', 'about.html', 'our-work.html', 'our-member.html', 'donation.html', 'contact.html'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const raw = fs.readFileSync(file, 'utf8');
  console.log(`\n=================== ${file} ===================`);
  
  // Headings
  const headings = [...raw.matchAll(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map(m => m[1] + ': ' + cleanText(m[2]))
    .filter(h => h.length > 5);
  console.log('--- HEADINGS ---');
  console.log(headings.join('\n'));
}
