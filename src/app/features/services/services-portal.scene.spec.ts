import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as THREE from 'three';
import { ServicesPortalScene } from './services-portal.scene';
import { ThreeRendererService } from '../../core/three/three-renderer.service';
describe('Services portal scene',()=>{
  const tick=()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
  it('draws the real portal model and disposes its canvas',async()=>{
    TestBed.configureTestingModule({});const host=document.createElement('div');host.style.cssText='width:700px;height:600px';document.body.append(host);
    let done!:()=>void;const rendered=new Promise<void>(resolve=>done=resolve);let pixels=0;
    const scene=new ServicesPortalScene(host,TestBed.inject(Injector),ready=>{
      if(ready){const copy=document.createElement('canvas');copy.width=70;copy.height=60;const ctx=copy.getContext('2d')!;ctx.drawImage(host.querySelector('canvas')!,0,0,70,60);const data=ctx.getImageData(0,0,70,60).data;for(let i=3;i<data.length;i+=4)if(data[i]>0)pixels++;}done();
    });
    try{expect(scene.initialize()).toBeTrue();scene.setVisible(true);await rendered;expect(pixels).toBeGreaterThan(600);scene.setProgress(1);await tick();}
    finally{scene.destroy();expect(host.querySelector('canvas')).toBeNull();host.remove();}
  },15000);
  it('renders only on demand, pauses offscreen and cleans up after context loss',async()=>{
    const host=document.createElement('div');host.style.cssText='width:700px;height:600px';document.body.append(host);const canvas=document.createElement('canvas');host.append(canvas);
    const renderer={domElement:canvas,setSize:jasmine.createSpy(),render:jasmine.createSpy(),dispose:jasmine.createSpy(),forceContextLoss:jasmine.createSpy()} as unknown as THREE.WebGLRenderer;
    TestBed.configureTestingModule({providers:[{provide:ThreeRendererService,useValue:{create:()=>renderer}}]});const ready=jasmine.createSpy();const scene=new ServicesPortalScene(host,TestBed.inject(Injector),ready);
    try{scene.initialize();scene.setVisible(true);await tick();await tick();const count=(renderer.render as jasmine.Spy).calls.count();await tick();expect((renderer.render as jasmine.Spy).calls.count()).toBe(count);
      scene.setVisible(false);scene.setProgress(.5);await tick();expect((renderer.render as jasmine.Spy).calls.count()).toBe(count);
      canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));expect(ready).toHaveBeenCalledWith(false);scene.destroy();expect(renderer.dispose).toHaveBeenCalledTimes(1);
    }finally{scene.destroy();host.remove();}
  });
});
