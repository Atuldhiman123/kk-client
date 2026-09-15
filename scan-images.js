const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (['node_modules', '.next', '.git'].includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (/\.(tsx|ts|jsx|js|css)$/.test(file)) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('.');
const regex = /['"`]([^\s'"`]+\.(png|jpg|jpeg))['"`]/gi;
const found = new Map();

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const imgPath = match[1];
    if (!found.has(imgPath)) found.set(imgPath, []);
    found.get(imgPath).push(file);
  }
}

console.log('=== REFERENCED IMAGES IN CODE ===');
for (const [img, refFiles] of found.entries()) {
  console.log(img);
  for (const rf of refFiles) {
    console.log('   in ' + rf);
  }
}
