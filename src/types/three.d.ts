declare module 'three' {
  export class Texture { dispose(): void; }
  export class BufferGeometry { dispose(): void; }
  export class Material { dispose(): void; }
  export class Object3D { position: { x: number; y: number; z: number; set(x: number, y: number, z: number): void }; rotation: { x: number; y: number; z: number }; traverse(callback: (object: Object3D) => void): void; }
  export class Mesh extends Object3D { geometry: BufferGeometry; material: Material | Material[]; }
  export class LineSegments extends Object3D { geometry: BufferGeometry; material: Material | Material[]; constructor(geometry?: BufferGeometry, material?: Material); }
  export class Group extends Object3D { add(...objects: Object3D[]): this; }
  export class Scene extends Object3D { add(...objects: Object3D[]): this; }
  export class BoxGeometry extends BufferGeometry { constructor(width?: number, height?: number, depth?: number); }
  export class EdgesGeometry extends BufferGeometry { constructor(geometry: BufferGeometry); }
  export class LineBasicMaterial extends Material { constructor(parameters?: Record<string, unknown>); }
  export class WebGLRenderer { domElement: HTMLCanvasElement; constructor(parameters?: Record<string, unknown>); setPixelRatio(value: number): void; setSize(width: number, height: number, updateStyle?: boolean): void; render(scene: Scene, camera: PerspectiveCamera): void; dispose(): void; }
  export class PerspectiveCamera extends Object3D { aspect: number; position: { set(x: number, y: number, z: number): void }; constructor(fov?: number, aspect?: number, near?: number, far?: number); updateProjectionMatrix(): void; }
  export class TextureLoader { loadAsync(url: string): Promise<Texture>; }
}
