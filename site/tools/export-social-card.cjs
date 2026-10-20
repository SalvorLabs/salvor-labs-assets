// Run only after explicit approval of a hero; preview edits never invoke this tool.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const option = name => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const approvedHero = option('lock-hero');
if (!approvedHero) throw new Error('Hero approval required: --lock-hero=media/<approved-image>.webp. Do not run for draft iterations.');
const sharp = require(option('sharp') || 'sharp');
const resolve = relative => {
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep)) throw new Error('Inputs must be inside site/');
  return file;
};
async function preserve(relative, data) {
  const file = resolve(relative);
  await fs.mkdir(path.dirname(file), { recursive: true });
  try { await fs.writeFile(file, data, { flag: 'wx' }); }
  catch (error) {
    if (error.code !== 'EEXIST' || hash(await fs.readFile(file)) !== hash(data)) throw error;
  }
}
function replaceMeta(html, name, value) {
  const pattern = new RegExp(`(<meta (?:property|name)="${name}" content=")[^"]*(">)`);
  if (!pattern.test(html)) throw new Error(`Missing metadata: ${name}`);
  return html.replace(pattern, (_, before, after) => before + value + after);
}
(async () => {
  const htmlFile = resolve('index.html');
  let html = await fs.readFile(htmlFile, 'utf8');
  const currentHero = html.match(/<img class="hero-image" src="([^"]+)"/)?.[1];
  if (currentHero !== approvedHero) throw new Error('The approved hero must match the current page hero.');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical || !canonical.startsWith('https://')) throw new Error('An absolute HTTPS canonical URL is required.');
  const inputs = [approvedHero, 'media/brand/regular-128.png', 'media/brand/focus.svg'];
  const buffers = await Promise.all(inputs.map(p => fs.readFile(resolve(p))));
  const inputHashes = inputs.map((p, i) => ({ path: p, sha256: hash(buffers[i]) }));
  const renderer = { templateSha256: hash(await fs.readFile(__filename)), versions: sharp.versions };
  const key = hash(JSON.stringify({ inputs: inputHashes, renderer })).slice(0, 16);
  const stem = `salvorlabs-social-${key}`;
  const paths = { svg: `source/social/${stem}.svg`, png: `media/social/${stem}.png`, jpg: `media/social/${stem}.jpg`, provenance: `source/social/${stem}.json` };
  const [hero, mark, focus] = buffers;
  const background = await sharp(hero).png().toBuffer();
  const wordmark = focus.toString().replace('<svg ', '<svg x="134" y="63" ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<title>SalvorLabs — Knowledge that outlives the session.</title>
<desc>The approved sphere hero with its centered brain graph, unchanged G08 and Focus brand artwork, and website headline.</desc>
<defs>
<linearGradient id="shade"><stop offset="0" stop-color="#060c12"/><stop offset=".33" stop-color="#060c12" stop-opacity=".98"/><stop offset=".56" stop-color="#060c12" stop-opacity=".35"/><stop offset=".76" stop-color="#060c12" stop-opacity="0"/></linearGradient>
<linearGradient id="base" x1="0" y1="0" x2="0" y2="1"><stop offset=".77" stop-color="#060c12" stop-opacity="0"/><stop offset="1" stop-color="#060c12" stop-opacity=".42"/></linearGradient>
</defs>
<rect width="1200" height="630" fill="#060c12"/>
<image href="data:image/png;base64,${background.toString('base64')}" x="64" y="-20" width="1504.8" height="846.9"/>
<rect width="1200" height="630" fill="url(#shade)"/>
<rect width="1200" height="630" fill="url(#base)"/>
<image href="data:image/png;base64,${mark.toString('base64')}" x="58" y="48" width="64" height="64"/>
${wordmark}
<g fill="#f3f5f6" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-weight="400">
<text x="64" y="242" font-size="54" letter-spacing="-1.8">Knowledge that</text>
<text x="64" y="306" font-size="54" letter-spacing="-1.8">outlives the session.</text>
<text x="66" y="365" font-size="20" fill="#d5dfe6">Exploring the knowledge layer of AI.</text>
<text x="66" y="566" font-size="18" fill="#d5dfe6">salvorlabs.org</text>
</g>
</svg>`;
  const source = Buffer.from(svg);
  const png = await sharp(source).png().toBuffer();
  const jpg = await sharp(png).flatten({ background: '#060c12' }).jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer();
  const outputs = { [paths.svg]: source, [paths.png]: png, [paths.jpg]: jpg };
  for (const [name, data] of Object.entries(outputs)) await preserve(name, data);
  const provenance = {
    title: 'SalvorLabs — Knowledge that outlives the session.', width: 1200, height: 630,
    method: 'Deterministic SVG composition and Sharp JPEG/PNG export; approved hero is cropped only, with a text-legibility overlay.',
    typography: 'Exact outlined Focus wordmark; Avenir Next / Segoe UI / Arial headline stack. Focus font family remains unverified.',
    trigger: 'Explicit operator-approved hero lock; never draft preview changes.',
    inputs: inputHashes, renderer,
    outputs: Object.entries(outputs).map(([p, b]) => ({ path: p, bytes: b.length, sha256: hash(b) }))
  };
  await preserve(paths.provenance, JSON.stringify(provenance, null, 2) + '\n');
  const url = new URL(paths.jpg, canonical).href;
  const heroAlt = html.match(/<img class="hero-image"[^>]*alt="([^"]*)"/)?.[1];
  const alt = 'SalvorLabs: Knowledge that outlives the session. ' + (heroAlt || 'The approved sphere hero and brain graph.');
  for (const name of ['og:image', 'og:image:secure_url', 'twitter:image']) html = replaceMeta(html, name, url);
  for (const name of ['og:image:alt', 'twitter:image:alt']) html = replaceMeta(html, name, alt);
  html = replaceMeta(html, 'og:image:width', '1200');
  html = replaceMeta(html, 'og:image:height', '630');
  await fs.writeFile(htmlFile, html);
  const lock = { status: 'operator-approved', hero: inputHashes[0], social: paths, imageUrl: url, width: 1200, height: 630 };
  await fs.writeFile(resolve('source/hero-lock.json'), JSON.stringify(lock, null, 2) + '\n');
  // Runtime inventory excludes source/review files and is refreshed only at hero lock.
  const media = [];
  async function collect(dir) {
    for (const entry of await fs.readdir(resolve(dir), { withFileTypes: true })) {
      const name = `${dir}/${entry.name}`;
      if (entry.isDirectory()) await collect(name);
      else if (entry.isFile()) media.push(name);
    }
  }
  await collect('media');
  const runtimeFiles = ['index.html', 'styles.css', 'robots.txt', ...media].sort();
  const manifest = {
    status: 'Approved local hero and sharing assets; publication pending',
    heroLock: 'source/hero-lock.json',
    scope: 'Runtime files only; original sources and reviews remain preserved separately.',
    files: await Promise.all(runtimeFiles.map(async p => {
      const data = await fs.readFile(resolve(p));
      return { path: p, bytes: data.length, sha256: hash(data) };
    }))
  };
  await fs.writeFile(resolve('manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify(lock, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
