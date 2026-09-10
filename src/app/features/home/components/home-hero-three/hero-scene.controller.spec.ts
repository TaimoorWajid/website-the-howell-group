import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as THREE from 'three';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { HeroSceneController } from './hero-scene.controller';
import { ThreeRendererService } from '../../../../core/three/three-renderer.service';
import { disposeObject } from '../../../../core/three/three-dispose.util';
import { architecturalParts } from './architectural-study.data';

describe('Architectural hero scene lifecycle', () => {
  let container: HTMLElement;
  let section: HTMLElement;
  let controller: HeroSceneController;
  let renderer: THREE.WebGLRenderer;
  let ready: jasmine.Spy;
  const frame = (): Promise<void> => new Promise(resolve => requestAnimationFrame(() => resolve()));
  beforeEach(() => {
    section = document.createElement('section'); section.style.height = '700px';
    container = document.createElement('div'); container.style.cssText = 'width:800px;height:650px'; section.appendChild(container); document.body.appendChild(section);
    const canvas = document.createElement('canvas'); container.appendChild(canvas);
    renderer = { domElement: canvas, shadowMap: {}, setPixelRatio: jasmine.createSpy(), setSize: jasmine.createSpy(), render: jasmine.createSpy(), dispose: jasmine.createSpy(), forceContextLoss: jasmine.createSpy() } as unknown as THREE.WebGLRenderer;
    TestBed.configureTestingModule({ providers: [{ provide: ThreeRendererService, useValue: { create: () => renderer } }] });
    ready = jasmine.createSpy(); controller = new HeroSceneController(container, TestBed.inject(Injector), ready);
  });
  afterEach(() => { controller.destroy(); section.remove(); });

  it('builds a bounded architectural study with a persistent clipped drawing and no pin', async () => {
    controller.initialize(); await frame();
    const [scene] = (renderer.render as jasmine.Spy).calls.mostRecent().args as [THREE.Scene];
    expect(architecturalParts().length).toBeLessThan(300);
    expect(scene.children.some(child => child.name === 'concept-drawing')).toBeTrue();
    const clip = (scene.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh).material as THREE.Material;
    expect(clip).toBeTruthy();
    const trigger = ScrollTrigger.getAll().find(trigger => trigger.trigger === section)!;
    expect(trigger).toBeDefined(); expect(trigger.vars.pin).toBeUndefined();
    expect(ready).toHaveBeenCalledWith(true);
  });

  it('stops requesting frames once the entrance is settled and releases its trigger and canvas', async () => {
    controller.initialize();
    await new Promise(resolve => setTimeout(resolve, 2050));
    const count = (renderer.render as jasmine.Spy).calls.count();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect((renderer.render as jasmine.Spy).calls.count()).toBe(count);
    controller.destroy();
    expect(ScrollTrigger.getAll().some(trigger => trigger.trigger === section)).toBeFalse();
    expect(container.querySelector('canvas')).toBeNull();
    expect(renderer.dispose).toHaveBeenCalledTimes(1);
    expect(renderer.forceContextLoss).toHaveBeenCalledTimes(1);
    await frame(); expect((renderer.render as jasmine.Spy).calls.count()).toBe(count);
  });

  it('falls back and disposes the scene if a WebGL context is lost', async () => {
    controller.initialize(); await frame();
    renderer.domElement.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
    expect(ready).toHaveBeenCalledWith(false);
    expect(renderer.dispose).toHaveBeenCalledTimes(1);
    expect(ScrollTrigger.getAll().some(trigger => trigger.trigger === section)).toBeFalse();
  });

  it('responds subtly to a mouse but not touch, and reverses the scroll reveal without pinning', async () => {
    const spacer = document.createElement('div'); spacer.style.height = '1500px'; document.body.appendChild(spacer);
    try {
      controller.initialize(false); await frame();
      const [scene, camera] = (renderer.render as jasmine.Spy).calls.mostRecent().args as [THREE.Scene, THREE.PerspectiveCamera];
      const startX = camera.position.x;
      const bounds = container.getBoundingClientRect();
      container.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'touch', clientX: bounds.right, clientY: bounds.top }));
      await frame(); expect(camera.position.x).toBe(startX);
      container.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: bounds.right, clientY: bounds.top + bounds.height / 2 }));
      await new Promise(resolve => setTimeout(resolve, 900));
      expect(camera.position.x).toBeGreaterThan(startX);
      expect(camera.position.x - startX).toBeLessThan(.6);
      const material = scene.children.filter(child => child instanceof THREE.Mesh).map(child => (child as THREE.Mesh).material as THREE.Material).find(material => material.clippingPlanes?.length)!;
      const initial = material.clippingPlanes![0].constant;
      window.scrollTo(0, 300); ScrollTrigger.update(); await frame(); await frame();
      expect(material.clippingPlanes![0].constant).toBeGreaterThan(initial);
      window.scrollTo(0, 0); ScrollTrigger.update(); await frame(); await frame();
      expect(material.clippingPlanes![0].constant).toBeCloseTo(initial, 2);
    } finally { window.scrollTo(0, 0); spacer.remove(); }
  });

  it('disposes shared geometry and materials only once', () => {
    const geometry = new THREE.BoxGeometry(); const material = new THREE.MeshStandardMaterial();
    spyOn(geometry, 'dispose'); spyOn(material, 'dispose');
    const group = new THREE.Group(); group.add(new THREE.Mesh(geometry, material), new THREE.Mesh(geometry, material));
    disposeObject(group);
    expect(geometry.dispose).toHaveBeenCalledTimes(1); expect(material.dispose).toHaveBeenCalledTimes(1);
  });
});
