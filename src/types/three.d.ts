declare module 'three' {
  export class Texture { dispose(): void; }
  export class BufferGeometry { dispose(): void; }
  export class Material { dispose(): void; }
  export class Object3D { traverse(callback: (object: Object3D) => void): void; }
  export class Mesh extends Object3D { geometry: BufferGeometry; material: Material | Material[]; }
  export class Scene extends Object3D {}
  export class WebGLRenderer { domElement: HTMLCanvasElement; constructor(parameters?: Record<string, unknown>); setPixelRatio(value: number): void; setSize(width: number, height: number, updateStyle?: boolean): void; dispose(): void; }
  export class PerspectiveCamera extends Object3D { aspect: number; position: { set(x: number, y: number, z: number): void }; constructor(fov?: number, aspect?: number, near?: number, far?: number); updateProjectionMatrix(): void; }
  export class TextureLoader { loadAsync(url: string): Promise<Texture>; }
}
