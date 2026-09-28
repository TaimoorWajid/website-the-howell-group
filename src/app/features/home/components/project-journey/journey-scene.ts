import * as THREE from 'three';

type Part = { object: THREE.Object3D; start: number; duration: number; y: number; rise: number };
const smooth = (value: number): number => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };

/** An original architectural study: one coordinated model, assembled by scroll position. */
export class JourneyScene {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(35, 1, .1, 150);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly building = new THREE.Group();
  private readonly blueprint = new THREE.Group();
  private readonly parts: Part[] = [];
  private readonly geometry = new THREE.BoxGeometry(1, 1, 1);
  private readonly edges = new THREE.EdgesGeometry(this.geometry);
  private readonly materials: THREE.Material[] = [];
  private readonly textures: THREE.Texture[] = [];
  private readonly sunlight = new THREE.DirectionalLight('#ffe6bc', 4);
  private observer?: ResizeObserver;
  private visibility?: IntersectionObserver;
  private frame = 0;
  private visible = true;
  private destroyed = false;
  private progress = 0;

  constructor(private readonly container: HTMLElement, private readonly failed: () => void) {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    try {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.renderer.setClearColor('#092b2c', 0);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.1;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.renderer.domElement.setAttribute('aria-hidden', 'true');
      Object.assign(this.renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
      container.appendChild(this.renderer.domElement);
      this.renderer.domElement.addEventListener('webglcontextlost', this.contextLost);
      this.scene.add(this.building, this.blueprint);
      this.light();
      this.build();
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(container);
      this.visibility = new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; this.invalidate(); });
      this.visibility.observe(container);
      document.addEventListener('visibilitychange', this.invalidate);
      this.resize();
    } catch (error) { this.destroy(); throw error; }
  }

  private material(color: string, metalness = 0, roughness = .5, extra: Record<string, unknown> = {}): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });
    this.materials.push(material); return material;
  }

  private box(parent: THREE.Group, material: THREE.Material, x: number, y: number, z: number, w: number, h: number, d: number, start = -1, rise = 1.4, duration = .09): THREE.Mesh {
    const mesh = new THREE.Mesh(this.geometry, material);
    mesh.position.set(x, y, z); mesh.scale.set(w, h, d);
    mesh.castShadow = true; mesh.receiveShadow = true;
    parent.add(mesh);
    if (start >= 0) this.parts.push({ object: mesh, start, duration, y, rise });
    return mesh;
  }

  private light(): void {
    // A soft, panoramic studio environment gives the glazing real reflections.
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#d4e4e5'); gradient.addColorStop(.46, '#668f91');
    gradient.addColorStop(.5, '#f4d6a1'); gradient.addColorStop(.58, '#254849'); gradient.addColorStop(1, '#0c2528');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#fff1d8'; ctx.fillRect(140, 120, 150, 160);
    const environment = new THREE.CanvasTexture(canvas);
    environment.mapping = THREE.EquirectangularReflectionMapping;
    environment.colorSpace = THREE.SRGBColorSpace;
    this.textures.push(environment); this.scene.environment = environment;
    this.scene.add(new THREE.HemisphereLight('#e3f5f2', '#34453b', 2.3));
    this.sunlight.position.set(-6, 12, 7); this.sunlight.castShadow = true;
    this.sunlight.shadow.mapSize.set(1024, 1024);
    Object.assign(this.sunlight.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: .5, far: 40 });
    this.sunlight.shadow.normalBias = .035;
    this.scene.add(this.sunlight);
    const rim = new THREE.DirectionalLight('#91c7cd', 2.5); rim.position.set(5, 6, -8); this.scene.add(rim);
  }

  private build(): void {
    const stone = this.material('#e5decc', .06, .56);
    const slab = this.material('#b2bbad', .1, .6);
    const steel = this.material('#4c6c67', .7, .3);
    const glass = this.material('#407575', .75, .16, { transparent: true, opacity: .78 });
    const bronze = this.material('#a18c62', .7, .32);
    const warm = this.material('#d9c6a0', .1, .5, { emissive: '#e8b269', emissiveIntensity: .45 });
    const ground = this.material('#183b39', .15, .8);
    const paving = this.material('#698078', .1, .85);
    const foliage = this.material('#68826a', 0, .95);
    const dark = this.material('#1b3332', .3, .7);
    const line = new THREE.LineBasicMaterial({ color: '#9bbfaf', transparent: true, opacity: .35 });
    this.materials.push(line);
    this.box(this.building, ground, 0, -.4, 0, 14, .5, 10);
    this.box(this.building, bronze, 0, -.68, 0, 14.08, .035, 10.08);
    // Fine site-plan lines remain below the physical model throughout the journey.
    const grid = new THREE.GridHelper(14, 28, '#739b88', '#739b88');
    grid.position.y = -.13;
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMaterials.forEach(m => { m.transparent = true; m.opacity = .14; this.materials.push(m); });
    this.building.add(grid);
    const wire = (x: number, y: number, z: number, w: number, h: number, d: number) => {
      const outline = new THREE.LineSegments(this.edges, line);
      outline.position.set(x, y, z); outline.scale.set(w, h, d); this.blueprint.add(outline);
    };
    for (let level = 0; level < 4; level++) {
      wire(0, level * 1.5 + .12, -.8, 10, .035, 4.8);
      wire(-3.7, level * 1.5 + .12, 2.25, 2.6, .035, 1.3);
    }
    for (let x = -5; x <= 5; x += 2) for (const z of [-3.2, 1.6]) wire(x, 2.3, z, .035, 4.5, .035);
    // Foundation, then a three-storey structural frame with a glazed courtyard edge.
    this.box(this.building, slab, 0, 0, -.8, 10.4, .22, 5.2, .50, .8);
    this.box(this.building, paving, 0, -.08, 3.05, 11.4, .09, 2.7, .51, .3);
    for (let floor = 0; floor < 3; floor++) {
      const y = floor * 1.5;
      for (let x = -4.8; x <= 5; x += 1.92) {
        for (const z of [-3, -.7, 1.4]) {
          this.box(this.building, steel, x, y + .78, z, .13, 1.5, .13, .565 + floor * .026 + (x + 4.8) * .0015, 2.5);
        }
      }
      this.box(this.building, stone, 0, y + 1.53, -.8, 10.3, .16, 5.1, .585 + floor * .029, 3.2);
      // Warm inset ceilings and interior service core are visible behind the glass.
      this.box(this.building, warm, 0, y + 1.40, -.8, 9.6, .045, 4.5, .68 + floor * .024, 1);
      this.box(this.building, stone, -1.2, y + .75, -1.2, 1.5, 1.3, 1.5, .66 + floor * .024);
      for (let bay = 0; bay < 10; bay++) {
        const x = -4.5 + bay;
        this.box(this.building, glass, x, y + .79, 1.53, .95, 1.3, .035, .70 + bay * .003 + floor * .025, 1.8);
        this.box(this.building, bronze, x - .49, y + .8, 1.61, .045, 1.35, .12, .73 + bay * .002 + floor * .018);
        this.box(this.building, glass, x, y + .79, -3.16, .95, 1.3, .035, .70 + floor * .025);
      }
      for (let bay = 0; bay < 5; bay++) {
        const z = -2.7 + bay * .93;
        this.box(this.building, glass, 5.01, y + .79, z, .035, 1.3, .88, .71 + floor * .025);
        this.box(this.building, bronze, 5.11, y + .8, z, .18, 1.35, .055, .75 + floor * .025);
      }
      // Solid west wing anchors the composition and frames the main entrance.
      this.box(this.building, stone, -4.0, y + .8, 2.04, 2.3, 1.45, 1.3, .69 + floor * .025, 2);
      for (let slot = 0; slot < 7; slot++) this.box(this.building, bronze, -4.9 + slot * .3, y + .8, 2.72, .055, 1.25, .07, .76 + floor * .018);
    }
    // Cantilevered roof, rooftop garden, arrival canopy and a finely ribbed screen.
    this.box(this.building, stone, 0, 4.72, -.75, 10.7, .18, 5.5, .80, 3);
    this.box(this.building, dark, 0, 4.83, -.75, 9.3, .06, 4.3, .81);
    this.box(this.building, bronze, 1.8, 1.65, 2.65, 3.7, .09, 2.25, .83, 1.2);
    for (let i = 0; i < 15; i++) this.box(this.building, stone, -.2 + i * .36, 3.2, -3.39, .085, 2.95, .28, .80 + i * .001);
    this.box(this.building, dark, 1.7, .74, 1.57, 1.7, 1.4, .07, .83);
    this.box(this.building, glass, 1.7, .74, 1.65, 1.5, 1.35, .035, .84);
    this.box(this.building, bronze, 1.7, .75, 1.7, .045, 1.35, .05, .84);
    for (let step = 0; step < 3; step++) this.box(this.building, stone, 1.7, -.06 + step * .04, 3.9 - step * .35, 3.8, .06, .4, .83 + step * .012, .3);
    // Raised planting beds with layered sculptural planting; no external asset requests.
    for (const [x, z] of [[-5.85, -2.2], [5.95, -2.2], [5.95, 1.4], [-3.8, 3.7]]) {
      this.box(this.building, stone, x, .12, z, 1.15, .35, 1.15, .85, .4);
      for (let leaf = 0; leaf < 4; leaf++) {
        const crown = this.box(this.building, foliage, x + Math.sin(leaf * 2.4) * .22, .5 + leaf * .1, z + Math.cos(leaf * 2.4) * .2, .66, .55, .66, .86 + leaf * .01, .6);
        crown.rotation.y = leaf * .7; crown.rotation.z = .12;
      }
    }
    // Brass wayfinding at the approach and a slender care cross on the stone wing.
    this.box(this.building, bronze, -2, .5, 4, .5, 1.1, .12, .9, .7);
    this.box(this.building, warm, -4, 3.9, 2.735, .47, .11, .025, .90);
    this.box(this.building, warm, -4, 3.9, 2.735, .11, .47, .025, .90);
    // Dashed approach line provides scale and guides the eye toward the entrance.
    for (let i = 0; i < 9; i++) this.box(this.building, bronze, -3.5 + i, -.105, 4.55, .4, .012, .025);
    this.update(0);
  }

  update(progress: number): void {
    this.progress = progress;
    for (const part of this.parts) {
      const amount = smooth((progress - part.start) / part.duration);
      part.object.visible = amount > .001;
      part.object.position.y = part.y + (1 - amount) * part.rise;
      // Preserve final dimensions: assembly travels down from exploded layers.
    }
    this.blueprint.visible = progress < .78;
    const wireMaterial = (this.blueprint.children[0] as THREE.LineSegments).material as THREE.Material;
    wireMaterial.opacity = .38 * (1 - smooth((progress - .58) / .2));
    this.blueprint.scale.y = .025 + .975 * smooth((progress - .13) / .18);
    const angle = .60 - progress * 1.18;
    const distance = 22 - smooth((progress - .78) / .22) * 4;
    this.camera.position.set(Math.sin(angle) * distance, 13 - progress * 5.5, Math.cos(angle) * distance);
    this.camera.lookAt(0, 1.25 + progress * .6, 0);
    this.invalidate();
  }

  private resize(): void {
    const { width, height } = this.container.getBoundingClientRect();
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.fov = width < 800 ? 44 : 35;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.update(this.progress);
  }

  private readonly invalidate = (): void => {
    if (this.destroyed || this.frame || !this.visible || document.hidden) return;
    this.frame = requestAnimationFrame(() => { this.frame = 0; if (!this.destroyed) this.renderer.render(this.scene, this.camera); });
  };
  private readonly contextLost = (event: Event): void => { event.preventDefault(); this.failed(); };

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect(); this.visibility?.disconnect();
    document.removeEventListener('visibilitychange', this.invalidate);
    this.renderer.domElement.removeEventListener('webglcontextlost', this.contextLost);
    const geometries = new Set<THREE.BufferGeometry>([this.geometry, this.edges]);
    this.scene.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) geometries.add(object.geometry); });
    geometries.forEach(geometry => geometry.dispose());
    this.materials.forEach(material => material.dispose());
    this.textures.forEach(texture => texture.dispose());
    this.sunlight.shadow.dispose();
    this.renderer.dispose(); this.renderer.forceContextLoss(); this.renderer.domElement.remove();
  }
}
