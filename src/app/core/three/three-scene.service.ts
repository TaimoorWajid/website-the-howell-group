import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { disposeObject } from './three-dispose.util';

@Injectable({ providedIn: 'root' })
export class ThreeSceneService {
  createScene(): THREE.Scene { return new THREE.Scene(); }
  dispose(scene: THREE.Scene, renderer: THREE.WebGLRenderer): void { disposeObject(scene); renderer.dispose(); renderer.domElement.remove(); }
}
