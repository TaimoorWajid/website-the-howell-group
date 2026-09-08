import * as THREE from 'three';

export function disposeObject(object: THREE.Object3D): void {
  object.traverse((child) => {
    const drawable = child as THREE.Object3D & { geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] };
    if (!drawable.geometry || !drawable.material) return;
    drawable.geometry.dispose();
    const materials = Array.isArray(drawable.material) ? drawable.material : [drawable.material];
    materials.forEach((material) => {
      Object.values(material as unknown as Record<string, unknown>).forEach((value: unknown) => { if (value instanceof THREE.Texture) value.dispose(); });
      material.dispose();
    });
  });
}
