const fs=require('node:fs');const path=require('node:path');const sharp=require(process.env.SALVORLABS_SHARP || 'sharp');const root=path.resolve(__dirname,'../../../../..');
(async()=>{
 const base=await sharp(root+'/assets/hero/l09/source/cutout-native.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});const clean=await sharp(path.join(__dirname,'cleanplate-generated.png')).ensureAlpha().raw().toBuffer();const {width,height}=base.info;
 const result=Buffer.from(base.data);let locked=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const r=Math.hypot((x-815)/235,(y-535)/245);let a=r<=.89?1:r>=1?0:(1-r)/.11;a=a*a*(3-2*a);const p=(y*width+x)*4;
  if(a>0)for(let c=0;c<4;c++)result[p+c]=Math.round(base.data[p+c]*(1-a)+clean[p+c]*a);else locked++;
 }
 const size=416,left=616,top=331;
 const logo=await sharp(root+'/assets/logo/white_on_trans_bg/salvor-labs-logo-512.png').resize(size,size).ensureAlpha().raw().toBuffer();
 const mask=Buffer.alloc(width*height);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++)mask[(y+top)*width+x+left]=logo[(y*size+x)*4+3];
 const raw={width,height,channels:1};
 const blur2=await sharp(mask,{raw}).blur(2.1).greyscale().raw().toBuffer();const blur8=await sharp(mask,{raw}).blur(7).greyscale().raw().toBuffer();
 const occlusion=Buffer.alloc(width*height);const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
 // Trace the two smooth luminous edges of the cleaned ribbon; never retain an old dark band.
 for(let x=590;x<1060;x++){
  const dx=x-650,upper=600-.4*dx-.00018*dx*dx+3.3*Math.exp(-Math.pow((x-940)/60,2)),lower=upper+40;
  for(let y=Math.max(0,Math.floor(upper-3));y<Math.min(height,Math.ceil(lower+3));y++)occlusion[y*width+x]=Math.round(255*smooth(upper-2,upper+1,y)*(1-smooth(lower-1,lower+2,y)));
 }
 const occlusionSmooth=occlusion;
 const overlay=(p,color,a)=>{for(let c=0;c<3;c++)result[p+c]=Math.round(result[p+c]*(1-a)+color[c]*a);};
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const i=y*width+x,p=i*4,visible=1-occlusionSmooth[i]/255;
  if(blur8[i])overlay(p,[255,112,6],blur8[i]/255*.68*visible);
  if(blur2[i])overlay(p,[255,146,12],blur2[i]/255*.92*visible);
  if(mask[i]){const strength=mask[i]/255;overlay(p,[255,Math.round(130+124*strength),Math.round(8+226*strength)],Math.min(1,strength*1.08)*visible);}
 }
 const raw4={width,height,channels:4};
 await sharp(result,{raw:raw4}).png().toFile(path.join(__dirname,'../repair-native.png'));
 await sharp(result,{raw:raw4}).extract({left:595,top:320,width:440,height:430}).resize(880,860).flatten({background:'#060c12'}).png().toFile(path.join(__dirname,'../detail.png'));
 await sharp(mask,{raw}).png().toFile(path.join(__dirname,'../logo-mask.png'));
 fs.writeFileSync(path.join(__dirname,'../geometry.json'),JSON.stringify({width,height,sourceLogo:'assets/logo/white_on_trans_bg/salvor-labs-logo-512.png',uniformScale:size/512,logoCanvas:{left,top,width:size,height:size},cleanplate:'exec-5b5c8b86-ae22-42da-b326-78d37d3e1132.png',lockedOutsideLocalPlatePixels:locked,occlusion:'Continuous ribbon-edge occlusion traced on the clean plate; no old strip pixels or independent per-column jumps'},null,2));
 console.log({width,height,lockedOutsideLocalPlatePixels:locked,size,left,top});
})();
