const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('our-work.html', 'utf8');
const $ = cheerio.load(html);

$('h3, h4').each((i, el) => {
  const heading = $(el).text().trim();
  const nextP = $(el).next('p').text().trim() || $(el).parent().text().replace(heading, '').trim();
  console.log(`\n### ${heading}`);
  console.log(nextP.substring(0, 300));
});
