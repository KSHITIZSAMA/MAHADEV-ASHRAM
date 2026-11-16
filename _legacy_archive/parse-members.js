const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('our-member.html', 'utf8');
const $ = cheerio.load(html);

$('.elementor-widget-image-box').each((i, el) => {
  const title = $(el).find('.elementor-image-box-title').text().trim();
  const desc = $(el).find('.elementor-image-box-description').text().trim();
  const img = $(el).find('img').attr('src');
  console.log({ title, desc, img });
});
