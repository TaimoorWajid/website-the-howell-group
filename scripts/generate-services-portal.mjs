import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync('src/app/features/services/services-portal.data.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;
const {portalParts}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0),norm=a=>a.map(v=>v/Math.hypot(...a)),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const camera=[8,5.5,13],forward=norm(sub([0,3,-8],camera)),right=norm(cross(forward,[0,1,0])),up=cross(right,forward),focal=900/(2*Math.tan(43*Math.PI/360));
const project=p=>{const v=sub(p,camera),z=dot(v,forward);return[500+dot(v,right)*focal/z,450-dot(v,up)*focal/z,z];};
const faces=[[0,1,3,2],[4,5,7,6],[0,4,6,2],[1,5,7,3],[0,1,5,4],[2,3,7,6]],polygons=[];
for(const part of portalParts()) {
 const corners=Array.from({length:8},(_,i)=>project(part.at.map((v,a)=>v+((i>>a&1)?.5:-.5)*part.size[a])));
 faces.forEach((face,index)=>{const points=face.map(i=>corners[i]);const rgb=[part.color>>16&255,part.color>>8&255,part.color&255].map(v=>Math.round(v*[.75,1,.8,.65,1,.9][index]));polygons.push({z:points.reduce((n,p)=>n+p[2],0)/4,svg:`<polygon points="${points.map(p=>p.slice(0,2).map(n=>n.toFixed(1)).join(',')).join(' ')}" fill="rgb(${rgb.join(',')})" stroke="#344d46" stroke-width=".5"/>`});});
}
polygons.sort((a,b)=>b.z-a.z);
fs.mkdirSync('public/images/services',{recursive:true});fs.writeFileSync('public/images/services/portal-poster.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 900"><rect width="1000" height="900" fill="#0b3d3d"/>${polygons.map(p=>p.svg).join('')}</svg>`);
