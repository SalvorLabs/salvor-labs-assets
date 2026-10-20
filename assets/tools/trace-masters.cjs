#!/usr/bin/env node
'use strict';
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const options=Object.fromEntries(process.argv.slice(2).map(arg=>{const i=arg.indexOf('=');if(!arg.startsWith('--')||i<0)throw new Error('Use --name=value');return [arg.slice(2,i),arg.slice(i+1)]}));
if(!options.config)throw new Error('Missing --config');
const sharp=require(options.sharp||process.env.SALVOR_ASSETS_SHARP_MODULE||'sharp');
const {Potrace}=require(options.potrace||process.env.SALVOR_ASSETS_POTRACE_MODULE||'potrace');
const root=path.dirname(path.resolve(options.config));
const inputs=[['G08','masters/logo/regular.png'],['B3-W05-Focus','masters/wordmark/focus.png']];
const parameters={blackOnWhite:false,turdSize:0,alphaMax:1,optCurve:true,optTolerance:0.1};
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
(async()=>{
  const sources=[];
  for(const [id,input] of inputs){
    const bytes=await fs.readFile(path.join(root,input));
    const metadata=await sharp(bytes).metadata();
    const tracer=new Potrace(parameters);
    await new Promise((resolve,reject)=>tracer.loadImage(bytes,e=>e?reject(e):resolve()));
    let previousLevel=0;
    const layers=[];
    if(id==='B3-W05-Focus'){
      tracer.setParameters({threshold:128});
      layers.push(tracer.getPathTag('currentColor'));
    }else{
    for(let threshold=1;threshold<=253;threshold+=4){
      tracer.setParameters({threshold});
      const level=threshold===253?255:threshold+1;
      const opacity=(level-previousLevel)/(255-previousLevel);
      const tag=tracer.getPathTag('currentColor').replace('/>',` fill-opacity="${opacity.toFixed(8)}"/>`);
      if(!tag.includes('d=""'))layers.push(tag);
      previousLevel=level;
    }
    }
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${metadata.width}" height="${metadata.height}" viewBox="0 0 ${metadata.width} ${metadata.height}" color="#ffffff"><title>SalvorLabs ${id}</title><desc>Vector contours traced from approved raster artwork; ${layers.length} ink layers; no embedded raster.</desc>\n${layers.join('\n')}\n</svg>\n`;
    const output=input.replace(/\.png$/,'.svg');
    await fs.writeFile(path.join(root,output),svg,{flag:'wx'});
    sources.push({id,input,output,inputSha256:sha(bytes),outputSha256:sha(svg),viewBox:[0,0,metadata.width,metadata.height],layers:layers.length,bytes:Buffer.byteLength(svg)});
    console.log(JSON.stringify(sources.at(-1)));
  }
  await fs.writeFile(path.join(root,'masters/VECTOR_SOURCES.json'),JSON.stringify({date:'2026-10-09',method:'Potrace 2.1.8 Bézier contours, nested 4/255 grayscale bands reconstructed with cumulative opacity; no raster embedding',parameters,thresholds:'1 through 253 in steps of 4',toolDocumentation:'https://github.com/tooolbox/node-potrace',sources},null,2)+'\n',{flag:'wx'});
})().catch(e=>{console.error(e);process.exitCode=1});
