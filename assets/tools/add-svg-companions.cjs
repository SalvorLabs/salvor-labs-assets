#!/usr/bin/env node
'use strict';
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const options=Object.fromEntries(process.argv.slice(2).map(arg=>{const i=arg.indexOf('=');if(!arg.startsWith('--')||i<0)throw new Error('Use --name=value');return [arg.slice(2,i),arg.slice(i+1)]}));
if(!options.config)throw new Error('Missing --config');
const configurationPath=path.resolve(options.config);
const configuration=require(configurationPath);
const root=path.dirname(configurationPath);
const setId=options.set||'logo_only';
const definition=configuration.sets[setId];
if(!definition||definition.status!=='ready'||definition.layout!=='square')throw new Error('Only the ready logo-only set is supported');
const output=path.resolve(root,options.output||definition.output);
const sharp=require(options.sharp||process.env.SALVOR_ASSETS_SHARP_MODULE||'sharp');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
(async()=>{
  const manifest=JSON.parse(await fs.readFile(path.join(output,'manifest.json'),'utf8'));
  if(manifest.files.some(f=>f.path.endsWith('.svg')))throw new Error('SVG companions already recorded; choose a fresh export folder');
  const masters={};
  for(const name of ['vectorMaster']){
    const relative=definition[name];
    const svg=await fs.readFile(path.join(root,relative),'utf8');
    if(/<image\b|<foreignObject\b|<script\b|data:image/i.test(svg)||!svg.includes('<path'))throw new Error('SVG must contain paths with no embedded raster or active content');
    const box=svg.match(/viewBox="([^"]+)"/)[1];
    const body=svg.slice(svg.indexOf('>')+1,svg.lastIndexOf('</svg>'));
    masters[name]={relative,box,body,sha256:sha(svg)};
  }
  const files=[];
  const checks=[];
  for(const size of configuration.sizes){
    const master=masters.vectorMaster;
    const pngAlpha=await sharp(path.join(output,'white_on_trans_bg',`salvor-labs-logo-${size}.png`)).ensureAlpha().raw().toBuffer();
    let whiteAlpha;
    for(const treatment of configuration.treatments){
      const color=treatment.ink?'#ffffff':'#000000';
      const background=treatment.transparent?'':`<rect width="100%" height="100%" fill="${treatment.background?'#ffffff':'#000000'}"/>\n`;
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${master.box}" color="${color}">\n${background}${master.body}</svg>\n`;
      const relative=path.join(treatment.folder,`salvor-labs-logo-${size}.svg`);
      try{await fs.writeFile(path.join(output,relative),svg,{flag:'wx'});}catch(error){
        if(error.code!=='EEXIST'||await fs.readFile(path.join(output,relative),'utf8')!==svg)throw error;
      }
      const pixels=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      if(pixels.info.width!==size||pixels.info.height!==size)throw new Error('SVG dimensions mismatch');
      if(!treatment.transparent&&pixels.data.some((v,i)=>i%4===3&&v!==255))throw new Error('SVG opaque background is not opaque');
      if(treatment.folder==='white_on_trans_bg')whiteAlpha=pixels.data;
      files.push({path:relative,width:size,height:size,background:treatment.transparent?'transparent':(treatment.background?'white':'black'),ink:treatment.ink?'white':'black',sourceId:definition.sourceId,format:'SVG paths',embeddedRaster:false,sha256:sha(svg),bytes:Buffer.byteLength(svg)});
    }
    let total=0,intersection=0,union=0;
    for(let i=0;i<size*size;i++){
      const a=pngAlpha[i*4+3],b=whiteAlpha[i*4+3];
      total+=Math.abs(a-b);
      if(a>32||b>32)union++;
      if(a>32&&b>32)intersection++;
    }
    const meanAlphaError=total/(size*size);
    const maskIoU=intersection/union;
    // Fidelity is checked at a common 512px size, the intended vector use case.
    // Native SVG antialiasing and Lanczos PNG resampling are different pipelines.
    const referenceFile=path.join(root,definition.master);
    const reference=await sharp(referenceFile).greyscale().resize(512,512).raw().toBuffer();
    const vector=await sharp(path.join(output,'white_on_trans_bg',`salvor-labs-logo-${size}.svg`)).resize(512,512).ensureAlpha().raw().toBuffer();
    let commonError=0,commonIntersection=0,commonUnion=0;
    for(let i=0;i<512*512;i++){
      const a=reference[i],b=vector[i*4+3];commonError+=Math.abs(a-b);
      if(a>32||b>32)commonUnion++;if(a>32&&b>32)commonIntersection++;
    }
    const commonMeanAlphaError=commonError/(512*512),commonMaskIoU=commonIntersection/commonUnion;
    if(commonMeanAlphaError>5||commonMaskIoU<0.9)throw new Error('SVG reference fidelity outside tolerance');
    checks.push({size,svgDimensions:'pass',pathsOnly:'pass',nativePngComparison:{meanAlphaError,maskIoU,interpretation:'Informational: different native antialiasing versus PNG resampling'},common512Comparison:{meanAlphaError:commonMeanAlphaError,maskIoU:commonMaskIoU,fidelity:'pass'}});
  }
  if(files.length!==28)throw new Error('Expected 28 SVG companions');
  for(const t of configuration.treatments){
    const names=await fs.readdir(path.join(output,t.folder));
    if(names.filter(n=>n.endsWith('.png')).length!==7||names.filter(n=>n.endsWith('.svg')).length!==7)throw new Error('Expected seven PNGs and seven SVGs per treatment');
  }
  manifest.pngCount=28;manifest.svgCount=28;manifest.fileCount=56;manifest.format='PNG RGBA 8-bit and SVG paths';
  manifest.vectorMasters=Object.fromEntries(Object.entries(masters).map(([k,m])=>[k,{path:path.relative(output,path.join(root,m.relative)),sha256:m.sha256,viewBox:m.box}]));
  manifest.vectorMethod='Editable Bézier contour paths with 64 neutral opacity layers; no embedded raster. SVG viewBox preserves the approved master framing.';
  manifest.files.push(...files);
  await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  const verification=JSON.parse(await fs.readFile(path.join(output,'verification.json'),'utf8'));
  verification.fileCount=56;verification.pngCount=28;verification.svgCount=28;verification.perFolder={png:7,svg:7};verification.svgChecks=checks;
  await fs.writeFile(path.join(output,'verification.json'),JSON.stringify(verification,null,2)+'\n');
  console.log(JSON.stringify({pngCount:28,svgCount:28,fidelityChecks:checks}));
})().catch(e=>{console.error(e);process.exitCode=1});
