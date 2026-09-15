const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function convert() {
  const images = getFiles('public');
  let totalOld = 0;
  let totalNew = 0;
  let convertedCount = 0;

  for (const imgPath of images) {
    const parsed = path.parse(imgPath);
    const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);
    
    const oldStat = fs.statSync(imgPath);
    totalOld += oldStat.size;

    try {
      const info = await sharp(imgPath).webp({ quality: 85 }).toFile(webpPath);
      totalNew += info.size;
      convertedCount++;
      console.log(`Converted: ${imgPath} -> ${webpPath} (${Math.round(oldStat.size / 1024)}KB -> ${Math.round(info.size / 1024)}KB)`);
    } catch (err) {
      console.error(`Failed to convert ${imgPath}:`, err.message);
    }
  }

  console.log('--- CONVERSION SUMMARY ---');
  console.log(`Total images converted: ${convertedCount}`);
  console.log(`Original total size: ${(totalOld / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`New WebP total size: ${(totalNew / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total space saved: ${(((totalOld - totalNew) / totalOld) * 100).toFixed(1)}%`);
}

convert();
