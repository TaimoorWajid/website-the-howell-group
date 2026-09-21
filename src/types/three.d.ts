declare module 'three' {
  export class Texture { mapping: number; colorSpace: string; dispose(): void; }
  export class CanvasTexture extends Texture { constructor(canvas: HTMLCanvasElement); }
  export class BufferGeometry { dispose(): void; }
  export class Vector3 { x: number; y: number; z: number; constructor(x?: number, y?: number, z?: number); set(x: number, y: number, z: number): this; }
  export class Plane { constant: number; constructor(normal?: Vector3, constant?: number); }
  export class Material { transparent: boolean; opacity: number; clippingPlanes: Plane[] | null; dispose(): void; }
  export class Object3D { add(...objects: Object3D[]): this; name: string; visible: boolean; children: Object3D[]; position: Vector3; scale: Vector3; rotation: { x: number; y: number; z: number }; castShadow: boolean; receiveShadow: boolean; lookAt(x: number, y: number, z: number): void; traverse(callback: (object: Object3D) => void): void; }
  export class Mesh extends Object3D { geometry: BufferGeometry; material: Material | Material[]; constructor(geometry?: BufferGeometry, material?: Material); }
  export class LineSegments extends Object3D { geometry: BufferGeometry; material: Material | Material[]; constructor(geometry?: BufferGeometry, material?: Material); }
  export class Group extends Object3D { add(...objects: Object3D[]): this; }
  export class Scene extends Object3D { environment: Texture | null; add(...objects: Object3D[]): this; }
  export class BoxGeometry extends BufferGeometry { constructor(width?: number, height?: number, depth?: number); }
  export class EdgesGeometry extends BufferGeometry { constructor(geometry: BufferGeometry); }
  export class LineBasicMaterial extends Material { constructor(parameters?: Record<string, unknown>); }
  export class MeshPhysicalMaterial extends Material { constructor(parameters?: Record<string, unknown>); }
  export class GridHelper extends LineSegments { constructor(size?: number, divisions?: number, colorCenterLine?: number | string, colorGrid?: number | string); }
  export class OrthographicCamera extends Object3D { left: number; right: number; top: number; bottom: number; near: number; far: number; constructor(left?: number, right?: number, top?: number, bottom?: number, near?: number, far?: number); updateProjectionMatrix(): void; }
  export class MeshStandardMaterial extends Material { constructor(parameters?: Record<string, unknown>); }
  export class HemisphereLight extends Object3D { constructor(skyColor?: number | string, groundColor?: number | string, intensity?: number); }
  export class DirectionalLight extends Object3D { constructor(color?: number | string, intensity?: number); shadow: { mapSize: { set(width: number, height: number): void }; camera: { left: number; right: number; top: number; bottom: number; near: number; far: number }; bias: number; normalBias: number; dispose(): void }; }
  export const PCFShadowMap: number;
  export const SRGBColorSpace: string;
  export const ACESFilmicToneMapping: number;
  export const EquirectangularReflectionMapping: number;
  export class WebGLRenderer { domElement: HTMLCanvasElement; localClippingEnabled: boolean; outputColorSpace: string; toneMapping: number; toneMappingExposure: number; shadowMap: { enabled: boolean; type: number; autoUpdate: boolean; needsUpdate: boolean }; constructor(parameters?: Record<string, unknown>); setPixelRatio(value: number): void; setSize(width: number, height: number, updateStyle?: boolean): void; setClearColor(color: number | string, alpha?: number): void; render(scene: Scene, camera: PerspectiveCamera | OrthographicCamera): void; dispose(): void; forceContextLoss(): void; }
  export class PerspectiveCamera extends Object3D { aspect: number; fov: number; constructor(fov?: number, aspect?: number, near?: number, far?: number); updateProjectionMatrix(): void; }
  export class TextureLoader { loadAsync(url: string): Promise<Texture>; }
}
