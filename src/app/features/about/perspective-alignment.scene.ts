import { Injector } from '@angular/core';
import * as THREE from 'three';
import { ThreeRendererService } from '../../core/three/three-renderer.service';
import { ThreeCameraService } from '../../core/three/three-camera.service';
import { ThreeSceneService } from '../../core/three/three-scene.service';

/** Symbolic facade study: three viewpoints converge in depth, not an exploded building. */
export class PerspectiveAlignmentScene {
  private readonly scenes: ThreeSceneService;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly planes: THREE.Group[] = [];
  private renderer: THREE.WebGLRenderer | null = null;
  private resize?: ResizeObserver;
  private frame: number | null = null;
  private visible = false;
  private destroyed = false;
  private firstFrame = true;
  private readonly visibilityChanged = (): void => this.invalidate();
  private readonly contextLost = (event: Event): void => { event.preventDefault(); this.ready(false); this.destroy(); };

  constructor(private readonly host: HTMLElement, private readonly injector: Injector, private readonly ready: (success: boolean) => void) {
    this.scenes = injector.get(ThreeSceneService);
    this.scene = this.scenes.createScene();
    this.camera = injector.get(ThreeCameraService).createPerspective();
  }

  initialize(): boolean {
    try {
      this.renderer = this.injector.get(ThreeRendererService).create(this.host, 1.5);
      if (!this.renderer) return false;
      const canvas = this.renderer.domElement;
      canvas.style.cssText = 'display:block;width:100%;height:100%';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.addEventListener('webglcontextlost', this.contextLost);
      const box = new THREE.BoxGeometry(1, 1, 1);
      const edges = new THREE.EdgesGeometry(box);
      const frame = new THREE.MeshStandardMaterial({ color: 0xb1beb6, roughness: .85 });
      const glass = new THREE.MeshStandardMaterial({ color: 0x6b9c9b, transparent: true, opacity: .24, roughness: .25, depthWrite: false });
      const ink = new THREE.MeshStandardMaterial({ color: 0x143c38, roughness: .65 });
      const line = new THREE.LineBasicMaterial({ color: 0xc6ded7, transparent: true, opacity: .65 });
      const addBox = (group: THREE.Group, size: [number, number, number], at: [number, number, number], material: THREE.Material): void => {
        const mesh = new THREE.Mesh(box, material); mesh.scale.set(...size); mesh.position.set(...at); group.add(mesh);
      };
      const base = new THREE.Group(); this.scene.add(base);
      addBox(base, [12, .16, 7], [0, -.25, 0], ink);
      addBox(base, [9.4, .16, 3], [0, 0, 0], frame);
      addBox(base, [9.4, .16, 3], [0, 4.6, 0], frame);
      addBox(base, [9.4, .1, 3], [0, 2.3, 0], frame);
      for (let i = 0; i < 3; i++) {
        const group = new THREE.Group(); group.name = `perspective-${i}`; this.planes.push(group); this.scene.add(group);
        addBox(group, [3, 4.5, .045], [0, 2.3, 1.5], glass);
        const outline = new THREE.LineSegments(edges, line); outline.scale.set(3, 4.5, .045); outline.position.set(0, 2.3, 1.5); group.add(outline);
        for (const x of [-1.5, 0, 1.5]) addBox(group, [.045, 4.5, .09], [x, 2.3, 1.5], frame);
        for (const y of [0, 2.3, 4.6]) addBox(group, [3.05, .06, .09], [0, y, 1.5], frame);
        addBox(group, [.14, 4.6, .14], [-1.5, 2.3, -1.4], frame);
        addBox(group, [3.05, .14, 3], [0, 4.6, 0], frame);
      }
      this.scene.add(new THREE.HemisphereLight(0xf7f6ec, 0x153b35, 2));
      const sun = new THREE.DirectionalLight(0xe5efe2, 2.5); sun.position.set(-8, 12, 7); this.scene.add(sun);
      this.camera.fov = 34;
      const resize = (): void => {
        if (!this.renderer || !this.host.clientWidth || !this.host.clientHeight) return;
        this.renderer.setSize(this.host.clientWidth, this.host.clientHeight, false);
        this.injector.get(ThreeCameraService).resize(this.camera, this.host.clientWidth / this.host.clientHeight);
        this.invalidate();
      };
      this.resize = new ResizeObserver(resize); this.resize.observe(this.host); resize();
      document.addEventListener('visibilitychange', this.visibilityChanged);
      this.setProgress(0);
      return true;
    } catch { this.ready(false); this.destroy(); return false; }
  }

  setProgress(progress: number): void {
    const p = Math.min(1, Math.max(0, progress / .8));
    const alignment = p * p * (3 - 2 * p);
    this.planes.forEach((plane, index) => {
      plane.position.set((index - 1) * (3 + (1 - alignment) * .6), 0, (index - 1) * (1 - alignment) * 3.2);
      plane.rotation.y = (index - 1) * (1 - alignment) * .18;
    });
    this.camera.position.set(11 - alignment * 4, 6.5 - alignment, 20);
    this.camera.lookAt(0, 2, 0); this.invalidate();
  }

  setVisible(visible: boolean): void { this.visible = visible; this.invalidate(); }
  private invalidate(): void {
    if (this.destroyed || !this.visible || document.hidden || this.frame !== null) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = null;
      if (!this.renderer || this.destroyed || !this.visible || document.hidden) return;
      try {
        this.renderer.render(this.scene, this.camera);
        if (this.firstFrame) { this.firstFrame = false; this.ready(true); }
      } catch { this.ready(false); this.destroy(); }
    });
  }
  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.resize?.disconnect(); document.removeEventListener('visibilitychange', this.visibilityChanged);
    this.renderer?.domElement.removeEventListener('webglcontextlost', this.contextLost);
    if (this.renderer) { this.scenes.dispose(this.scene, this.renderer); this.renderer.forceContextLoss(); }
  }
}
