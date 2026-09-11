import { Injector } from '@angular/core';
import * as THREE from 'three';
import { ThreeRendererService } from '../../core/three/three-renderer.service';
import { ThreeSceneService } from '../../core/three/three-scene.service';
import { ThreeCameraService } from '../../core/three/three-camera.service';
import { portalParts } from './services-portal.data';

export class ServicesPortalScene {
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly scenes: ThreeSceneService;
  private renderer: THREE.WebGLRenderer | null = null;
  private resize?: ResizeObserver;
  private frame: number | null = null;
  private visible = false;
  private destroyed = false;
  private ready = false;
  private readonly visibilityChanged = (): void => this.invalidate();
  private readonly contextLost = (event: Event): void => { event.preventDefault(); this.onReady(false); this.destroy(); };
  constructor(private readonly host: HTMLElement, private readonly injector: Injector, private readonly onReady: (ready: boolean) => void) {
    this.scenes = injector.get(ThreeSceneService); this.scene = this.scenes.createScene();
    this.camera = injector.get(ThreeCameraService).createPerspective();
  }
  initialize(): boolean {
    try {
      this.renderer = this.injector.get(ThreeRendererService).create(this.host,1.5);
      if (!this.renderer) return false;
      this.renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
      this.renderer.domElement.setAttribute('aria-hidden','true');
      this.renderer.domElement.addEventListener('webglcontextlost',this.contextLost);
      const geometry = new THREE.BoxGeometry(1,1,1);
      const materials = new Map<number,THREE.Material>();
      for (const part of portalParts()) {
        if (!materials.has(part.color)) materials.set(part.color,new THREE.MeshStandardMaterial({color:part.color,roughness:.95,metalness:0}));
        const mesh = new THREE.Mesh(geometry,materials.get(part.color)!); mesh.position.set(...part.at); mesh.scale.set(...part.size); this.scene.add(mesh);
      }
      this.scene.add(new THREE.HemisphereLight(0xf6f4e9,0x193c38,2));
      const light = new THREE.DirectionalLight(0xfff5df,3); light.position.set(-8,14,6); this.scene.add(light);
      this.camera.fov = 43;
      const resize = (): void => {
        if (!this.renderer || !this.host.clientWidth || !this.host.clientHeight) return;
        this.renderer.setSize(this.host.clientWidth,this.host.clientHeight,false);
        this.injector.get(ThreeCameraService).resize(this.camera,this.host.clientWidth/this.host.clientHeight); this.invalidate();
      };
      this.resize = new ResizeObserver(resize); this.resize.observe(this.host); resize();
      document.addEventListener('visibilitychange',this.visibilityChanged);
      this.setProgress(0); return true;
    } catch { this.onReady(false); this.destroy(); return false; }
  }
  setProgress(progress: number): void { this.camera.position.set(8-progress*.6,5.5,13-progress*2); this.camera.lookAt(0,3,-8); this.invalidate(); }
  setVisible(visible: boolean): void { this.visible = visible; this.invalidate(); }
  private invalidate(): void {
    if (this.destroyed || !this.visible || document.hidden || this.frame !== null) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = null;
      if (!this.renderer || this.destroyed || !this.visible || document.hidden) return;
      try { this.renderer.render(this.scene,this.camera); if (!this.ready) { this.ready = true; this.onReady(true); } }
      catch { this.onReady(false); this.destroy(); }
    });
  }
  destroy(): void {
    if (this.destroyed) return; this.destroyed = true;
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.resize?.disconnect(); document.removeEventListener('visibilitychange',this.visibilityChanged);
    this.renderer?.domElement.removeEventListener('webglcontextlost',this.contextLost);
    if (this.renderer) { this.scenes.dispose(this.scene,this.renderer); this.renderer.forceContextLoss(); }
  }
}
