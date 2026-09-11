import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync('src/app/features/home/components/services-experience/services-experience.data.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const { serviceBuildingParts } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const edges = [[0,1],[1,3],[3,2],[2,0],[4,5],[5,7],[7,6],[6,4],[0,4],[1,5],[2,6],[3,7]];
const project = ([x,y,z]) => [350 + (x*.78-z*.63)*40, 550 + (x*.32+z*.4-y*.86)*40];
const paths = serviceBuildingParts().map(part => {
  const corners = Array.from({length:8}, (_,i) => project(part.at.map((v,axis) => v + ((i >> axis & 1) ? .5 : -.5)*part.size[axis])));
  const d = edges.map(([a,b]) => `M${corners[a].map(v=>v.toFixed(1)).join(',')}L${corners[b].map(v=>v.toFixed(1)).join(',')}`).join('');
  return `<path d="${d}" opacity="${part.layer === 'program' ? '.18' : part.layer === 'site' ? '.22' : '.6'}"/>`;
}).join('\n');
fs.mkdirSync('public/images/services', {recursive:true});
fs.writeFileSync('public/images/services/coordinated-building.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 800" fill="none" stroke="#c7ded7" stroke-width=".85">${paths}</svg>`);
