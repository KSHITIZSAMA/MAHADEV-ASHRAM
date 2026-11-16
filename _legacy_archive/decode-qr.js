const fs = require('fs');
const jsQR = require('jsqr');
const { Jimp } = require('jimp');

async function decode() {
  try {
    const image = await Jimp.read('assets/images/donation-qr.jpg');
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const rgba = image.bitmap.data;

    // Convert RGBA to ClampedArray
    const code = jsQR(new Uint8ClampedArray(rgba), width, height);
    if (code) {
      console.log('Decoded UPI QR Code Data:');
      console.log(code.data);
    } else {
      console.log('Could not decode QR code directly. Let us inspect image properties:', width, height);
    }
  } catch (err) {
    console.error('Error decoding QR:', err.message);
  }
}

decode();
