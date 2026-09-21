import { Injector } from '@angular/core';
import * as THREE from 'three';
import { ThreeRendererService } from '../../core/three/three-renderer.service';
import { ThreeSceneService } from '../../core/three/three-scene.service';

export type MarketStudyMode = 'massing' | 'layers';
/** Reusable box geometry for abstract studies, never a model of a client building. */
export class MarketsMassingScene {
  private readonly scenes: ThreeSceneService;
  private readonly scene: THREE.Scene;
  private readonly camera = new THREE.OrthographicCamera(-7, 7, 5, -5, .1, 100);
  private readonly group = new THREE.Group();
  private readonly layers: { group: THREE.Group; materials: THREE.MeshPhysicalMaterial[] }[] = [];
  private renderer?: THREE.WebGLRenderer;
  private resize?: ResizeObserver;
  private frame = 0;
  private destroyed = false;
  private targetX = 0;
  private targetY = 0;
  private activeLayer = 0;
  private readonly contextLost = (event: Event): void => { event.preventDefault(); this.ready(false); this.destroy(); };
  private readonly visibilityChanged = (): void => { if (!document.hidden) this.invalidate(); };

  constructor(private readonly host: HTMLElement, private readonly injector: Injector, private readonly ready: (success: boolean) => void, private readonly mode: MarketStudyMode = 'massing') {
    this.scenes = injector.get(ThreeSceneService); this.scene = this.scenes.createScene();
  }
  private box(parent: THREE.Group, size: [number, number, number], position: [number, number, number], color: number, opacity: number): THREE.MeshPhysicalMaterial {
    const geometry = new THREE.BoxGeometry(...size);
    const material = new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity, roughness: .3, metalness: .08, depthWrite: false });
    const mesh = new THREE.Mesh(geometry, material); mesh.position.set(...position);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: this.mode === 'layers' ? 0xb5e0dc : 0x527d80, transparent: true, opacity: this.mode === 'layers' ? .5 : .3 })));
    parent.add(mesh); return material;
  }
  initialize(): boolean {
    try {
      this.renderer = this.injector.get(ThreeRendererService).create(this.host, 1.5) ?? undefined;
      if (!this.renderer) return false;
      this.renderer.setClearColor(0x000000, 0);
      Object.assign(this.renderer.domElement.style, { display: 'block', width: '100%', height: '100%' });
      this.renderer.domElement.setAttribute('aria-hidden', 'true');
      this.renderer.domElement.addEventListener('webglcontextlost', this.contextLost);
      this.scene.add(this.group);
      if (this.mode === 'massing') {
        const forms = [[-3.4,-1.5,1.2,2.4,1.2],[-1.9,-1.8,1.2,4.7,1],[-.4,-1.5,1.2,6.7,1.3],[1.1,-1.7,1,3.8,1.2],[2.5,-1.5,1.1,5.4,1.1],[3.7,-.6,.8,2.9,1],[-3,.4,1.2,1.7,1.2],[-1.5,.2,1,3.2,1],[0,.3,1.3,4.1,1.3],[1.6,.5,1.2,2.2,1.1],[3,1,1.1,1.4,1.1],[-.7,1.8,2.5,.5,1.2]];
        forms.forEach(([x,z,width,height,depth], i) => this.box(this.group,[width,height,depth],[x,height/2,z],i%4===0?0x357f88:0xaec6c8,i % 4 === 0 ? .27 : .17));
        const grid = new THREE.GridHelper(14,14,0x789b9d,0xa5bcbd);
        (grid.material as THREE.Material).transparent=true; (grid.material as THREE.Material).opacity=.25; this.group.add(grid);
      } else {
        for (let i=0;i<3;i++) {
          const layer = new THREE.Group(); layer.position.y=i*1.9;
          const materials = [this.box(layer,[6.8,.12,4.2],[0,0,0],0x80bdb8,.22)];
          materials.push(this.box(layer,[6.8,.8,4.2],[0,.4,0],0xa7d5d2,.1));
          for(let j=0;j<4;j++) {
            materials.push(this.box(layer,[1.05,.5,1.35],[-2.5+j*1.65,.31,-.9],0xc1ddd8,.25));
            if(j!==i) materials.push(this.box(layer,[.95,.38,.9],[-2.5+j*1.65,.25,1.05],0x75afa9,.22));
          }
          this.layers.push({group:layer,materials}); this.group.add(layer);
        }
      }
      this.scene.add(new THREE.HemisphereLight(0xffffff,0x597c7b,2.5));
      const light = new THREE.DirectionalLight(0xffffff,2); light.position.set(-4,10,7); this.scene.add(light);
      this.camera.position.set(10,7,12); this.camera.lookAt(0,2.5,0);
      this.resize=new ResizeObserver(()=>this.resizeScene()); this.resize.observe(this.host);
      document.addEventListener('visibilitychange',this.visibilityChanged); this.resizeScene(); return true;
    } catch { this.ready(false); this.destroy(); return false; }
  }
  setLayer(index: number): void { this.activeLayer=Math.max(0,Math.min(2,index)); this.invalidate(); }
  point(x: number,y: number): void { if(this.mode!=='massing')return; this.targetY=x*.07; this.targetX=y*.025; this.invalidate(); }
  private resizeScene(): void {
    if(!this.renderer||!this.host.clientWidth||!this.host.clientHeight)return;
    const aspect=this.host.clientWidth/this.host.clientHeight; const halfHeight=Math.max(5,6.8/aspect);
    this.camera.left=-halfHeight*aspect; this.camera.right=halfHeight*aspect; this.camera.top=halfHeight; this.camera.bottom=-halfHeight; this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.host.clientWidth,this.host.clientHeight,false); this.invalidate();
  }
  private invalidate(): void {
    if(this.destroyed||this.frame||document.hidden)return;
    this.frame=requestAnimationFrame(()=>{
      this.frame=0; if(this.destroyed||!this.renderer||document.hidden)return;
      this.group.rotation.x+=(this.targetX-this.group.rotation.x)*.16;
      this.group.rotation.y+=(this.targetY-this.group.rotation.y)*.16;
      let remaining=Math.abs(this.targetX-this.group.rotation.x)+Math.abs(this.targetY-this.group.rotation.y);
      this.layers.forEach((layer,i)=>{
        const target=i*1.9+(i === this.activeLayer ? .32 : 0);
        layer.group.position.y+=(target-layer.group.position.y)*.14; remaining+=Math.abs(target-layer.group.position.y);
        layer.materials.forEach((material,j)=>{ const opacity=i === this.activeLayer ? (j === 1 ? .19 : .38) : (j === 1 ? .06 : .14); material.opacity+=(opacity-material.opacity)*.14; remaining+=Math.abs(opacity-material.opacity); });
      });
      try { this.renderer.render(this.scene,this.camera); this.ready(true); } catch { this.ready(false); this.destroy(); return; }
      // No idle render loop: a short settling sequence runs only after input/resize.
      if(remaining>.0003)this.invalidate();
    });
  }
  destroy(): void {
    if(this.destroyed)return; this.destroyed=true; cancelAnimationFrame(this.frame); this.resize?.disconnect();
    document.removeEventListener('visibilitychange',this.visibilityChanged);
    this.renderer?.domElement.removeEventListener('webglcontextlost',this.contextLost);
    if(this.renderer){this.scenes.dispose(this.scene,this.renderer);this.renderer.forceContextLoss();}
  }
}
