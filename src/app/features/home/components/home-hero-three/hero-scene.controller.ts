import { Injector } from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { AnimationManagerService } from '../../../../core/animations/animation-manager.service';
import { ThreeCameraService } from '../../../../core/three/three-camera.service';
import { ThreeRendererService } from '../../../../core/three/three-renderer.service';
import { ThreeSceneService } from '../../../../core/three/three-scene.service';
import { architecturalParts, STUDY_PALETTE, Surface } from './architectural-study.data';

/** Scene-only controller, loaded on demand. Replace buildStudy for an approved model. */
export class HeroSceneController {
  private readonly scenes: ThreeSceneService;
  private readonly cameras: ThreeCameraService;
  private readonly renderers: ThreeRendererService;
  private readonly animations: AnimationManagerService;
  private scene?: THREE.Scene;
  private renderer?: THREE.WebGLRenderer;
  private camera?: THREE.PerspectiveCamera;
  private sunlight?: THREE.DirectionalLight;
  private drawing?: THREE.Group;
  private environment?: THREE.CanvasTexture;
  private context?: gsap.Context | null;
  private entrance?: gsap.core.Timeline;
  private observer?: ResizeObserver;
  private visibility?: IntersectionObserver;
  private frame: number | null = null;
  private visible = true;
  private destroyed = false;
  private ready = false;
  private pointerX?: ReturnType<typeof gsap.quickTo>;
  private pointerY?: ReturnType<typeof gsap.quickTo>;
  private readonly solidClip = new THREE.Plane(new THREE.Vector3(1, 0, 0), -8);
  private readonly drawingClip = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 8.12);
  private readonly state = { reveal: 0, scroll: 0, x: 0, y: 0, settle: 1 };

  constructor(private readonly container: HTMLElement, injector: Injector, private readonly setReady: (ready: boolean) => void) {
    this.scenes = injector.get(ThreeSceneService);
    this.cameras = injector.get(ThreeCameraService);
    this.renderers = injector.get(ThreeRendererService);
    this.animations = injector.get(AnimationManagerService);
  }

  initialize(animateEntrance = true): void {
    this.renderer = this.renderers.create(this.container, window.innerWidth <= 1024 ? 1 : 1.5) ?? undefined;
    if (!this.renderer) return;
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    Object.assign(this.renderer.domElement.style, { display: 'block', width: '100%', height: '100%' });
    this.renderer.domElement.addEventListener('webglcontextlost', this.contextLost);
    this.renderer.localClippingEnabled = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = window.innerWidth > 1024;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.scene = this.scenes.createScene();
    this.addDaylight();
    this.camera = this.cameras.createPerspective();
    this.camera.fov = 32;
    this.buildStudy();
    this.scene.add(new THREE.HemisphereLight('#e9f2f2', '#c5c4b6', 2.5));
    this.sunlight = new THREE.DirectionalLight('#fff6e6', 3.2);
    this.sunlight.position.set(-5, 13, 10);
    this.sunlight.castShadow = true;
    this.sunlight.shadow.mapSize.set(1024, 1024);
    Object.assign(this.sunlight.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: .5, far: 45 });
    this.sunlight.shadow.normalBias = .025;
    this.scene.add(this.sunlight);
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(this.container);
    this.visibility = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting && !document.hidden;
      this.syncVisibility();
    });
    this.visibility.observe(this.container);
    document.addEventListener('visibilitychange', this.documentVisibility);
    this.context = this.animations.createContext(this.container, () => {
      if (animateEntrance) this.entrance = gsap.timeline({ onUpdate: this.invalidate })
        .to(this.state, { reveal: 1, settle: 0, duration: 1.7, ease: 'power2.out' }, .12);
      else { this.state.reveal = 1; this.state.settle = 0; }
      const hero = this.container.closest('section');
      if (hero) ScrollTrigger.create({
        trigger: hero, start: 'top top', end: 'bottom top',
        onUpdate: trigger => { this.state.scroll = trigger.progress; this.invalidate(); }
      });
      this.pointerX = gsap.quickTo(this.state, 'x', { duration: .8, ease: 'power2.out', onUpdate: this.invalidate });
      this.pointerY = gsap.quickTo(this.state, 'y', { duration: .8, ease: 'power2.out', onUpdate: this.invalidate });
    });
    this.container.addEventListener('pointermove', this.pointerMove);
    this.container.addEventListener('pointerleave', this.pointerLeave);
    this.resize();
    this.animations.refresh();
  }

  private buildStudy(): void {
    const unit = new THREE.BoxGeometry(1, 1, 1);
    const edges = new THREE.EdgesGeometry(unit);
    const materials = {} as Record<Surface, THREE.MeshStandardMaterial>;
    for (const surface of Object.keys(STUDY_PALETTE) as Surface[]) {
      materials[surface] = new THREE.MeshStandardMaterial({
        color: STUDY_PALETTE[surface], roughness: surface === 'glass' ? .24 : .78,
        metalness: surface === 'glass' ? .35 : surface === 'steel' ? .5 : .05,
        clippingPlanes: surface === 'paving' || surface === 'plant' ? [] : [this.solidClip], clipShadows: true
      });
    }
    const ink = new THREE.LineBasicMaterial({ color: '#427b80', transparent: true, opacity: .32, clippingPlanes: [this.drawingClip] });
    const outline = new THREE.LineBasicMaterial({ color: '#385b5f', transparent: true, opacity: .12, clippingPlanes: [this.solidClip] });
    this.drawing = new THREE.Group();
    this.drawing.name = 'concept-drawing';
    for (const part of architecturalParts()) {
      const mesh = new THREE.Mesh(unit, materials[part.surface]);
      mesh.scale.set(...part.size); mesh.position.set(...part.at);
      mesh.castShadow = part.surface !== 'glass'; mesh.receiveShadow = true;
      this.scene!.add(mesh);
      if (part.technical) {
        const line = new THREE.LineSegments(edges, ink);
        line.scale.set(...part.size); line.position.set(...part.at);
        this.drawing.add(line);
        // Keep restrained construction edges even on the finished side.
        if (part.surface === 'concrete') {
          const edge = new THREE.LineSegments(edges, outline);
          edge.scale.set(...part.size); edge.position.set(...part.at); this.scene!.add(edge);
        }
      }
    }
    this.scene!.add(this.drawing);
  }

  private addDaylight(): void {
    const sky = document.createElement('canvas'); sky.width = 512; sky.height = 256;
    const paint = sky.getContext('2d');
    if (!paint) return;
    const daylight = paint.createLinearGradient(0, 0, 0, 256);
    daylight.addColorStop(0, '#97b9cc'); daylight.addColorStop(.48, '#eff3ed');
    daylight.addColorStop(.53, '#a5b3a6'); daylight.addColorStop(1, '#d8d8ca');
    paint.fillStyle = daylight; paint.fillRect(0, 0, 512, 256);
    this.environment = new THREE.CanvasTexture(sky);
    this.environment.mapping = THREE.EquirectangularReflectionMapping;
    this.environment.colorSpace = THREE.SRGBColorSpace;
    this.scene!.environment = this.environment;
  }

  private readonly pointerMove = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth <= 1024) return;
    const rect = this.container.getBoundingClientRect();
    this.pointerX?.(((event.clientX - rect.left) / rect.width - .5) * 2);
    this.pointerY?.(((event.clientY - rect.top) / rect.height - .5) * 2);
  };
  private readonly pointerLeave = (): void => { this.pointerX?.(0); this.pointerY?.(0); };
  private readonly documentVisibility = (): void => {
    const rect = this.container.getBoundingClientRect();
    this.visible = !document.hidden && rect.bottom > 0 && rect.top < window.innerHeight;
    this.syncVisibility();
  };
  private syncVisibility(): void {
    if (this.visible) { if (this.entrance && this.entrance.progress() < 1) this.entrance.resume(); this.invalidate(); }
    else { this.entrance?.pause(); if (this.frame !== null) cancelAnimationFrame(this.frame); this.frame = null; }
  }
  private readonly contextLost = (event: Event): void => { event.preventDefault(); this.setReady(false); this.destroy(); };
  private readonly invalidate = (): void => {
    if (this.destroyed || !this.visible || this.frame !== null) return;
    this.frame = requestAnimationFrame(() => { this.frame = null; this.render(); });
  };
  private resize(): void {
    if (!this.renderer || !this.camera) return;
    const { width, height } = this.container.getBoundingClientRect();
    if (!width || !height) return;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth <= 1024 ? 1 : 1.5));
    this.renderer.setSize(width, height, false);
    this.renderer.shadowMap.enabled = window.innerWidth > 1024;
    this.cameras.resize(this.camera, width / height);
    this.invalidate();
  }
  private render(): void {
    if (!this.renderer || !this.camera || !this.scene || this.destroyed) return;
    const scroll = this.state.scroll;
    // A portion always remains a drawing, even after forward/reverse scrolling.
    const boundary = 8 - Math.max(this.state.reveal, scroll) * 10.6 - scroll * .65;
    this.solidClip.constant = -boundary;
    this.drawingClip.constant = boundary + .12;
    if (this.drawing) this.drawing.position.x = .18 * (1 - scroll);
    const distance = 1.12 * Math.max(1, 1.1 / this.camera.aspect);
    const depth = window.innerWidth > 1024 ? scroll * .4 : 0;
    this.camera.position.set((14 + this.state.x * .35) * distance, (8 + this.state.y * .18 + this.state.settle * .6) * distance, (19 + this.state.settle * .8 - depth) * distance);
    this.camera.lookAt(0, 2.7, .2);
    this.renderer.shadowMap.needsUpdate = true;
    try {
      this.renderer.render(this.scene, this.camera);
      if (!this.ready) { this.ready = true; this.setReady(true); }
    } catch { this.setReady(false); this.destroy(); }
  }
  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
    this.context?.revert();
    this.pointerX?.tween.kill(); this.pointerY?.tween.kill();
    this.observer?.disconnect(); this.visibility?.disconnect();
    document.removeEventListener('visibilitychange', this.documentVisibility);
    this.container.removeEventListener('pointermove', this.pointerMove);
    this.container.removeEventListener('pointerleave', this.pointerLeave);
    this.renderer?.domElement.removeEventListener('webglcontextlost', this.contextLost);
    this.sunlight?.shadow.dispose();
    this.environment?.dispose();
    if (this.renderer) {
      if (this.scene) this.scenes.dispose(this.scene, this.renderer);
      else { this.renderer.dispose(); this.renderer.domElement.remove(); }
      this.renderer.forceContextLoss();
    }
  }
}
