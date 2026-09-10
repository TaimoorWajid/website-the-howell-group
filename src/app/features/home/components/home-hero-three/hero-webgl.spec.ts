import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HeroSceneController } from './hero-scene.controller';

describe('Architectural study WebGL smoke', () => {
  it('draws nonempty pixels with the real renderer and disposes its canvas', async () => {
    TestBed.configureTestingModule({});
    const section = document.createElement('section');
    const container = document.createElement('div');
    container.style.cssText = 'width:800px;height:650px'; section.appendChild(container); document.body.appendChild(section);
    let controller: HeroSceneController | undefined;
    try {
      let rendered!: () => void;
      const ready = new Promise<void>(resolve => { rendered = resolve; });
      let pixels = 0;
      controller = new HeroSceneController(container, TestBed.inject(Injector), success => {
        if (!success) return;
        const canvas = container.querySelector('canvas')!;
        const copy = document.createElement('canvas'); copy.width = 80; copy.height = 65;
        const context = copy.getContext('2d')!;
        context.drawImage(canvas, 0, 0, 80, 65);
        const data = context.getImageData(0, 0, 80, 65).data;
        for (let i = 3; i < data.length; i += 4) if (data[i] > 0) pixels++;
        rendered();
      });
      controller.initialize(false);
      await ready;
      expect(pixels).toBeGreaterThan(500);
      expect(container.querySelector('canvas')!.style.width).toBe('100%');
      controller.destroy();
      expect(container.querySelector('canvas')).toBeNull();
    } finally { controller?.destroy(); section.remove(); }
  }, 15000);
});
