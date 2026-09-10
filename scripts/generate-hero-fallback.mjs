// Regenerate the static study from the same part data used by Three.js.
// No browser, image model, external assets or additional dependency required.
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync('src/app/features/home/components/home-hero-three/architectural-study.data.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const { architecturalParts, STUDY_PALETTE } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const width = 1200, height = 1000, boundary = -2.6;
const sub = (a,b) => a.map((v,i)=>v-b[i]);
const dot = (a,b) => a.reduce((v,n,i)=>v+n*b[i],0);
const norm = v => v.map(n=>n/Math.hypot(...v));
const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const camera=[14*1.12,8*1.12,19*1.12], forward=norm(sub([0,2.7,.2],camera)), right=norm(cross(forward,[0,1,0])), up=cross(right,forward);
const focal=height/(2*Math.tan(16*Math.PI/180));
const project = p => { const v=sub(p,camera), z=dot(v,forward); return [width/2+dot(v,right)*focal/z,height/2-dot(v,up)*focal/z,z]; };
const coords = points => points.map(p=>project(p).slice(0,2).map(n=>n.toFixed(2)).join(',')).join(' ');
const faces = [[0,3,2,1],[4,5,6,7],[0,1,5,4],[3,7,6,2],[0,4,7,3],[1,2,6,5]];
const edgePairs=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
const clip = (points, x, keepRight=true) => {
  const result=[];
  for(let i=0;i<points.length;i++) {
    const a=points[i], b=points[(i+1)%points.length];
    const inside=p=>keepRight?p[0]>=x:p[0]<=x;
    if(inside(a)) result.push(a);
    if(inside(a)!==inside(b)) { const t=(x-a[0])/(b[0]-a[0]); result.push(a.map((v,j)=>v+(b[j]-v)*t)); }
  }
  return result;
};
const polygons=[], lines=[];
for(const part of architecturalParts()) {
  const [w,h,d]=part.size, [x,y,z]=part.at;
  const vertices=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(v=>[x+v[0]*w/2,y+v[1]*h/2,z+v[2]*d/2]);
  for (const indices of faces) {
    const face=indices.map(i=>vertices[i]), normal=norm(cross(sub(face[1],face[0]),sub(face[2],face[0])));
    if(dot(normal,sub(camera,face[0]))<=0) continue;
    const clipped=part.technical?clip(face,boundary):face;
    if(clipped.length<3) continue;
    const light=.76+Math.max(0,dot(normal,norm([-5,13,10])))*.26;
    const rgb=STUDY_PALETTE[part.surface].slice(1).match(/../g).map(s=>Math.min(255,Math.round(parseInt(s,16)*light)));
    const color=part.surface === 'glass' ? 'url(#glass)' : `rgb(${rgb.join(',')})`;
    polygons.push({depth:clipped.reduce((n,p)=>n+project(p)[2],0)/clipped.length,svg:`<polygon points="${coords(clipped)}" fill="${color}" stroke="${color}" stroke-width=".45"/>`});
  }
  if(part.technical) for(const [a,b] of edgePairs) {
    const points=clip([vertices[a],vertices[b]],boundary+.12,false);
    if(points.length>=2) lines.push(`<polyline points="${coords(points)}"/>`);
  }
}
polygons.sort((a,b)=>b.depth-a.depth);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1000" viewBox="0 0 1200 1000"><title>Architectural study: drawing becoming a finished place</title><desc>Illustrative glazed pavilion with concrete structure and a warm entrance canopy; its left wing remains a technical drawing. Not an actual Howell project.</desc><defs><linearGradient id="glass" gradientUnits="userSpaceOnUse" x1="200" y1="140" x2="850" y2="800"><stop stop-color="#c3dbe0"/><stop offset=".35" stop-color="#88afb9"/><stop offset=".58" stop-color="#aac5ca"/><stop offset=".6" stop-color="#709a9f"/><stop offset="1" stop-color="#527a7f"/></linearGradient><radialGradient id="shadow"><stop stop-color="#526562" stop-opacity=".18"/><stop offset="1" stop-color="#526562" stop-opacity="0"/></radialGradient></defs><ellipse cx="650" cy="739" rx="460" ry="105" fill="url(#shadow)"/>${polygons.map(p=>p.svg).join('')}<g fill="none" stroke="#427b80" stroke-width=".7" stroke-opacity=".36" stroke-linejoin="round">${lines.join('')}</g></svg>`;
fs.writeFileSync('public/images/hero/architectural-study.svg',svg);
console.log(`Generated ${Math.round(Buffer.byteLength(svg)/1024)} kB architectural fallback from ${architecturalParts().length} parts.`);
