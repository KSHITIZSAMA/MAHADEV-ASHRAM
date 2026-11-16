const fs = require('fs');

function extractDetails(filename) {
  const html = fs.readFileSync(filename, 'utf8');
  console.log(`\n============================ ${filename} ============================`);
  
  // Find all sections or elementor text blocks
  const pMatches = [...html.matchAll(/<(?:p|div class="[^"]*elementor-widget-text-editor[^"]*")>(.*?)<\/(?:p|div)>/gis)]
    .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(t => t.length > 25);
  
  console.log('--- SAMPLE TEXTS ---');
  pMatches.slice(0, 15).forEach((t, i) => console.log(`[${i+1}] ${t.substring(0, 150)}...`));
}

['about.html', 'our-member.html', 'donation.html', 'contact.html', 'our-work.html'].forEach(extractDetails);
