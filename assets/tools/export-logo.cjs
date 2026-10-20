#!/usr/bin/env node
'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const options = Object.fromEntries(process.argv.slice(2).map(arg => { const split = arg.indexOf('='); if (!arg.startsWith('--') || split < 0) throw new Error('Arguments must use --name=value'); return [arg.slice(2, split), arg.slice(split + 1)]; }));
if (!options.config) throw new Error('Missing --config');
const configurationPath = path.resolve(options.config);
const configuration = require(configurationPath);
const setId = options.set || 'logo_only';
const definition = configuration.sets[setId];
if (!definition || definition.status !== 'ready' || definition.layout !== 'square') throw new Error('Only a ready square logo set can be exported by this tool');
const configurationDirectory = path.dirname(configurationPath);
options.master = path.resolve(configurationDirectory, definition.master);
options['source-id'] = definition.sourceId;
options.output = path.resolve(configurationDirectory, options.output || definition.output);
const sharp = require(options.sharp || process.env.SALVOR_ASSETS_SHARP_MODULE || 'sharp');
const sizes = configuration.sizes;
const treatments = configuration.treatments;
if (sizes.length !== 7 || treatments.length !== 4) throw new Error('Expected the approved seven sizes and four treatments');
const sha256 = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
(async () => {
  const output = path.resolve(options.output);
  try { await fs.access(output); throw new Error('Refusing to replace an existing export set: ' + output); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const regularPath = path.resolve(options.master);
  const sources = new Map();
  for (const sourcePath of [regularPath]) {
    const bytes = await fs.readFile(sourcePath);
    const metadata = await sharp(bytes).metadata();
    if (metadata.width !== metadata.height) throw new Error('Logo master must be square: ' + sourcePath);
    if (metadata.width < 512) throw new Error('Master resolution below requested export baseline');
    sources.set(sourcePath, { bytes, metadata, sha256: sha256(bytes) });
  }
  await fs.mkdir(output, { recursive: true });
  for (const treatment of treatments) await fs.mkdir(path.join(output, treatment.folder));
  const files = [];
  for (const size of sizes) {
    const sourcePath = regularPath;
    const source = sources.get(sourcePath);
    // Luminance becomes ink opacity. This recreates the light-on-black source
    // when the white transparent version is composited onto black, and gives
    // matching geometry for the dark-on-white and dark transparent versions.
    const { data: alpha, info } = await sharp(source.bytes).removeAlpha().greyscale().resize(size, size, { kernel: sharp.kernel.lanczos3, fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
    if (info.channels !== 1) throw new Error('Expected one luminance channel');
    for (const treatment of treatments) {
      const rgba = Buffer.alloc(size * size * 4);
      for (let i = 0; i < alpha.length; i++) {
        const value = treatment.transparent ? treatment.ink : (treatment.ink === 255 ? alpha[i] : 255 - alpha[i]);
        rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = value;
        rgba[i * 4 + 3] = treatment.transparent ? alpha[i] : 255;
      }
      const relativePath = path.join(treatment.folder, 'salvor-labs-logo-' + size + '.png');
      const png = await sharp(rgba, { raw: { width: size, height: size, channels: 4 } }).png({ compressionLevel: 9, palette: false }).toBuffer();
      await fs.writeFile(path.join(output, relativePath), png);
      files.push({ path: relativePath, width: size, height: size, background: treatment.transparent ? 'transparent' : (treatment.background ? 'white' : 'black'), ink: treatment.ink ? 'white' : 'black', sourceId: options['source-id'], sha256: sha256(png), bytes: png.length });
    }
  }
  const checks = [];
  for (const size of sizes) {
    const buffers = await Promise.all(treatments.map(t => sharp(path.join(output, t.folder, 'salvor-labs-logo-' + size + '.png')).ensureAlpha().raw().toBuffer()));
    let transparentPixels = 0, partialPixels = 0;
    for (let i = 0; i < size * size; i++) {
      const [wb, bw, bt, wt] = buffers;
      const offset = i * 4;
      const alpha = wt[offset + 3];
      if (bt[offset + 3] !== alpha) throw new Error('Black/white transparency mismatch');
      for (let c = 0; c < 3; c++) {
        if (wt[offset + c] !== 255 || bt[offset + c] !== 0) throw new Error('Transparent ink color mismatch');
        if (wb[offset + c] !== alpha || bw[offset + c] !== 255 - alpha) throw new Error('Opaque/transparent compositing mismatch');
      }
      if (wb[offset + 3] !== 255 || bw[offset + 3] !== 255) throw new Error('Opaque background alpha mismatch');
      if (alpha === 0) transparentPixels++;
      if (alpha > 0 && alpha < 255) partialPixels++;
    }
    if (!partialPixels) throw new Error('Missing grayscale/antialias alpha');
    for (const treatment of treatments) {
      const metadata = await sharp(path.join(output, treatment.folder, 'salvor-labs-logo-' + size + '.png')).metadata();
      if (metadata.width !== size || metadata.height !== size || metadata.format !== 'png') throw new Error('Export dimensions/format mismatch');
    }
    checks.push({ size, dimensions: 'pass', transparencyAndGrayscale: 'pass', compositingConsistency: 'pass', transparentPixels, partialPixels });
  }
  if (files.length !== 28) throw new Error('Expected exactly 28 PNGs');
  for (const treatment of treatments) {
    const listing = await fs.readdir(path.join(output, treatment.folder));
    if (listing.length !== 7 || listing.some(name => !name.endsWith('.png'))) throw new Error('Expected exactly seven PNGs per treatment');
  }
  const manifest = { set: setId, sizes, fileCount: 28, format: 'PNG RGBA 8-bit', regularMaster: { id: options['source-id'], path: path.relative(output, regularPath), sha256: sources.get(regularPath).sha256 }, exportMethod: 'Approved square master framing; independently resample each size using Lanczos3. Grayscale luminance is white/black ink alpha; opaque backgrounds are exact black/white composites.', files };
  await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  await fs.writeFile(path.join(output, 'verification.json'), JSON.stringify({ fileCount: 28, perFolder: 7, checks }, null, 2) + '\n');
  console.log(JSON.stringify({ output, fileCount: files.length, sizes, sourceId: options['source-id'], verification: 'passed' }));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
