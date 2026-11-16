const fs = require('fs');
const cheerio = require('cheerio');

const donationHtml = fs.readFileSync('donation.html', 'utf8');
const $d = cheerio.load(donationHtml);
console.log('=== DONATION PAGE TEXT ===');
console.log($d('main, .elementor-section-wrap, body').text().replace(/\s+/g, ' '));

const memberHtml = fs.readFileSync('our-member.html', 'utf8');
const $m = cheerio.load(memberHtml);
console.log('\n=== MEMBER PAGE MEMBERS & ROLES ===');
$m('.elementor-widget-image-box, .elementor-team-member, .elementor-widget-container').each((i, el) => {
  const t = $m(el).text().replace(/\s+/g, ' ').trim();
  if (t.includes('Mohit') || t.includes('Byas') || t.includes('Keshav') || t.includes('Gunjan') || t.includes('Anil') || t.includes('Punam')) {
    console.log(`Member item: ${t}`);
  }
});
