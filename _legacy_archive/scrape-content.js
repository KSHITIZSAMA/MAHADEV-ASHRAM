const fs = require('fs');

function extractElementorContent(filename) {
  const html = fs.readFileSync(filename, 'utf8');
  console.log(`\n============================ ${filename} ============================`);

  // Extract all text inside elementor-widget-container
  const containers = [...html.matchAll(/<div class="elementor-widget-container">([\s\S]*?)<\/div>/gi)]
    .map(m => m[1].replace(/<style[\s\S]*?<\/style>/gi, '')
                  .replace(/<script[\s\S]*?<\/script>/gi, '')
                  .replace(/<[^>]+>/g, ' ')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/&#8211;/g, '–')
                  .replace(/&#8217;/g, "'")
                  .replace(/&amp;/g, '&')
                  .replace(/\s+/g, ' ')
                  .trim())
    .filter(t => t.length > 20);

  const unique = [...new Set(containers)];
  unique.forEach((t, i) => {
    console.log(`[${i+1}] ${t}`);
  });
}

['about.html', 'our-member.html', 'donation.html', 'contact.html', 'our-work.html'].forEach(extractElementorContent);
