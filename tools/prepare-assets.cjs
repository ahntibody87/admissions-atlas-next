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
// Deterministic height contours, drawn as vector paths rather than generated imagery.
const peaks=[[280,310,1.1,250,180],[650,560,1.4,310,210],[1050,250,1.8,240,260],[1370,650,1.5,310,180],[-50,850,1.1,360,220],[720,-90,1.1,260,210]];
const height=(x,y)=>peaks.reduce((v,[cx,cy,h,sx,sy])=>v+h*Math.exp(-(((x-cx)/sx)**2+((y-cy)/sy)**2)),0)+.07*Math.sin(x/65+y/90)+.035*Math.cos(x/39-y/46);
const step=10,w=1500,h=950,nx=w/step,ny=h/step;
const field=Array.from({length:ny+1},(_,y)=>Array.from({length:nx+1},(_,x)=>height(x*step,y*step)));
let contours='';
for(let level=.12,n=0;level<2.15;level+=.055,n++){
  let segments=[];
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
    const points=[[i*step,j*step],[(i+1)*step,j*step],[(i+1)*step,(j+1)*step],[i*step,(j+1)*step]];
    const vals=[field[j][i],field[j][i+1],field[j+1][i+1],field[j+1][i]];
    const hits=[];
    for(let k=0;k<4;k++){
      const l=(k+1)%4;
      if((vals[k]<level)!==(vals[l]<level)){
        const t=(level-vals[k])/(vals[l]-vals[k]);
        hits.push([points[k][0]+t*(points[l][0]-points[k][0]),points[k][1]+t*(points[l][1]-points[k][1])]);
      }
    }
    for(let k=0;k+1<hits.length;k+=2)segments.push(`M${hits[k][0].toFixed(1)},${hits[k][1].toFixed(1)}L${hits[k+1][0].toFixed(1)},${hits[k+1][1].toFixed(1)}`);
  }
  contours+=`<path class="contour ${n%5===0?'contour-major':''}" d="${segments.join('')}"/>`;
}
const route='M245 720C370 720 330 570 470 560S570 340 700 370S810 230 920 245S1080 110 1190 145';
const nodes=[[470,560,'01','목표 설계'],[700,370,'02','자료 아카이브'],[920,245,'03','전형 분석'],[1190,145,'04','원서 접수 시뮬레이션']];
const map=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none"><path class="map-water" d="M-30 780C175 810 110 640 310 655S450 800 560 750S720 620 800 680S930 970 1170 880L1500 950H-30Z"/><g class="map-grid">${Array.from({length:16},(_,n)=>`<path d="M${n*100} 0V950"/>`).join('')}${Array.from({length:10},(_,n)=>`<path d="M0 ${n*100}H1500"/>`).join('')}</g>${contours}<path class="route-shadow" d="${route}"/><path class="route" d="${route}"/><path class="route route-branch" d="M470 560C570 620 780 550 920 245M700 370C900 470 1080 370 1190 145"/>${nodes.map(([x,y,no,label])=>`<circle class="map-node" cx="${x}" cy="${y}" r="10"/><circle class="node-dot" cx="${x}" cy="${y}" r="3"/><text class="map-meta" x="${x+22}" y="${y-9}">${no} / ADMISSIONS</text><text class="map-text" x="${x+22}" y="${y+12}">${label}</text>`).join('')}<circle class="moving-dot" r="4"/><g class="map-meta"><text x="1230" y="780">N</text><path stroke="currentColor" d="M1235 795v50m-5-43 5-7 5 7"/><text x="930" y="860">ATAA / EXPLORATION MAP</text></g></svg>`;
fs.writeFileSync(path.join(root,'data.js'),`// Public directory snapshot: admissions-atlas/analysis, checked 2026-11-06.\nwindow.ATAA_UNIVERSITIES=${JSON.stringify(universities)};\nwindow.ATAA_MAP=${JSON.stringify(map)};\n`);
console.log(`Prepared ${universities.length} university entries and original vector map; fonts copied with license.`);
