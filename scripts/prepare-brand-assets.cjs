// One-time asset preparation. Dependency is isolated from the application:
// npm.cmd install --prefix tmp/logo-tools --no-save --package-lock=false --ignore-scripts sharp
// node scripts/prepare-brand-assets.cjs "path/to/The Howell Group Logo without Bg.webp"
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('../tmp/logo-tools/node_modules/sharp');

async function main() {
  const source = process.argv[2];
  if (!source) throw new Error('Pass the supplied Howell logo WebP path.');
  const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== 2031 || info.height !== 774) throw new Error('Expected the approved 2031 x 774 logo.');
  const pixels = Buffer.alloc(info.width * info.height * 4);
  // Gray checkerboard pixels have no chroma. Recover the colored mark only;
  // use its sampled colors at anti-aliased edges to avoid gray fringes.
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 3;
    const rgb = [data[i], data[i + 1], data[i + 2]];
    const chroma = Math.max(...rgb) - Math.min(...rgb);
    if (chroma < 25) continue;
    const red = rgb[0] > rgb[1] + 25;
    const cyan = x < 170 || (x < 254 && y > 420);
    const color = red ? [184, 43, 43] : cyan ? [38, 181, 213] : [1, 106, 137];
    const span = Math.max(...color) - Math.min(...color);
    const alpha = Math.min(1, Math.max(0, (chroma - 18) / (span - 18)));
    const out = (y * info.width + x) * 4;
    const finalColor = alpha > .96 ? rgb : color;
    pixels[out] = finalColor[0]; pixels[out + 1] = finalColor[1]; pixels[out + 2] = finalColor[2];
    pixels[out + 3] = Math.round(alpha * 255);
  }
  const image = () => sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } });
  const root = path.resolve(__dirname, '../public');
  await fs.mkdir(path.join(root, 'images/brand'), { recursive: true });
  await image().extract({ left: 18, top: 154, width: 1992, height: 464 })
    .resize(2000, 480, { fit: 'contain', background: '#00000000' })
    .png().toFile(path.join(root, 'images/brand/howell-group-logo.png'));
  const icon = await image().extract({ left: 18, top: 154, width: 402, height: 464 }).png().toBuffer();
  const iconAt = size => sharp(icon).resize(size - 4, size - 4, { fit: 'contain', background: '#ffffff' })
    .extend({ top: 2, bottom: 2, left: 2, right: 2, background: '#ffffff' }).flatten({ background: '#ffffff' }).png().toBuffer();
  const sizes = [16, 32, 48];
  const icons = await Promise.all(sizes.map(iconAt));
  await fs.writeFile(path.join(root, 'favicon-32.png'), icons[1]);
  await sharp(icon).resize(144, 144, { fit: 'contain', background: '#ffffff' })
    .extend({ top: 18, bottom: 18, left: 18, right: 18, background: '#ffffff' })
    .flatten({ background: '#ffffff' }).png().toFile(path.join(root, 'apple-touch-icon.png'));
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((size, index) => {
    const entry = 6 + index * 16;
    header[entry] = size; header[entry + 1] = size;
    header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(icons[index].length, entry + 8); header.writeUInt32LE(offset, entry + 12);
    offset += icons[index].length;
  });
  await fs.writeFile(path.join(root, 'favicon.ico'), Buffer.concat([header, ...icons]));
  console.log('Exported transparent 2000 x 480 logo, 16/32/48 ICO, 32px PNG, and 180px touch icon.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
