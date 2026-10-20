const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const sharp = require(process.env.SALVOR_SHARP_PATH || 'sharp');
const root = path.resolve(__dirname, '../../../../..'), out = path.resolve(__dirname, '..');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
(async () => {
  const sources = {
    artwork: 'site/media/artwork/salvorlabs-sphere-l09-contained-transparent-4096.png',
    wordmark: 'site/media/brand/focus.svg',
    background: 'assets/social-media/x/article-cover/source/background-generated.png'
  };
  const input = Object.fromEntries(Object.entries(sources).map(([k,p]) => [k, fs.readFileSync(path.join(root,p))]));
  assert.equal(hash(input.artwork), 'd68a6a25270b5f2a76936c9f4301a07e93220625c9dc799287f13d9fe8bce3e4');
  const width = 2500, height = 1000;
  const bg = await sharp(input.background).resize(width,height,{fit:'cover'}).png().toBuffer();
  const sphere = await sharp(input.artwork).resize(1030).png().toBuffer();
  const wordmark = await sharp(input.wordmark,{density:600}).resize(860).png().toBuffer();
  const sphereMeta = await sharp(sphere).metadata(), wordMeta = await sharp(wordmark).metadata();
  const layout = {width,height,artwork:{x:735,y:25,width:1030,height:sphereMeta.height},wordmark:{x:820,y:760,width:860,height:wordMeta.height}};
  const uri = (b,m='image/png') => `data:${m};base64,${b.toString('base64')}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2500" height="1000" viewBox="0 0 2500 1000"><title>SALVOR LABS — announcement article cover</title><desc>Approved sphere above the white Focus wordmark against a quiet dusk landscape.</desc><image width="2500" height="1000" href="${uri(bg)}"/><image x="735" y="25" width="1030" height="${sphereMeta.height}" href="${uri(sphere)}"/><image x="820" y="760" width="860" height="${wordMeta.height}" href="${uri(input.wordmark,'image/svg+xml')}"/></svg>`;
  fs.writeFileSync(path.join(out,'salvorlabs-article-cover-2500x1000.svg'),svg);
  const composed = await sharp(bg).composite([{input:sphere,left:735,top:25},{input:wordmark,left:820,top:760}]).png().toBuffer();
  fs.writeFileSync(path.join(out,'salvorlabs-article-cover-2500x1000.png'),composed);
  await sharp(composed).jpeg({quality:95,mozjpeg:true,chromaSubsampling:'4:4:4'}).toFile(path.join(out,'salvorlabs-article-cover-2500x1000.jpg'));
  await sharp(composed).resize(1500,600).jpeg({quality:94,mozjpeg:true,chromaSubsampling:'4:4:4'}).toFile(path.join(out,'salvorlabs-article-cover-1500x600.jpg'));
  const outputs = fs.readdirSync(out).filter(p=>/\.(png|jpg|svg)$/.test(p)).map(p=>({path:p,bytes:fs.statSync(path.join(out,p)).size,sha256:hash(fs.readFileSync(path.join(out,p)))}));
  fs.writeFileSync(path.join(out,'SOURCES.json'),JSON.stringify({created:'2026-10-20',status:'Draft for operator review',method:'ImageGen background plate; deterministic placement of exact approved sphere and outlined Focus wordmark',platform:{name:'X article cover',aspectRatio:'5:2',note:'Chosen landscape export; not asserted as an official mandatory size'},inputs:Object.entries(sources).map(([k,p])=>({path:p,sha256:hash(input[k])})),layout,outputs,canonicalAssetsChanged:false},null,2)+'\n');
  console.log(JSON.stringify({layout,outputs},null,2));
})();
