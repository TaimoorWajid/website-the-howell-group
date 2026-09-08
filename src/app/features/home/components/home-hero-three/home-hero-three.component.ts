import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import * as THREE from 'three';
import { APP_CONFIG } from '../../../../core/config/app-config';
import { disposeObject } from '../../../../core/three/three-dispose.util';

@Component({ selector: 'app-home-hero-three', templateUrl: './home-hero-three.component.html', styleUrl: './home-hero-three.component.scss' })
export class HomeHeroThreeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) private readonly canvas!: ElementRef<HTMLCanvasElement>;
  private readonly platformId = inject(PLATFORM_ID);
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private structure: THREE.Group | null = null;
  private frameId: number | null = null;
  private lastFrame = 0;
  private resizeObserver: ResizeObserver | null = null;
  private visibilityObserver: IntersectionObserver | null = null;
  private visible = true;
  private reducedMotion = false;

  ngAfterViewInit(): void { if (!isPlatformBrowser(this.platformId)) return; this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; this.initialize(); }

  private initialize(): void {
    const container = this.canvas.nativeElement.parentElement;
    if (!container) return;
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement, antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / Math.max(container.clientHeight, 1), .1, 1000);
      this.camera.position.set(0, .2, 8);
      this.structure = this.createStructure();
      this.scene.add(this.structure);
      this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(container);
      this.visibilityObserver = new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; if (this.visible && !this.reducedMotion) this.startLoop(); }); this.visibilityObserver.observe(container);
      this.resize(); this.render(); if (!this.reducedMotion) this.startLoop();
    } catch { this.renderer?.dispose(); this.renderer = null; }
  }

  private createStructure(): THREE.Group {
    const group = new THREE.Group();
    const material = new THREE.LineBasicMaterial({ color: APP_CONFIG.visualColors.teal, transparent: true, opacity: .72 });
    const redMaterial = new THREE.LineBasicMaterial({ color: APP_CONFIG.visualColors.red, transparent: true, opacity: .9 });
    [{ width: 2.3, height: 3.7, depth: 1.1, x: -1.3, y: 0 }, { width: 1.55, height: 5.2, depth: 1.1, x: .25, y: .65 }, { width: 2.1, height: 2.7, depth: 1.1, x: 1.75, y: -.45 }].forEach((building, index) => {
      const geometry = new THREE.BoxGeometry(building.width, building.height, building.depth); const edges = new THREE.EdgesGeometry(geometry); geometry.dispose();
      const lines = new THREE.LineSegments(edges, index === 1 ? redMaterial : material); lines.position.set(building.x, building.y, 0); group.add(lines);
    });
    return group;
  }

  private startLoop(): void { if (this.frameId === null) this.frameId = requestAnimationFrame(time => this.animate(time)); }
  private animate(time: number): void { this.frameId = null; if (!this.visible || !this.structure) return; if (time - this.lastFrame < 33) { this.startLoop(); return; } this.lastFrame = time; this.structure.rotation.y = Math.sin(time * .00012) * .16; this.structure.rotation.x = Math.sin(time * .00008) * .035; this.render(); this.startLoop(); }
  private render(): void { if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera); }
  private resize(): void { const container = this.canvas.nativeElement.parentElement; if (!container || !this.renderer || !this.camera) return; this.renderer.setSize(container.clientWidth, container.clientHeight, false); this.camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1); this.camera.updateProjectionMatrix(); this.render(); }

  ngOnDestroy(): void { if (this.frameId !== null) cancelAnimationFrame(this.frameId); this.resizeObserver?.disconnect(); this.visibilityObserver?.disconnect(); if (this.structure) disposeObject(this.structure); this.renderer?.dispose(); this.frameId = null; this.structure = null; this.scene = null; this.camera = null; this.renderer = null; }
}
