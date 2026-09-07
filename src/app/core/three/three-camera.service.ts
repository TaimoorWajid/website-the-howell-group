import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({ providedIn: 'root' })
export class ThreeCameraService {
  createPerspective(aspect = 1): THREE.PerspectiveCamera { const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000); camera.position.set(0, 0, 5); return camera; }
  resize(camera: THREE.PerspectiveCamera, aspect: number): void { camera.aspect = aspect; camera.updateProjectionMatrix(); }
}
