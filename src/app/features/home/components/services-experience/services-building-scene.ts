import { Injector } from '@angular/core';
import * as THREE from 'three';
import { ThreeRendererService } from '../../../../core/three/three-renderer.service';
import { ThreeSceneService } from '../../../../core/three/three-scene.service';
import { ThreeCameraService } from '../../../../core/three/three-camera.service';
import { layerPose, SERVICE_LAYERS, serviceBuildingParts } from './services-experience.data';

/** Replaceable architectural study; scheduling and disposal use the site's Three foundation. */
export class ServicesBuildingScene {
  private readonly scenes: ThreeSceneService;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer | null = null;
  private readonly layers = SERVICE_LAYERS.map(name => ({ name, group: new THREE.Group(), line: new THREE.LineBasicMaterial({ color: 0xd4e8e2, transparent: true, opacity: .5 }), surface: new THREE.MeshStandardMaterial({ color: 0x508d87, transparent: true, opacity: .035, depthWrite: false }) }));
  private resize?: ResizeObserver;
  private frame: number | null = null;
  private visible = false;
  private destroyed = false;
  private rendered = false;
  private readonly lost = (event: Event): void => { event.preventDefault(); this.failed(); this.destroy(); };
  private readonly visibility = (): void => { this.invalidate(); };
  constructor(private readonly host: HTMLElement, private readonly injector: Injector, private readonly failed: () => void, private readonly ready: () => void = () => {}) {
    this.scenes = injector.get(ThreeSceneService);
    this.scene = this.scenes.createScene();
    this.camera = injector.get(ThreeCameraService).createPerspective();
  }
  initialize(): boolean {
    try {
      this.renderer = this.injector.get(ThreeRendererService).create(this.host, 1.5);
      if (!this.renderer) { this.destroy(); return false; }
      const canvas = this.renderer.domElement;
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'display:block;width:100%;height:100%';
      canvas.addEventListener('webglcontextlost', this.lost);
      const box = new THREE.BoxGeometry(1, 1, 1), edges = new THREE.EdgesGeometry(box);
      this.layers.forEach(layer => { layer.group.name = layer.name; this.scene.add(layer.group); });
      for (const part of serviceBuildingParts()) {
        const layer = this.layers.find(candidate => candidate.name === part.layer)!;
        const lines = new THREE.LineSegments(edges, layer.line);
        lines.position.set(...part.at); lines.scale.set(...part.size); layer.group.add(lines);
        if (part.layer !== 'site') {
          const mesh = new THREE.Mesh(box, layer.surface);
          mesh.position.set(...part.at); mesh.scale.set(...part.size); layer.group.add(mesh);
        }
      }
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x183c38, 1.5));
      this.camera.fov = 30;
      this.resize = new ResizeObserver(() => {
        if (!this.renderer || !this.host.clientWidth || !this.host.clientHeight) return;
        this.renderer.setSize(this.host.clientWidth, this.host.clientHeight, false);
        this.injector.get(ThreeCameraService).resize(this.camera, this.host.clientWidth / this.host.clientHeight);
        this.invalidate();
      });
      this.resize.observe(this.host);
      document.addEventListener('visibilitychange', this.visibility);
      this.setProgress(0);
      return true;
    } catch { this.destroy(); return false; }
  }
  setProgress(progress: number): void {
    for (const layer of this.layers) {
      const pose = layerPose(layer.name, progress);
      layer.group.position.set(pose.x, pose.y, 0);
      layer.line.opacity = pose.opacity;
      layer.surface.opacity = pose.opacity * .09;
    }
    this.camera.position.set(19 - progress, 14 - progress, 23 - progress);
    this.camera.lookAt(0, 4.6 - progress * 1.4, 0);
    this.invalidate();
  }
  setVisible(visible: boolean): void { this.visible = visible; this.invalidate(); }
  private invalidate(): void {
    if (this.destroyed || !this.visible || document.hidden || this.frame !== null) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = null;
      if (!this.destroyed && this.visible && !document.hidden && this.renderer) {
        try {
          this.renderer.render(this.scene, this.camera);
          if (!this.rendered) { this.rendered = true; this.ready(); }
        } catch { this.failed(); this.destroy(); }
      }
    });
  }
  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.resize?.disconnect();
    document.removeEventListener('visibilitychange', this.visibility);
    this.renderer?.domElement.removeEventListener('webglcontextlost', this.lost);
    if (this.renderer) { this.scenes.dispose(this.scene, this.renderer); this.renderer.forceContextLoss(); }
    else this.layers.forEach(layer => { layer.line.dispose(); layer.surface.dispose(); });
  }
}
