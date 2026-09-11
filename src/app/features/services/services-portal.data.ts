export interface PortalPart { size: [number,number,number]; at: [number,number,number]; color: number; }
export function portalParts(): PortalPart[] {
  const parts: PortalPart[] = [];
  for (let i=0; i<5; i++) {
    const z = -i*4;
    parts.push({size:[.7,7,.8],at:[-4,3.5,z],color:0xa2aaa5}, {size:[.7,7,.8],at:[4,3.5,z],color:0x7a8984}, {size:[8.7,.7,.8],at:[0,7,z],color:0xbdc4bd});
  }
  parts.push({size:[12,.25,25],at:[0,-.25,-8],color:0x707f78}, {size:[2.6,.06,18],at:[0,-.08,-7],color:0x194442}, {size:[.35,3.2,19],at:[-5,1.5,-7],color:0x7c8d85}, {size:[.35,3.2,19],at:[5,1.5,-7],color:0x74867c}, {size:[7,.3,3],at:[0,.1,-19],color:0xb6bdb3});
  // A quiet planted courtyard at the vanishing point, not a product turntable.
  for (const x of [-2.5,2.5]) {
    parts.push({size:[1.5,.7,1.5],at:[x,.45,-18],color:0x6b7b70}, {size:[1.2,1.2,1.2],at:[x,1.3,-18],color:0x344e3c});
  }
  return parts;
}
