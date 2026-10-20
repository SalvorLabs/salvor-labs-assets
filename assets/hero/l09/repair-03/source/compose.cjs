const fs=require('node:fs'),assert=require('node:assert/strict');
const sharp=require('/Users/dwasyluk/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root='/Users/dwasyluk/Development/SALVORLABS/salvor-labs-assets';
(async()=>{
 const base=root+'/assets/hero/l09/repair-02/repair-native.png';
 const generated='/Users/dwasyluk/.codex/generated_images/01a10ef7-d42d-7623-a407-5640229757ca/exec-30178633-f0df-4c3e-a139-f5d46fb87486.png';
 const before=await sharp(base).ensureAlpha().raw().toBuffer({resolveWithObject:true}),after=await sharp(generated).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const {width,height}=before.info;assert.equal(after.info.width,width);assert.equal(after.info.height,height);
 const mark=await sharp(root+'/assets/logo/white_on_trans_bg/salvor-labs-logo-512.png').resize(416,416).ensureAlpha().raw().toBuffer();
 const mask=Buffer.alloc(width*height);for(let y=0;y<416;y++)for(let x=0;x<416;x++)mask[(y+331)*width+x+616]=mark[(y*416+x)*4+3]>=80?255:0;
 const protection=await sharp(mask,{raw:{width,height,channels:1}}).blur(2.2).greyscale().raw().toBuffer();assert.equal(protection.length,width*height);
 const regions=[[727,383,635,257,42],[824,379,793,305,26],[869,359,958,290,36],[673,424,568,432,29],[649,490,559,524,28],[668,551,594,591,27],[715,662,644,747,32],[806,707,800,803,31],[925,662,983,753,29],[993,584,1085,639,30],[1000,491,1105,517,30],[971,424,1042,477,28],[886,569,931,650,26]];
 function capsule(x,y,[ax,ay,bx,by,r]){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));const d=Math.hypot(x-ax-t*dx,y-ay-t*dy)/r;if(d>=1)return 0;if(d<=.65)return 1;const f=(1-d)/.35;return f*f*(3-2*f);}
 function ribbon(x,y){if(x<530||x>1135)return false;const dx=x-650,upper=600-.4*dx-.00018*dx*dx+3.3*Math.exp(-Math.pow((x-940)/60,2)),lower=751-.1*dx-.00030*dx*dx;return (y>=upper-4&&y<=upper+44)||(y>=lower-5&&y<=lower+24);}
 const out=Buffer.from(before.data);let changed=0,locked=0,graphPixels=0,graphMismatches=0,ribbonPixels=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
 const i=y*width+x,p=i*4;const graph=protection[i]>=25,isRibbon=ribbon(x,y);let alpha=Math.max(...regions.map(r=>capsule(x,y,r)))*(1-Math.min(1,protection[i]/25));
 if(graph||isRibbon||Math.pow((x-815)/300,2)+Math.pow((y-539)/282,2)>=1)alpha=0;
 if(alpha>0){for(let c=0;c<3;c++)out[p+c]=Math.round(before.data[p+c]*(1-alpha)+after.data[p+c]*alpha);}else locked++;
 const difference=[0,1,2,3].some(c=>out[p+c]!==before.data[p+c]);if(difference)changed++;if(alpha===0)assert(!difference);if(graph){graphPixels++;if(difference)graphMismatches++;}if(isRibbon){ribbonPixels++;assert(!difference);}
 if(y>=835||x<525||x>1140)assert(!difference);
 }assert.equal(graphMismatches,0);
 await sharp(out,{raw:{width,height,channels:4}}).png().toFile('/private/tmp/l09-projected-light-native.png');
 await sharp(out,{raw:{width,height,channels:4}}).extract({left:540,top:230,width:590,height:610}).resize(944,976).flatten({background:'#060c12'}).png().toFile('/private/tmp/l09-projected-light-detail.png');
 fs.writeFileSync('/private/tmp/l09-projected-light-preservation.json',JSON.stringify({width,height,source:'../repair-02/repair-native.png',edit:'Shorter, dimmer logo light cones only',requestedProjectionScale:0.5,requestedVisibilityScale:0.5,addedImageBlur:0,lockedPixels:locked,lockedPixelMismatches:0,changedPixels:changed,protectedGraphPixels:graphPixels,protectedGraphMismatches:graphMismatches,protectedRibbonPixels:ribbonPixels,outerSwirlAndLowerGlowUnchanged:true,alphaUnchanged:true,method:'Built-in ImageGen focused lighting edit with half-length/half-visibility brief; localized composition preserves canonical graph, foreground ribbons and the entire outer swirl. Numeric scales describe the brief, not a calibrated physical simulation.'},null,2)+'\n');
 console.log(JSON.stringify({changed,locked,graphPixels,graphMismatches}));
})();
