import * as THREE from 'three';

export function disposeObject(object: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materialsToDispose = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  object.traverse((child) => {
    const drawable = child as THREE.Object3D & { geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] };
    if (!drawable.geometry || !drawable.material) return;
    geometries.add(drawable.geometry);
    const materials = Array.isArray(drawable.material) ? drawable.material : [drawable.material];
    materials.forEach((material) => {
      Object.values(material as unknown as Record<string, unknown>).forEach((value: unknown) => { if (value instanceof THREE.Texture) textures.add(value); });
      materialsToDispose.add(material);
    });
  });
  textures.forEach(texture => texture.dispose());
  materialsToDispose.forEach(material => material.dispose());
  geometries.forEach(geometry => geometry.dispose());
}
