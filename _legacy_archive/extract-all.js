const fs = require('fs');
const cheerio = require('cheerio');

const files = ['homepage.html', 'about.html', 'our-work.html', 'our-member.html', 'donation.html', 'contact.html'];

const results = {};

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html);
  
  // Remove scripts, styles, svg
  $('script, style, svg, noscript').remove();
  
  const title = $('title').text().trim();
  const headings = [];
  $('h1, h2, h3, h4, h5, h6').each((i, el) => {
    headings.push(`${el.tagName.toUpperCase()}: ${$(el).text().trim()}`);
  });
  
  const textBlocks = [];
  $('p, .elementor-text-editor, .elementor-heading-title, .elementor-icon-box-description, table, li').each((i, el) => {
    const txt = $(el).text().replace(/\s+/g, ' ').trim();
    if (txt.length > 20 && !txt.includes('©') && !txt.includes('All Rights Reserved')) {
      textBlocks.push(txt);
    }
  });

  const images = [];
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    const alt = $(el).attr('alt') || '';
    if (src && !src.includes('wp-content/plugins') && !src.includes('gravatar')) {
      images.push({ src, alt });
    }
  });

  results[file] = {
    title,
    headings,
    textBlocks: [...new Set(textBlocks)],
    images
  };
}

fs.writeFileSync('extracted_content.json', JSON.stringify(results, null, 2));
console.log('Saved extracted_content.json');

// Also print summaries of key pages
for (const file of files) {
  console.log(`\n============================ ${file} ============================`);
  const data = results[file];
  console.log('TITLE:', data.title);
  console.log('HEADINGS:');
  console.log(data.headings.slice(0, 15).join('\n'));
  console.log('\nSAMPLE TEXT BLOCKS:');
  data.textBlocks.slice(0, 8).forEach((t, i) => console.log(`- ${t.substring(0, 160)}...`));
}
