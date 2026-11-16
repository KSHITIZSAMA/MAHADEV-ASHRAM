const fs = require('fs');
const https = require('https');
const path = require('path');

const assetDir = path.join(__dirname, 'assets');
const imgDir = path.join(assetDir, 'images');
const teamDir = path.join(imgDir, 'team');
const workDir = path.join(imgDir, 'work');

[assetDir, imgDir, teamDir, workDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const downloads = [
  // Logo & QR
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/05/cropped_circle_image.png', dest: path.join(imgDir, 'logo.png') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/08/qr-mahadev_page-0001.jpg', dest: path.join(imgDir, 'donation-qr.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/04/donatio.jpeg', dest: path.join(imgDir, 'donation-hero.jpg') },
  
  // Team
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/elementor/thumbs/d2757ec0-074a-4533-9279-b89e4505bd3c-ru2p0jf6jy093s1n9bhdf07kutn0fhelguu4ncdfuk.jpeg', dest: path.join(teamDir, 'mohit-sharma.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2026-04-24-at-9.06.43-AM-rmjecc8313u88qybh74tl3aph69rmazexfxn0thsvw.jpeg', dest: path.join(teamDir, 'byas-sharma.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/elementor/thumbs/new-member-rnhh8km614tk2s4p0nr90w3swso7det2hwdc6utcak.jpeg', dest: path.join(teamDir, 'keshav-pandey.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2026-05-14-at-9.56.50-AM-rnhh8km614tk2s4p0nr90w3swso7det2hwdc6utcak.jpeg', dest: path.join(teamDir, 'gunjan-pandey.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/elementor/thumbs/photo_2026-04-25_23-48-31-rmjer8038o7o2hc2kmq62c3g2swzhs2ez3sekjfed8.jpg', dest: path.join(teamDir, 'anil-kumar.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2026-05-14-at-9.57.22-AM-rnhh8jobuas9r66265cmgeccbesu5ppc5rpupkuqgs.jpeg', dest: path.join(teamDir, 'punam-devi.jpg') },

  // Ground Seva & Activities
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/09/Group-photo-mahadev-1.jpeg', dest: path.join(workDir, 'team-group.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/09/serving-photo-mahadev-1.jpeg', dest: path.join(workDir, 'food-serving-1.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/09/serving-photo-4-mahadev-1.jpeg', dest: path.join(workDir, 'food-serving-2.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/09/serving-photo-3-photo.jpeg', dest: path.join(workDir, 'food-serving-3.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/08/kawar-23.jpeg', dest: path.join(workDir, 'kanwar-camp-1.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/08/kawar-22.jpeg', dest: path.join(workDir, 'kanwar-camp-2.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/08/kawar-8.jpeg', dest: path.join(workDir, 'kanwar-camp-3.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/08/kawar-28.jpeg', dest: path.join(workDir, 'kanwar-camp-4.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/04/rural-health-check-stockcake.webp', dest: path.join(workDir, 'medical-camp.webp') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/05/book.jpg', dest: path.join(workDir, 'education-books.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/elementor/thumbs/elder-rn03c120au7utcpntkjyb7okzmspb7fym8rg047ag0.jpg', dest: path.join(workDir, 'elderly-care.jpg') },
  { url: 'https://mahadevashramtrust.org/wp-content/uploads/2026/04/portrait-person-doing-arts-crafts-1.jpg', dest: path.join(workDir, 'women-training.jpg') }
];

function downloadFile(item) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(item.dest);
    https.get(item.url, { timeout: 15000 }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            console.log(`Downloaded: ${path.basename(item.dest)}`);
            resolve();
          });
        });
      } else {
        console.error(`Failed ${item.url} with code ${response.statusCode}`);
        file.close();
        if (fs.existsSync(item.dest)) fs.unlinkSync(item.dest);
        resolve();
      }
    }).on('error', (err) => {
      console.error(`Error ${item.url}: ${err.message}`);
      file.close();
      if (fs.existsSync(item.dest)) fs.unlinkSync(item.dest);
      resolve();
    });
  });
}

async function run() {
  for (const item of downloads) {
    await downloadFile(item);
  }
  console.log('All downloads completed!');
}

run();
