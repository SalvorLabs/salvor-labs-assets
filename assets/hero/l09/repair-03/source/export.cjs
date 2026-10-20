const fs=require('node:fs');const sharp=require('/Users/dwasyluk/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async()=>{
 const source='/private/tmp/l09-projected-light-native.png';
 const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 // Clear negligible alpha noise and ease only low-opacity fringe at the native frame edge.
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
  const p=(y*info.width+x)*4;let a=data[p+3];if(a<=2)a=0;
  const edge=Math.min(x,y,info.width-1-x,info.height-1-y);if(edge<14&&a<80){const t=edge/14;a=Math.round(a*t*t*(3-2*t));}
  if(a>=250)a=255;data[p+3]=a;
 }
 const padded=await sharp(data,{raw:info}).extend({left:96,right:96,top:64,bottom:64,background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
 await sharp(padded).resize(3072,2048,{kernel:'lanczos3'}).png().toFile('/private/tmp/salvorlabs-sphere-l09-projected-light-review-3072.png');
 for(const bg of ['#ffffff','#060c12'])await sharp(padded).resize(1200,800).flatten({background:bg}).png().toFile('/private/tmp/l09-projected-light-on-'+(bg==='#ffffff'?'white':'dark')+'.png');
 await sharp(padded).resize(1200,800).png().toFile('/private/tmp/l09-projected-light-preview.png');
 console.log(JSON.stringify({sourceNative:[info.width,info.height],export:[3072,2048],transparent:true,paddingNative:[96,64],method:'Padded high-resolution export from 1536x1024 native ImageGen RGBA, 14px low-alpha fringe easing; opaque sphere core'}));
})();
