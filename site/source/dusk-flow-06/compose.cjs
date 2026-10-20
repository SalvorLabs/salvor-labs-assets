const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),path=require('node:path');
const sharp=require(process.env.SALVOR_SHARP_PATH || 'sharp');
const root=path.resolve(__dirname,'../../..'),hash=b=>crypto.createHash('sha256').update(b).digest('hex'),smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const outputDir=path.resolve(process.argv[2] || path.join(__dirname,'build'));fs.mkdirSync(outputDir,{recursive:true});
(async()=>{
 const before=await sharp(root+'/site/source/dusk-flow-05/l09-final.png').removeAlpha().raw().toBuffer({resolveWithObject:true});
 const plate=await sharp(path.join(__dirname,'cleanplate-generated.png')).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const {width,height}=before.info;assert.equal(plate.info.width,width);assert.equal(plate.info.height,height);const clean=Buffer.from(before.data);let locked=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const alpha=smooth((x-270)/45)*smooth((1430-x)/45)*smooth((740-y)/50);const p=(y*width+x)*3;if(alpha>0)for(let c=0;c<3;c++)clean[p+c]=Math.round(before.data[p+c]*(1-alpha)+plate.data[p+c]*alpha);else locked++;}
 const artwork=fs.readFileSync(root+'/assets/hero/l09/salvorlabs-sphere-l09-contained-transparent-4096.png');
 const scaled=await sharp(artwork).resize({width:1100,kernel:'lanczos3'}).png().toBuffer();
 const hero=await sharp(clean,{raw:{width,height,channels:3}}).composite([{input:scaled,left:288,top:7}]).removeAlpha().png().toBuffer();
 const webp=await sharp(hero).webp({lossless:true,effort:6}).toBuffer();const after=await sharp(hero).removeAlpha().raw().toBuffer();let changed=0,preserved=0,mismatch=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const p=(y*width+x)*3,different=[0,1,2].some(c=>after[p+c]!==before.data[p+c]);if(different)changed++;if(x<270||x>=1430||y>=740){preserved++;if(different)mismatch++;}}
 assert.equal(mismatch,0);assert.deepEqual(await sharp(webp).removeAlpha().raw().toBuffer(),after);
 fs.writeFileSync(outputDir+'/l09-canonical-hero.png',hero);fs.writeFileSync(outputDir+'/l09-canonical-hero.webp',webp);await sharp(hero).resize(1400).png().toFile(outputDir+'/l09-canonical-hero-preview.png');
 fs.writeFileSync(outputDir+'/l09-canonical-hero-preservation.json',JSON.stringify({width,height,artwork:{path:'assets/hero/l09/repair-04/salvorlabs-sphere-l09-contained-transparent-4096.png',sha256:hash(artwork)},background:'Previous approved dusk hero with local clean-plate replacement behind the object; ground reflected illumination retained',sprite:{left:288,top:7,width:1100},backgroundMask:{left:270,right:1430,bottom:740,horizontalFeather:45,bottomFeather:50},lockedOuterLandscapePixels:preserved,lockedPixelMismatches:mismatch,changedPixels:changed,losslessWebpVerified:true,logoReinterpreted:false,method:'Deterministic alpha composition of the exact approved transparent artwork over a locally cleaned background; no logo or sphere regeneration'},null,2)+'\n');console.log(JSON.stringify({width,height,changed,preserved,mismatch,webpBytes:webp.length}));
})();
