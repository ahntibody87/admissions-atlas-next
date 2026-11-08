const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const old=path.resolve(root,'../admissions-atlas');
fs.mkdirSync(path.join(root,'assets'),{recursive:true});
fs.copyFileSync(path.join(old,'assets/fonts/PretendardVariable.woff2'),path.join(root,'assets/PretendardVariable.woff2'));
fs.copyFileSync(path.join(old,'assets/fonts/Pretendard-LICENSE.txt'),path.join(root,'assets/Pretendard-LICENSE.txt'));
const source=fs.readFileSync(path.join(old,'analysis/index.html'),'utf8');
const universities=[...source.matchAll(/<a class="university-card" href="([^/]+)\/">([\s\S]*?)<\/a>/g)].map(m=>({
  slug:m[1],name:m[2].match(/<h2>(.*?)<\/h2>/)[1],campus:m[2].match(/class="university-label"><span>(.*?)<\/span>/)[1],count:Number(m[2].match(/(\d+)개 모집단위/)[1]),alias:m[2].match(/<span>([^<]+) 자료 열기<\/span>/)?.[1]??''
}));
if(universities.length!==29)throw Error('Expected 29 public university entries');
fs.writeFileSync(path.join(root,'data.js'),`// Public directory snapshot: admissions-atlas/analysis.\nwindow.ATAA_UNIVERSITIES=${JSON.stringify(universities)};\n`);
console.log(`Prepared ${universities.length} university entries; fonts copied with license.`);
