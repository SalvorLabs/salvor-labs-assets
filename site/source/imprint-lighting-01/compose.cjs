const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const assert=require('node:assert/strict');
const sharp=require(process.env.SALVORLABS_SHARP || 'sharp');
const root=path.resolve(__dirname,'../../..');
const out=path.join(root,'site/review/imprint-lighting-01');
const layout=JSON.parse(fs.readFileSync(path.join(__dirname,'layout.json')));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 fs.mkdirSync(out,{recursive:true});fs.mkdirSync(out+'/candidates',{recursive:true});
 const base=await sharp(root+'/site/media/horizon-dusk-flow-04.webp').removeAlpha().raw().toBuffer({resolveWithObject:true});
 const generated=await sharp(path.join(__dirname,'generated-sheet.png')).resize(layout.width,layout.height,{fit:'fill'}).png().toBuffer();
 const {width,height}=base.info;const {crop,panel}=layout;const composites=[];const reports=[];
 for(let i=0;i<9;i++){
  const x=panel.x0+(i%3)*(panel.width+panel.gap),y=panel.y0+Math.floor(i/3)*(panel.height+panel.gap)+panel.photoTop;
  const patch=await sharp(generated).extract({left:x,top:y,width:crop.width,height:crop.height}).removeAlpha().raw().toBuffer();
  const result=Buffer.from(base.data);const mask=Buffer.alloc(width*height);const beamed=[4,5,7,8].includes(i);let editable=0,locked=0,changed=0;
  for(let py=0;py<height;py++)for(let px=0;px<width;px++){
   let alpha=0;
   if(px>=crop.left&&px<crop.left+crop.width&&py>=crop.top&&py<crop.top+crop.height){
    const radius=Math.hypot((px-859)/(beamed?203:164),(py-399)/(beamed?205:172));
    alpha=radius<=.84?1:radius>=1?0:(1-radius)/.16;alpha=alpha*alpha*(3-2*alpha);
    // Original foreground ribbons stay in front of all illumination treatments.
    const dx=px-850;const front=400-.43509*dx-.00038829*dx*dx;
    const dx2=px-900;const lower=526-.19*dx2-.0002*dx2*dx2;
    if(Math.abs(py-front)<28||Math.abs(py-lower)<18)alpha=0;
   }
   const pos=(py*width+px)*3;
   if(alpha>0){
    editable++;mask[py*width+px]=Math.round(alpha*255);
    const q=((py-crop.top)*crop.width+px-crop.left)*3;
    for(let c=0;c<3;c++)result[pos+c]=Math.round(base.data[pos+c]*(1-alpha)+patch[q+c]*alpha);
   }else locked++;
   const difference=[0,1,2].some(c=>result[pos+c]!==base.data[pos+c]);
   if(difference)changed++;if(alpha===0)assert.equal(difference,false);
  }
  const id=layout.items[i][0];const output=await sharp(result,{raw:{width,height,channels:3}}).png().toBuffer();
  fs.writeFileSync(out+'/candidates/'+id+'.png',output);
  const detail=await sharp(output).extract(crop).png().toBuffer();composites.push({input:detail,left:x,top:y});
  reports.push({id,treatment:layout.items[i][1],fullHero:'candidates/'+id+'.png',width,height,editablePixels:editable,lockedPixels:locked,lockedPixelMismatches:0,changedPixels:changed,sha256:hash(output),requestedLogoTranslation:{x:0,y:0},requestedLogoScale:1,mask:beamed?'Local ellipse including short rays; front neon protected':'Local imprint ellipse; front neon protected'});
 }
 await sharp(path.join(__dirname,'template.png')).composite(composites).png().toFile(out+'/contact-sheet.png');
 fs.writeFileSync(out+'/preservation.json',JSON.stringify({status:'Exploratory only; no approved hero or sharing asset replaced',base:'site/media/horizon-dusk-flow-04.webp',baseSha256:hash(fs.readFileSync(root+'/site/media/horizon-dusk-flow-04.webp')),method:'Built-in ImageGen treatments composited locally over unchanged source; deterministic labels and fixed crop; all foreground neon protected',crop,candidates:reports},null,2)+'\n');
 console.log(JSON.stringify({contactSheet:out+'/contact-sheet.png',candidates:reports.map(r=>({id:r.id,locked:r.lockedPixels,mismatches:r.lockedPixelMismatches}))}));
})();
