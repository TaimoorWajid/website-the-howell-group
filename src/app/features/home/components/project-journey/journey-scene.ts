import * as THREE from 'three';

type Part = {
  object: THREE.Object3D;
  start: number;
  duration: number;
  y: number;
  rise: number;
};
const smooth = (value: number): number => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

/** An original architectural study: one coordinated model, assembled by scroll position. */
export class JourneyScene {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(35, 1, 0.1, 150);
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

  constructor(
    private readonly container: HTMLElement,
    private readonly failed: () => void,
  ) {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    try {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.renderer.setClearColor('#092b2c', 0);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.1;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.renderer.domElement.setAttribute('aria-hidden', 'true');
      Object.assign(this.renderer.domElement.style, {
        width: '100%',
        height: '100%',
        display: 'block',
      });
      container.appendChild(this.renderer.domElement);
      this.renderer.domElement.addEventListener(
        'webglcontextlost',
        this.contextLost,
      );
      this.scene.add(this.building, this.blueprint);
      this.light();
      this.build();
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(container);
      this.visibility = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting;
        this.invalidate();
      });
      this.visibility.observe(container);
      document.addEventListener('visibilitychange', this.invalidate);
      this.resize();
    } catch (error) {
      this.destroy();
      throw error;
    }
  }

  private material(
    color: string,
    metalness = 0,
    roughness = 0.5,
    extra: Record<string, unknown> = {},
  ): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness,
      roughness,
      ...extra,
    });
    this.materials.push(material);
    return material;
  }

  private box(
    parent: THREE.Group,
    material: THREE.Material,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    start = -1,
    rise = 1.4,
    duration = 0.09,
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(this.geometry, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(w, h, d);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    if (start >= 0) this.parts.push({ object: mesh, start, duration, y, rise });
    return mesh;
  }

  private light(): void {
    // A soft, panoramic studio environment gives the glazing real reflections.
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#d4e4e5');
    gradient.addColorStop(0.46, '#668f91');
    gradient.addColorStop(0.5, '#f4d6a1');
    gradient.addColorStop(0.58, '#254849');
    gradient.addColorStop(1, '#0c2528');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#fff1d8';
    ctx.fillRect(140, 120, 150, 160);
    const environment = new THREE.CanvasTexture(canvas);
    environment.mapping = THREE.EquirectangularReflectionMapping;
    environment.colorSpace = THREE.SRGBColorSpace;
    this.textures.push(environment);
    this.scene.environment = environment;
    this.scene.add(new THREE.HemisphereLight('#e3f5f2', '#34453b', 2.3));
    this.sunlight.position.set(-6, 12, 7);
    this.sunlight.castShadow = true;
    this.sunlight.shadow.mapSize.set(1024, 1024);
    Object.assign(this.sunlight.shadow.camera, {
      left: -11,
      right: 11,
      top: 11,
      bottom: -11,
      near: 0.5,
      far: 40,
    });
    this.sunlight.shadow.normalBias = 0.035;
    this.scene.add(this.sunlight);
    const rim = new THREE.DirectionalLight('#91c7cd', 2.5);
    rim.position.set(5, 6, -8);
    this.scene.add(rim);
  }

  private build(): void {
    const stone = this.material('#e5decc', 0.06, 0.56);
    const slab = this.material('#b2bbad', 0.1, 0.6);
    const steel = this.material('#4c6c67', 0.7, 0.3);
    const glass = this.material('#407575', 0.75, 0.16, {
      transparent: true,
      opacity: 0.78,
    });
    const bronze = this.material('#a18c62', 0.7, 0.32);
    const warm = this.material('#d9c6a0', 0.1, 0.5, {
      emissive: '#e8b269',
      emissiveIntensity: 0.45,
    });
    const ground = this.material('#183b39', 0.15, 0.8);
    const paving = this.material('#698078', 0.1, 0.85);
    const foliage = this.material('#68826a', 0, 0.95);
    const dark = this.material('#1b3332', 0.3, 0.7);
    const line = new THREE.LineBasicMaterial({
      color: '#9bbfaf',
      transparent: true,
      opacity: 0.35,
    });
    this.materials.push(line);
    this.box(this.building, ground, 0, -0.4, 0, 14, 0.5, 10);
    this.box(this.building, bronze, 0, -0.68, 0, 14.08, 0.035, 10.08);
    // Fine site-plan lines remain below the physical model throughout the journey.
    const grid = new THREE.GridHelper(14, 28, '#739b88', '#739b88');
    grid.position.y = -0.13;
    const gridMaterials = Array.isArray(grid.material)
      ? grid.material
      : [grid.material];
    gridMaterials.forEach((m) => {
      m.transparent = true;
      m.opacity = 0.14;
      this.materials.push(m);
    });
    this.building.add(grid);
    const wire = (
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      d: number,
    ) => {
      const outline = new THREE.LineSegments(this.edges, line);
      outline.position.set(x, y, z);
      outline.scale.set(w, h, d);
      this.blueprint.add(outline);
    };
    for (let level = 0; level < 4; level++) {
      wire(0, level * 1.5 + 0.12, -0.8, 10, 0.035, 4.8);
      wire(-3.7, level * 1.5 + 0.12, 2.25, 2.6, 0.035, 1.3);
    }
    for (let x = -5; x <= 5; x += 2)
      for (const z of [-3.2, 1.6]) wire(x, 2.3, z, 0.035, 4.5, 0.035);
    // Foundation, then a three-storey structural frame with a glazed courtyard edge.
    this.box(this.building, slab, 0, 0, -0.8, 10.4, 0.22, 5.2, 0.5, 0.8);
    this.box(this.building, paving, 0, -0.08, 3.05, 11.4, 0.09, 2.7, 0.51, 0.3);
    for (let floor = 0; floor < 3; floor++) {
      const y = floor * 1.5;
      for (let x = -4.8; x <= 5; x += 1.92) {
        for (const z of [-3, -0.7, 1.4]) {
          this.box(
            this.building,
            steel,
            x,
            y + 0.78,
            z,
            0.13,
            1.5,
            0.13,
            0.565 + floor * 0.026 + (x + 4.8) * 0.0015,
            2.5,
          );
        }
      }
      this.box(
        this.building,
        stone,
        0,
        y + 1.53,
        -0.8,
        10.3,
        0.16,
        5.1,
        0.585 + floor * 0.029,
        3.2,
      );
      // Warm inset ceilings and interior service core are visible behind the glass.
      this.box(
        this.building,
        warm,
        0,
        y + 1.4,
        -0.8,
        9.6,
        0.045,
        4.5,
        0.68 + floor * 0.024,
        1,
      );
      this.box(
        this.building,
        stone,
        -1.2,
        y + 0.75,
        -1.2,
        1.5,
        1.3,
        1.5,
        0.66 + floor * 0.024,
      );
      for (let bay = 0; bay < 10; bay++) {
        const x = -4.5 + bay;
        this.box(
          this.building,
          glass,
          x,
          y + 0.79,
          1.53,
          0.95,
          1.3,
          0.035,
          0.7 + bay * 0.003 + floor * 0.025,
          1.8,
        );
        this.box(
          this.building,
          bronze,
          x - 0.49,
          y + 0.8,
          1.61,
          0.045,
          1.35,
          0.12,
          0.73 + bay * 0.002 + floor * 0.018,
        );
        this.box(
          this.building,
          glass,
          x,
          y + 0.79,
          -3.16,
          0.95,
          1.3,
          0.035,
          0.7 + floor * 0.025,
        );
      }
      for (let bay = 0; bay < 5; bay++) {
        const z = -2.7 + bay * 0.93;
        this.box(
          this.building,
          glass,
          5.01,
          y + 0.79,
          z,
          0.035,
          1.3,
          0.88,
          0.71 + floor * 0.025,
        );
        this.box(
          this.building,
          bronze,
          5.11,
          y + 0.8,
          z,
          0.18,
          1.35,
          0.055,
          0.75 + floor * 0.025,
        );
      }
      // Solid west wing anchors the composition and frames the main entrance.
      this.box(
        this.building,
        stone,
        -4.0,
        y + 0.8,
        2.04,
        2.3,
        1.45,
        1.3,
        0.69 + floor * 0.025,
        2,
      );
      for (let slot = 0; slot < 7; slot++)
        this.box(
          this.building,
          bronze,
          -4.9 + slot * 0.3,
          y + 0.8,
          2.72,
          0.055,
          1.25,
          0.07,
          0.76 + floor * 0.018,
        );
    }
    // Cantilevered roof, rooftop garden, arrival canopy and a finely ribbed screen.
    this.box(this.building, stone, 0, 4.72, -0.75, 10.7, 0.18, 5.5, 0.8, 3);
    this.box(this.building, dark, 0, 4.83, -0.75, 9.3, 0.06, 4.3, 0.81);
    this.box(
      this.building,
      bronze,
      1.8,
      1.65,
      2.65,
      3.7,
      0.09,
      2.25,
      0.83,
      1.2,
    );
    for (let i = 0; i < 15; i++)
      this.box(
        this.building,
        stone,
        -0.2 + i * 0.36,
        3.2,
        -3.39,
        0.085,
        2.95,
        0.28,
        0.8 + i * 0.001,
      );
    this.box(this.building, dark, 1.7, 0.74, 1.57, 1.7, 1.4, 0.07, 0.83);
    this.box(this.building, glass, 1.7, 0.74, 1.65, 1.5, 1.35, 0.035, 0.84);
    this.box(this.building, bronze, 1.7, 0.75, 1.7, 0.045, 1.35, 0.05, 0.84);
    for (let step = 0; step < 3; step++)
      this.box(
        this.building,
        stone,
        1.7,
        -0.06 + step * 0.04,
        3.9 - step * 0.35,
        3.8,
        0.06,
        0.4,
        0.83 + step * 0.012,
        0.3,
      );
    // Raised planting beds with layered sculptural planting; no external asset requests.
    for (const [x, z] of [
      [-5.85, -2.2],
      [5.95, -2.2],
      [5.95, 1.4],
      [-3.8, 3.7],
    ]) {
      this.box(this.building, stone, x, 0.12, z, 1.15, 0.35, 1.15, 0.85, 0.4);
      for (let leaf = 0; leaf < 4; leaf++) {
        const crown = this.box(
          this.building,
          foliage,
          x + Math.sin(leaf * 2.4) * 0.22,
          0.5 + leaf * 0.1,
          z + Math.cos(leaf * 2.4) * 0.2,
          0.66,
          0.55,
          0.66,
          0.86 + leaf * 0.01,
          0.6,
        );
        crown.rotation.y = leaf * 0.7;
        crown.rotation.z = 0.12;
      }
    }
    // Brass wayfinding at the approach and a slender care cross on the stone wing.
    this.box(this.building, bronze, -2, 0.5, 4, 0.5, 1.1, 0.12, 0.9, 0.7);
    this.box(this.building, warm, -4, 3.9, 2.735, 0.47, 0.11, 0.025, 0.9);
    this.box(this.building, warm, -4, 3.9, 2.735, 0.11, 0.47, 0.025, 0.9);
    // Dashed approach line provides scale and guides the eye toward the entrance.
    for (let i = 0; i < 9; i++)
      this.box(
        this.building,
        bronze,
        -3.5 + i,
        -0.105,
        4.55,
        0.4,
        0.012,
        0.025,
      );
    this.update(0);
  }

  update(progress: number): void {
    this.progress = progress;
    for (const part of this.parts) {
      const amount = smooth((progress - part.start) / part.duration);
      part.object.visible = amount > 0.001;
      part.object.position.y = part.y + (1 - amount) * part.rise;
      // Preserve final dimensions: assembly travels down from exploded layers.
    }
    this.blueprint.visible = progress < 0.78;
    const wireMaterial = (this.blueprint.children[0] as THREE.LineSegments)
      .material as THREE.Material;
    wireMaterial.opacity = 0.38 * (1 - smooth((progress - 0.58) / 0.2));
    this.blueprint.scale.y = 0.025 + 0.975 * smooth((progress - 0.13) / 0.18);
    const angle = 0.6 - progress * 1.18;
    const distance = 22 - smooth((progress - 0.78) / 0.22) * 4;
    this.camera.position.set(
      Math.sin(angle) * distance,
      13 - progress * 5.5,
      Math.cos(angle) * distance,
    );
    this.camera.lookAt(0, 1.25 + progress * 0.6, 0);
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
    if (this.destroyed || this.frame || !this.visible || document.hidden)
      return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      if (!this.destroyed) this.renderer.render(this.scene, this.camera);
    });
  };
  private readonly contextLost = (event: Event): void => {
    event.preventDefault();
    this.failed();
  };

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
    this.visibility?.disconnect();
    document.removeEventListener('visibilitychange', this.invalidate);
    this.renderer.domElement.removeEventListener(
      'webglcontextlost',
      this.contextLost,
    );
    const geometries = new Set<THREE.BufferGeometry>([
      this.geometry,
      this.edges,
    ]);
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments)
        geometries.add(object.geometry);
    });
    geometries.forEach((geometry) => geometry.dispose());
    this.materials.forEach((material) => material.dispose());
    this.textures.forEach((texture) => texture.dispose());
    this.sunlight.shadow.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
