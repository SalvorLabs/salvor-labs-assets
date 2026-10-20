const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const sharp=require(process.env.SALVOR_SHARP_PATH || 'sharp');
const root=path.resolve(__dirname,'../../../../..'); const outputDir=path.resolve(process.argv[2] || path.join(__dirname,'../build')); fs.mkdirSync(outputDir,{recursive:true});const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(t*(6*t-15)+10);};
(async()=>{
 const original=await sharp(root+'/assets/hero/l09/repair-03/repair-native.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const generated=await sharp(path.join(__dirname,'glow-extraction-native.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const {width:w,height:h}=original.info;const pad=224,W=w+2*pad,H=h+2*pad,full=Buffer.alloc(W*H*4);let fixedLogoPixels=0,fixedLogoMismatches=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const s=(y*w+x)*4,p=((y+pad)*W+x+pad)*4;const r=Math.hypot((x-815)/230,(y-535)/240);let keep=1-smooth((r-1)/.08);
  // Keep the generated foreground light ribbons at crossings; preserve the actual cutout geometry behind them.
  const dx=x-650,upper=600-.4*dx-.00018*dx*dx+3.3*Math.exp(-Math.pow((x-940)/60,2)),lower=751-.1*dx-.00030*dx*dx;
  const ribbon=(x>530&&x<1135)&&((y>=upper-5&&y<=upper+45)||(y>=lower-5&&y<=lower+24));if(ribbon)keep=0;
  let alpha=generated.data[s+3]*(1-keep)+original.data[s+3]*keep;
  // Remove the painted bottom bloom before replacing it with a clean, continuous luminous oval.
  const bottomFade=1-smooth((y-835)/30);alpha*=bottomFade;
  for(let c=0;c<3;c++)full[p+c]=Math.round(generated.data[s+c]*(1-keep)+original.data[s+c]*keep);full[p+3]=Math.round(alpha);
  if(r<=1&&!ribbon){fixedLogoPixels++;if([0,1,2,3].some(c=>full[p+c]!==original.data[s+c]))fixedLogoMismatches++;}
 }
 assert.equal(fixedLogoMismatches,0);
 const alpha=Buffer.alloc(W*H),rgb=Buffer.alloc(W*H*3);for(let i=0;i<W*H;i++){const a=full[i*4+3];alpha[i]=a;for(let c=0;c<3;c++)rgb[i*3+c]=Math.round(full[i*4+c]*a/255);}
 const ba=await sharp(alpha,{raw:{width:W,height:H,channels:1}}).blur(28).greyscale().raw().toBuffer();
 const br=await sharp(rgb,{raw:{width:W,height:H,channels:3}}).blur(28).raw().toBuffer();assert.equal(ba.length,W*H);assert.equal(br.length,W*H*3);
 const out=Buffer.from(full);
 function over(p,color,a){if(a<.00001)return;const old=out[p+3]/255,oa=a+old*(1-a);for(let c=0;c<3;c++)out[p+c]=Math.round((color[c]*a+out[p+c]*old*(1-a))/oa);out[p+3]=Math.round(oa*255);}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const i=y*W+x,p=i*4,sx=x-pad,sy=y-pad,inside=sx>=0&&sx<w&&sy>=0&&sy<h,edge=inside?Math.min(sx,sy,w-1-sx,h-1-sy):-1;
  const blend=inside?1-smooth(edge/18):1;
  if(blend>0){const oldA=full[p+3]/255,newA=ba[i]/255,mixed=oldA*(1-blend)+newA*blend;for(let c=0;c<3;c++){const pre=full[p+c]*oldA*(1-blend)+br[i*3+c]*blend;out[p+c]=mixed>0?Math.max(0,Math.min(255,Math.round(pre/mixed))):0;}out[p+3]=Math.round(mixed*255);}
  // The hover bloom is analytic light, with no texture, opacity threshold or hard mask boundary.
  if(sy>=840){const q=Math.pow((sx-815)/205,2)+Math.pow((sy-925)/31,2),rho=Math.sqrt(q),haze=.13*Math.exp(-q*.68),core=.25*Math.exp(-q*1.6),ring=.74*Math.exp(-Math.pow((rho-.76)/.31,2));
   const hue=smooth((sx-650)/330);over(p,[105+110*hue,170-20*hue,255],haze);over(p,[175,148,255],core);over(p,[250,253,255],ring);
  }
  if(out[p+3]>=250)out[p+3]=255; if(out[p+3]<=1)out[p]=out[p+1]=out[p+2]=out[p+3]=0;
 }
 await sharp(out,{raw:{width:W,height:H,channels:4}}).png().toFile(outputDir+'/l09-contained-clean-native.png');
 function bounds(data,width,height){let left=width,top=height,right=-1,bottom=-1;for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(data[(y*width+x)*4+3]){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}return {left,top,width:right-left+1,height:bottom-top+1};}
 const nativeBounds=bounds(out,W,H),resized=await sharp(out,{raw:{width:W,height:H,channels:4}}).extract(nativeBounds).resize({width:4086,height:4086,fit:'inside',kernel:'lanczos3'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 for(let i=0;i<resized.info.width*resized.info.height;i++){const p=i*4;if(resized.data[p+3]>=254)resized.data[p+3]=255;if(resized.data[p+3]===0)resized.data[p]=resized.data[p+1]=resized.data[p+2]=0;}
 const finalBounds=bounds(resized.data,resized.info.width,resized.info.height);
 const output=await sharp(resized.data,{raw:{width:resized.info.width,height:resized.info.height,channels:4}}).extract(finalBounds).extend({left:5,right:5,top:5,bottom:5,background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
 const file=outputDir+'/salvorlabs-sphere-l09-contained-transparent-4096.png';fs.writeFileSync(file,output);const m=await sharp(output).metadata();
 for(const [name,bg]of[['dark','#060c12'],['white','#ffffff'],['gray','#858585']])await sharp(output).resize({width:1400,height:1000,fit:'inside'}).flatten({background:bg}).png().toFile(outputDir+'/l09-contained-clean-on-'+name+'.png');
 await sharp(output).resize({width:1400,height:1000,fit:'inside'}).png().toFile(outputDir+'/l09-contained-clean-preview.png');
 await sharp(original.data,{raw:original.info}).extract({left:580,top:290,width:500,height:500}).resize(900,900).flatten({background:'#060c12'}).png().toFile(outputDir+'/l09-contained-clean-logo-detail.png');
 const report={source:'../repair-03/repair-native.png',glowReference:'Approved locked hero; ImageGen background extraction',nativeSource:[w,h],expandedNative:[W,H],export:[m.width,m.height],clearBorderPixels:5,nativeBounds,fixedLogoPixels,fixedLogoRGBMismatches:0,logoAlphaNormalization:"Nearly opaque generated pixels normalized to fully opaque; fractional glow alpha retained",requestedConeProjectionScale:.5,requestedConeVisibilityScale:.5,logoOrConeBlurAdded:0,outerGlow:'Generated restrained extraction; edge light continued in premultiplied alpha into expanded canvas. Entire fixed logo region is copied from repair-03, except foreground ribbons.',bottomGlow:'Smooth analytic white oval with restrained blue/violet translucent falloff; painted blur removed. No ground texture or shadow.',exportMethod:'Lanczos enlargement from native bitmap, alpha bounds measured after resampling; exactly five transparent pixels added on every side.',productionReplaced:false};
 fs.writeFileSync(outputDir+'/l09-contained-clean-preservation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
})();
