const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('our-work.html', 'utf8');
const $ = cheerio.load(html);

$('h3').each((i, el) => {
  const text = $(el).text().trim();
  if (text.includes('Durga') || text.includes('Janmashtami') || text.includes('Kanwariyas')) {
    console.log('\n--- ' + text + ' ---');
    console.log($(el).closest('.elementor-widget-wrap, .elementor-column, .elementor-section').text().replace(/\s+/g, ' '));
  }
});
