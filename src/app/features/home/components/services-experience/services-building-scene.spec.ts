import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as THREE from 'three';
import { ThreeRendererService } from '../../../../core/three/three-renderer.service';
import { ServicesBuildingScene } from './services-building-scene';

describe('Services building lifecycle', () => {
  const tick = () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  it('renders on demand, pauses offscreen and releases shared resources exactly once', async () => {
    const host = document.createElement('div'); host.style.cssText = 'width:500px;height:650px'; document.body.append(host);
    const canvas = document.createElement('canvas'); host.append(canvas);
    const renderer = { domElement: canvas, setSize: jasmine.createSpy(), render: jasmine.createSpy(), dispose: jasmine.createSpy(), forceContextLoss: jasmine.createSpy() } as unknown as THREE.WebGLRenderer;
    TestBed.configureTestingModule({ providers: [{ provide: ThreeRendererService, useValue: { create: () => renderer } }] });
    const failed = jasmine.createSpy(); const ready = jasmine.createSpy();
    const scene = new ServicesBuildingScene(host, TestBed.inject(Injector), failed, ready);
    try {
      expect(scene.initialize()).toBeTrue(); scene.setVisible(true); await tick(); await tick();
      expect(ready).toHaveBeenCalledTimes(1);
      const count = (renderer.render as jasmine.Spy).calls.count(); await tick();
      expect((renderer.render as jasmine.Spy).calls.count()).toBe(count);
      scene.setVisible(false); scene.setProgress(.75); await tick();
      expect((renderer.render as jasmine.Spy).calls.count()).toBe(count);
      scene.setVisible(true); await tick();
      const rendered = (renderer.render as jasmine.Spy).calls.mostRecent().args[0] as THREE.Scene;
      expect(rendered.children.filter(child => child instanceof THREE.Group).length).toBe(6);
      rendered.children.filter(child => child instanceof THREE.Group).forEach(group => expect(group.position.y).toBe(0));
      canvas.dispatchEvent(new Event('webglcontextlost', {cancelable:true}));
      expect(failed).toHaveBeenCalledTimes(1); scene.destroy();
      expect(renderer.dispose).toHaveBeenCalledTimes(1); expect(host.querySelector('canvas')).toBeNull();
    } finally { scene.destroy(); host.remove(); }
  });
  it('draws real architectural pixels with WebGL and removes the canvas', async () => {
    TestBed.configureTestingModule({});
    const host = document.createElement('div'); host.style.cssText = 'width:500px;height:650px'; document.body.append(host);
    let pixels = 0;
    let done!: () => void;
    const drawn = new Promise<void>(resolve => done = resolve);
    const scene = new ServicesBuildingScene(host, TestBed.inject(Injector), done, () => {
      const copy = document.createElement('canvas'); copy.width = 100; copy.height = 130;
      const context = copy.getContext('2d')!; context.drawImage(host.querySelector('canvas')!, 0, 0, 100, 130);
      const data = context.getImageData(0,0,100,130).data;
      for (let i=3; i<data.length; i+=4) if (data[i]>0) pixels++;
      done();
    });
    try { expect(scene.initialize()).toBeTrue(); scene.setVisible(true); await drawn; expect(pixels).toBeGreaterThan(300); }
    finally { scene.destroy(); expect(host.querySelector('canvas')).toBeNull(); host.remove(); }
  }, 15000);
});
