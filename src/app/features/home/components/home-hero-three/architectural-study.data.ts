/** An illustrative architectural study, never a claim about a built Howell project.
 * This geometry description also generates the static, no-WebGL fallback. */
export type Surface = 'concrete' | 'glass' | 'steel' | 'wood' | 'paving' | 'plant';
export interface BuildingPart { size: [number, number, number]; at: [number, number, number]; surface: Surface; technical: boolean; }
export const STUDY_PALETTE: Record<Surface, string> = {
  concrete: '#d7d6cb', glass: '#70969d', steel: '#526d70', wood: '#ae8258', paving: '#dedfd6', plant: '#6c8066'
};
export function architecturalParts(): BuildingPart[] {
  const parts: BuildingPart[] = [];
  const box = (surface: Surface, size: BuildingPart['size'], at: BuildingPart['at'], technical = true): void => { parts.push({ surface, size, at, technical }); };
  // Low podium and stepped approach anchor the pavilion to the landscape.
  box('paving', [15.5, .16, 8.8], [0, -.14, .4], false);
  box('concrete', [11.6, .16, 6.2], [0, .02, 0]);
  for (let level = 0; level < 5; level++) {
    const y = .25 + level * 1.5;
    box('concrete', [11.8, .16, 5.5], [-.2, y, -.2]);
    if (level < 4) {
      for (let bay = 0; bay < 10; bay++) {
        const x = -5.5 + bay * 1.14;
        box('glass', [1.08, 1.31, .045], [x, y + .75, 2.52]);
        box('steel', [.035, 1.35, .1], [x + .56, y + .75, 2.55]);
      }
      for (const x of [-5.7, -3.45, -1.2, 1.05, 3.3, 5.55]) {
        box('concrete', [.16, 1.36, .16], [x, y + .75, 2.2]);
        box('concrete', [.16, 1.36, .16], [x, y + .75, -2.45]);
      }
      for (let bay = 0; bay < 5; bay++) {
        const z = -2.25 + bay * 1.04;
        box('glass', [.05, 1.32, 1], [5.68, y + .75, z]);
        box('steel', [.09, 1.36, .035], [5.72, y + .75, z + .51]);
      }
    }
  }
  // Concrete service spine, roof plant enclosure and articulated east wing.
  box('concrete', [11.5, 6.2, .24], [-.2, 3.2, -2.85]);
  box('concrete', [2.5, .42, 3.6], [3.8, 6.6, -.6]);
  box('concrete', [.65, 6.7, 2.6], [6.05, 3.25, -1.75]);
  box('concrete', [2, 4.5, 3.8], [-5.55, 2.3, -1.2]);
  // A double-height entry pavilion projects beyond the glazed elevation.
  box('glass', [4.3, 2.5, .06], [1.3, 1.35, 3.35]);
  for (const x of [-.85, .23, 1.3, 2.37, 3.45]) box('steel', [.045, 2.52, .12], [x, 1.35, 3.4]);
  box('wood', [6.5, .18, 2.1], [1.8, 2.8, 3.05]);
  box('steel', [6.65, .08, 2.2], [1.8, 2.93, 3.05]);
  for (let i = 0; i < 22; i++) box('wood', [.06, .12, 2.05], [-1.3 + i * .295, 2.65, 3.05]);
  for (const x of [-1.3, 4.9]) box('steel', [.095, 2.6, .095], [x, 1.3, 3.8]);
  // Fine sun-control blades and over-sailing roof distinguish the architecture.
  for (let i = 0; i < 13; i++) box('steel', [.045, .24, 5.9], [-5.8 + i * .95, 6.4, -.05]);
  for (let i = 0; i < 3; i++) box('concrete', [7.6, .09, .4], [1, .025 - i * .08, 4.2 + i * .4], false);
  for (const x of [-4.4, 5.9]) {
    box('concrete', [1.6, .32, 1.3], [x, .17, 3.9], false);
    box('plant', [1.4, .34, 1.1], [x, .48, 3.9], false);
  }
  return parts;
}
