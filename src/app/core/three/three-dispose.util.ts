import * as THREE from 'three';

export function disposeObject(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      Object.values(material as unknown as Record<string, unknown>).forEach((value: unknown) => { if (value instanceof THREE.Texture) value.dispose(); });
      material.dispose();
    });
  });
}
