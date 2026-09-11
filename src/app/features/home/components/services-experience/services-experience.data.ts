export type ServiceModelLayer = 'site' | 'program' | 'design' | 'structure' | 'envelope' | 'integration';
export interface HowellServiceStage { number: string; title: string; description: string; route: string; layers: readonly ServiceModelLayer[]; }
// Detail pages are not yet published; keep all destinations on the valid index.
export const HOWELL_SERVICE_STAGES: readonly HowellServiceStage[] = [
  { number: '01', title: 'PROGRAM MANAGEMENT', description: 'Aligning scope, stakeholders and strategy across the full program.', route: '/services', layers: ['site', 'program'] },
  { number: '02', title: 'DESIGN MANAGEMENT', description: 'Guiding design decisions so vision, performance and budget stay connected.', route: '/services', layers: ['design', 'envelope'] },
  { number: '03', title: 'CONSTRUCTION MANAGEMENT', description: 'Protecting quality, cost, schedule and communication in the field.', route: '/services', layers: ['structure'] },
  { number: '04', title: 'PARTNERSHIP & CONSULTING', description: 'Bringing seasoned perspective wherever the project needs it most.', route: '/services', layers: ['site', 'program', 'design', 'structure', 'envelope', 'integration'] }
];
export function serviceStageIndex(progress: number): number { return Math.min(3, Math.floor(Math.max(0, Number.isFinite(progress) ? progress : 0) * 4)); }
export interface ServiceBuildingPart { layer: ServiceModelLayer; size: [number, number, number]; at: [number, number, number]; }
export function serviceBuildingParts(): ServiceBuildingPart[] {
  const parts: ServiceBuildingPart[] = [];
  const box = (layer: ServiceModelLayer, size: ServiceBuildingPart['size'], at: ServiceBuildingPart['at']): void => { parts.push({ layer, size, at }); };
  box('site', [11, .05, 8], [0, -.3, 0]);
  for (let x = -5; x <= 5; x += 2) box('site', [.015, .015, 8], [x, -.25, 0]);
  for (let z = -4; z <= 4; z += 2) box('site', [11, .015, .015], [0, -.25, z]);
  for (let floor = 0; floor < 4; floor++) {
    const y = floor * 1.6;
    const width = floor === 3 ? 6.8 : 8.8;
    box('design', [width, .14, 5.6], [0, y, 0]);
    box('program', [3, 1.1, 2.2], [-1.9, y + .65, -.5]);
    box('program', [2.4, 1.1, 2.2], [1.9, y + .65, -.5]);
    for (const x of [-3.8, 0, 3.8]) {
      for (const z of [-2.35, 2.35]) box('structure', [.1, 1.6, .1], [x, y + .8, z]);
    }
    for (const z of [-2.35, 2.35]) box('structure', [8, .12, .1], [0, y + 1.5, z]);
    for (let bay = 0; bay < (floor === 3 ? 6 : 8); bay++) {
      const x = (bay - (floor === 3 ? 2.5 : 3.5)) * 1.08;
      box('envelope', [1.04, 1.4, .025], [x, y + .8, 2.8]);
    }
    for (const z of [-1.8, -.6, .6, 1.8]) box('envelope', [.025, 1.4, 1.15], [width / 2, y + .8, z]);
  }
  box('structure', [1.25, 6.5, 1.3], [.4, 3.1, -1.5]);
  box('integration', [7.1, .16, 5.9], [0, 6.5, 0]);
  box('integration', [5.4, .12, 1.6], [.7, 2.1, 3.3]);
  for (const x of [-1.8, 3.1]) box('integration', [.08, 2.1, .08], [x, 1.05, 3.8]);
  return parts;
}
export const SERVICE_LAYERS: readonly ServiceModelLayer[] = ['site', 'program', 'design', 'structure', 'envelope', 'integration'];
/** Continuous, reversible keyframe interpolation; stage selection stays discrete. */
export function layerPose(layer: ServiceModelLayer, progress: number): { opacity: number; y: number; x: number } {
  const p = Math.max(0, Math.min(1, progress));
  const phase = Math.min(3, p * 4);
  const from = Math.min(2, Math.floor(phase));
  const amount = phase >= 3 ? 1 : phase - from;
  const eased = amount * amount * (3 - 2 * amount);
  const visibility = HOWELL_SERVICE_STAGES.map(stage => stage.layers.includes(layer) ? .78 : .13);
  const explosion: Record<ServiceModelLayer, number[]> = {
    site: [0, 0, 0, 0], program: [.5, .2, .1, 0], design: [2.6, 1.7, .8, 0],
    structure: [1, .6, 0, 0], envelope: [3.6, 2, 1.2, 0], integration: [4.3, 3, 1.7, 0]
  };
  const lerp = (a: number, b: number): number => a + (b - a) * eased;
  return { opacity: lerp(visibility[from], visibility[from + 1]), y: lerp(explosion[layer][from], explosion[layer][from + 1]), x: layer === 'envelope' ? lerp([.7,.35,.2,0][from], [.7,.35,.2,0][from + 1]) : 0 };
}
