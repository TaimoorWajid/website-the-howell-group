import { SERVICES } from '../../../../core/data/company.data';
export type ServiceModelLayer =
  'site' | 'program' | 'design' | 'structure' | 'envelope' | 'integration';
export interface HowellServiceStage {
  number: string;
  title: string;
  description: string;
  route: string;
  layers: readonly ServiceModelLayer[];
}
// Shared service records supply canonical detail destinations.
const STAGE_LAYERS: readonly (readonly ServiceModelLayer[])[] = [
  ['site', 'program'],
  ['design', 'envelope'],
  ['structure'],
  ['program', 'integration'],
  ['site', 'program', 'design', 'structure', 'envelope', 'integration'],
];
export const HOWELL_SERVICE_STAGES: readonly HowellServiceStage[] =
  SERVICES.map((service, index) => ({
    number: String(index + 1).padStart(2, '0'),
    title: service.title.toUpperCase(),
    description: service.description ?? '',
    route: '/services/' + service.slug,
    layers: STAGE_LAYERS[index],
  }));
export function serviceStageIndex(progress: number): number {
  return Math.min(
    HOWELL_SERVICE_STAGES.length - 1,
    Math.floor(
      Math.max(0, Number.isFinite(progress) ? progress : 0) *
        HOWELL_SERVICE_STAGES.length,
    ),
  );
}
export interface ServiceBuildingPart {
  layer: ServiceModelLayer;
  size: [number, number, number];
  at: [number, number, number];
}
export function serviceBuildingParts(): ServiceBuildingPart[] {
  const parts: ServiceBuildingPart[] = [];
  const box = (
    layer: ServiceModelLayer,
    size: ServiceBuildingPart['size'],
    at: ServiceBuildingPart['at'],
  ): void => {
    parts.push({ layer, size, at });
  };
  box('site', [11, 0.05, 8], [0, -0.3, 0]);
  for (let x = -5; x <= 5; x += 2)
    box('site', [0.015, 0.015, 8], [x, -0.25, 0]);
  for (let z = -4; z <= 4; z += 2)
    box('site', [11, 0.015, 0.015], [0, -0.25, z]);
  for (let floor = 0; floor < 4; floor++) {
    const y = floor * 1.6;
    const width = floor === 3 ? 6.8 : 8.8;
    box('design', [width, 0.14, 5.6], [0, y, 0]);
    box('program', [3, 1.1, 2.2], [-1.9, y + 0.65, -0.5]);
    box('program', [2.4, 1.1, 2.2], [1.9, y + 0.65, -0.5]);
    for (const x of [-3.8, 0, 3.8]) {
      for (const z of [-2.35, 2.35])
        box('structure', [0.1, 1.6, 0.1], [x, y + 0.8, z]);
    }
    for (const z of [-2.35, 2.35])
      box('structure', [8, 0.12, 0.1], [0, y + 1.5, z]);
    for (let bay = 0; bay < (floor === 3 ? 6 : 8); bay++) {
      const x = (bay - (floor === 3 ? 2.5 : 3.5)) * 1.08;
      box('envelope', [1.04, 1.4, 0.025], [x, y + 0.8, 2.8]);
    }
    for (const z of [-1.8, -0.6, 0.6, 1.8])
      box('envelope', [0.025, 1.4, 1.15], [width / 2, y + 0.8, z]);
  }
  box('structure', [1.25, 6.5, 1.3], [0.4, 3.1, -1.5]);
  box('integration', [7.1, 0.16, 5.9], [0, 6.5, 0]);
  box('integration', [5.4, 0.12, 1.6], [0.7, 2.1, 3.3]);
  for (const x of [-1.8, 3.1])
    box('integration', [0.08, 2.1, 0.08], [x, 1.05, 3.8]);
  return parts;
}
export const SERVICE_LAYERS: readonly ServiceModelLayer[] = [
  'site',
  'program',
  'design',
  'structure',
  'envelope',
  'integration',
];
/** Continuous, reversible keyframe interpolation; stage selection stays discrete. */
export function layerPose(
  layer: ServiceModelLayer,
  progress: number,
): { opacity: number; y: number; x: number } {
  const p = Math.max(0, Math.min(1, progress));
  const last = HOWELL_SERVICE_STAGES.length - 1;
  const phase = Math.min(last, p * HOWELL_SERVICE_STAGES.length);
  const from = Math.min(last - 1, Math.floor(phase));
  const amount = phase >= last ? 1 : phase - from;
  const eased = amount * amount * (3 - 2 * amount);
  const visibility = HOWELL_SERVICE_STAGES.map((stage) =>
    stage.layers.includes(layer) ? 0.78 : 0.13,
  );
  const explosion: Record<ServiceModelLayer, number[]> = {
    site: [0, 0, 0, 0, 0],
    program: [0.5, 0.2, 0.1, 0.05, 0],
    design: [2.6, 1.7, 0.8, 0.4, 0],
    structure: [1, 0.6, 0, 0, 0],
    envelope: [3.6, 2, 1.2, 0.6, 0],
    integration: [4.3, 3, 1.7, 0.8, 0],
  };
  const lerp = (a: number, b: number): number => a + (b - a) * eased;
  return {
    opacity: lerp(visibility[from], visibility[from + 1]),
    y: lerp(explosion[layer][from], explosion[layer][from + 1]),
    x:
      layer === 'envelope'
        ? lerp(
            [0.7, 0.35, 0.2, 0.1, 0][from],
            [0.7, 0.35, 0.2, 0.1, 0][from + 1],
          )
        : 0,
  };
}
