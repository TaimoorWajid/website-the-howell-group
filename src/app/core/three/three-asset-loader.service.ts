import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({ providedIn: 'root' })
export class ThreeAssetLoaderService {
  private readonly textureLoader = new THREE.TextureLoader();
  loadTexture(url: string): Promise<THREE.Texture> { return this.textureLoader.loadAsync(url); }
}
