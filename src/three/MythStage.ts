import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type {
  ActorMotion,
  ChapterAtmosphere,
  CharacterExpression,
  EnvironmentAssetId,
  SceneActor,
  SceneBackdrop,
  SceneInteraction,
} from '../data/myths';

import {
  applyZeusVariantToRig,
  buildAllCharacterRigs,
  type CharacterRig,
  type StageCharacterId,
} from './characterBuilder';

export type { StageCharacterId };

export type StageViewMode = 'TITLE' | 'READING' | 'CINEMA';

interface AtmospherePalette {
  skyHex: number;
  fogDensity: number;
  sunHex: number;
  sunIntensity: number;
  hemiSkyHex: number;
  hemiGroundHex: number;
  accentHex: number;
  moteHex: number;
  waterHex: number;
}

const ATMOSPHERES: Record<ChapterAtmosphere, AtmospherePalette> = {
  primordial: {
    skyHex: 0x0e182e,
    fogDensity: 0.028,
    sunHex: 0xffe6a3,
    sunIntensity: 2.1,
    hemiSkyHex: 0x6ea89c,
    hemiGroundHex: 0x1b2b24,
    accentHex: 0x34d399,
    moteHex: 0xa7f3d0,
    waterHex: 0x173a3b,
  },
  othrys: {
    skyHex: 0x1c100f,
    fogDensity: 0.036,
    sunHex: 0xf4a261,
    sunIntensity: 1.95,
    hemiSkyHex: 0x7c4038,
    hemiGroundHex: 0x261513,
    accentHex: 0xe76f51,
    moteHex: 0xfbbf24,
    waterHex: 0x2f1816,
  },
  crete: {
    skyHex: 0x182b3a,
    fogDensity: 0.024,
    sunHex: 0xffe4a3,
    sunIntensity: 2.5,
    hemiSkyHex: 0x8cc9b3,
    hemiGroundHex: 0x263d2d,
    accentHex: 0xfde047,
    moteHex: 0xfef08a,
    waterHex: 0x1c536e,
  },
  tartarus: {
    skyHex: 0x090b12,
    fogDensity: 0.045,
    sunHex: 0x7dd3fc,
    sunIntensity: 1.4,
    hemiSkyHex: 0x453268,
    hemiGroundHex: 0x11131c,
    accentHex: 0x22c55e,
    moteHex: 0x6ee7b7,
    waterHex: 0x142230,
  },
  battleground: {
    skyHex: 0x1f1416,
    fogDensity: 0.031,
    sunHex: 0xfde047,
    sunIntensity: 2.45,
    hemiSkyHex: 0x9b5a3a,
    hemiGroundHex: 0x2b1d18,
    accentHex: 0xfacc15,
    moteHex: 0xfde047,
    waterHex: 0x36201a,
  },
  olympus: {
    skyHex: 0x1b253d,
    fogDensity: 0.023,
    sunHex: 0xffe5a8,
    sunIntensity: 2.65,
    hemiSkyHex: 0xa2bce8,
    hemiGroundHex: 0x3b3126,
    accentHex: 0xf59e0b,
    moteHex: 0xffe082,
    waterHex: 0x24496e,
  },
};

const _vec3 = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _color = new THREE.Color();

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createMarbleTexture(maxAniso: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#e8e0d2';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 42; i++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let s = 0; s < 6; s++) {
      x += (Math.random() - 0.5) * 140;
      y += (Math.random() - 0.5) * 140;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle =
      i % 3 === 0 ? 'rgba(168, 150, 126, 0.22)' : 'rgba(255, 252, 245, 0.35)';
    ctx.lineWidth = 0.8 + Math.random() * 2.2;
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(130, 112, 88, 0.16)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(256, 256, 180, 0, Math.PI * 2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAniso;
  return tex;
}

function createRadialShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, 'rgba(10, 8, 6, 0.65)');
  grad.addColorStop(0.55, 'rgba(10, 8, 6, 0.25)');
  grad.addColorStop(1, 'rgba(10, 8, 6, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class MythStage {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private isSoftwareGl: boolean;

  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private rimLight: THREE.DirectionalLight;
  private accentLight: THREE.PointLight;

  private shadowTex: THREE.CanvasTexture;
  private marbleTex: THREE.CanvasTexture;
  private brazierFlame: THREE.Group;
  private brazierGroup: THREE.Group;
  private oliveTree: THREE.Group;
  private columnsGroup: THREE.Group;
  private columnMarbleMat: THREE.MeshStandardMaterial | null = null;
  private mountainRocksGroup: THREE.Group;
  private tartarusRocksGroup: THREE.Group;
  private cloudMat: THREE.MeshStandardMaterial | null = null;
  private cloudBanks: THREE.Group[] = [];
  private waterRing: THREE.Mesh | null = null;

  private propCosmosStars: THREE.Group | null = null;
  private propSickleArc: THREE.Group | null = null;
  private propOthrysThrone: THREE.Group | null = null;
  private propOmphalos: THREE.Group | null = null;
  private propCreteSanctuary: THREE.Group | null = null;
  private propCuretesShields: THREE.Group | null = null;
  private propElixirPedestal: THREE.Group | null = null;
  private propTwinPeaks: THREE.Group | null = null;
  private propTartarusPit: THREE.Group | null = null;
  private propCyclopesForge: THREE.Group | null = null;
  private propBoulderStorm: THREE.Group | null = null;
  private propLightningZenith: THREE.Group | null = null;
  private propOlympusRelics: THREE.Group | null = null;

  private characters: Record<StageCharacterId, THREE.Group>;
  private rigs: Record<StageCharacterId, CharacterRig>;
  private activeActors: SceneActor[] = [
    { id: 'gaia', expression: 'serene', role: 'left', motion: 'advance' },
    { id: 'uranus', expression: 'wise', role: 'center', motion: 'hover' },
    { id: 'cronus', expression: 'fierce', role: 'right', motion: 'guard' },
  ];
  private activeBackdrop: SceneBackdrop = 'cosmos_origin';
  private activeAtmosphere: ChapterAtmosphere = 'primordial';
  private activeInteraction: SceneInteraction = 'converse';
  private viewMode: StageViewMode = 'TITLE';

  private motesMesh: THREE.InstancedMesh;
  private moteCount = 52;
  private moteData: Array<{
    angle: number;
    radius: number;
    y: number;
    speed: number;
    scale: number;
    phase: number;
  }> = [];

  private activeSpeakerId: StageCharacterId | null = null;
  private actionBeatTimer = 0;
  private reactionTimer = 0;
  private userOrbiting = false;
  private reducedMotion = false;
  private disposed = false;
  private frameId = 0;
  private lastTime = performance.now();
  private elapsed = 0;

  private onContextLostCallback?: (lost: boolean) => void;

  constructor(
    container: HTMLElement,
    onContextLost?: (lost: boolean) => void,
  ) {
    this.container = container;
    this.onContextLostCallback = onContextLost;
    this.reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.isSoftwareGl = detectSoftwareWebGL();

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2),
    );
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    const initialPal = ATMOSPHERES.primordial;
    this.scene.background = new THREE.Color(initialPal.skyHex);
    this.scene.fog = new THREE.FogExp2(initialPal.skyHex, initialPal.fogDensity);

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;
    pmremGenerator.dispose();

    this.camera = new THREE.PerspectiveCamera(
      42,
      Math.max(1, container.clientWidth) / Math.max(1, container.clientHeight),
      0.1,
      80,
    );
    this.camera.position.set(0.6, 2.7, 7.2);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = !this.isSoftwareGl;
    this.controls.dampingFactor = 0.06;
    this.controls.enablePan = false;
    this.controls.minDistance = 3.2;
    this.controls.maxDistance = 11.5;
    this.controls.minPolarAngle = Math.PI * 0.16;
    this.controls.maxPolarAngle = Math.PI * 0.48;
    this.controls.target.set(0, 1.35, 0);
    this.controls.enabled = false;

    this.controls.addEventListener('start', () => {
      this.userOrbiting = true;
    });

    this.hemiLight = new THREE.HemisphereLight(
      initialPal.hemiSkyHex,
      initialPal.hemiGroundHex,
      0.78,
    );
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(
      initialPal.sunHex,
      initialPal.sunIntensity,
    );
    this.sunLight.position.set(5.5, 8.5, 5.0);
    this.sunLight.castShadow = !this.isSoftwareGl;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 25;
    const d = 7;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);

    this.rimLight = new THREE.DirectionalLight(0xa3c4f3, 0.85);
    this.rimLight.position.set(-5, 4.5, -5.5);
    this.scene.add(this.rimLight);

    this.accentLight = new THREE.PointLight(initialPal.accentHex, 2.4, 9, 1.8);
    this.accentLight.position.set(-1.35, 1.85, 1.1);
    this.scene.add(this.accentLight);

    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this.marbleTex = createMarbleTexture(maxAniso);
    this.shadowTex = createRadialShadowTexture();

    this.brazierFlame = new THREE.Group();
    this.brazierGroup = new THREE.Group();
    this.oliveTree = new THREE.Group();
    this.columnsGroup = new THREE.Group();
    this.mountainRocksGroup = new THREE.Group();
    this.tartarusRocksGroup = new THREE.Group();
    this.buildTempleEnvironment();

    this.rigs = buildAllCharacterRigs(this.shadowTex);
    this.characters = {} as Record<StageCharacterId, THREE.Group>;

    (Object.keys(this.rigs) as StageCharacterId[]).forEach((id) => {
      const grp = this.rigs[id].root;
      this.characters[id] = grp;
      grp.visible = this.activeActors.some((a) => a.id === id);
      this.scene.add(grp);
    });
    const zeusInit = this.activeActors.find((a) => a.id === 'zeus');
    if (zeusInit) {
      applyZeusVariantToRig(this.rigs.zeus, zeusInit.variant ?? 'warrior');
    }
    this.applyBackdropProps(this.activeBackdrop);

    const moteGeo = new THREE.OctahedronGeometry(0.036, 0);
    const moteMat = new THREE.MeshBasicMaterial({
      color: initialPal.moteHex,
      transparent: true,
      opacity: 0.78,
    });
    this.motesMesh = new THREE.InstancedMesh(moteGeo, moteMat, this.moteCount);
    this.motesMesh.frustumCulled = false;
    for (let i = 0; i < this.moteCount; i++) {
      this.moteData.push({
        angle: Math.random() * Math.PI * 2,
        radius: 0.8 + Math.random() * 3.8,
        y: 0.3 + Math.random() * 3.6,
        speed: 0.14 + Math.random() * 0.28,
        scale: 0.55 + Math.random() * 1.15,
        phase: Math.random() * Math.PI * 2,
      });
    }
    this.scene.add(this.motesMesh);

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    this.bindEvents();
    this.lastTime = performance.now();
    this.tick();
  }

  private addContactShadow(
    parent: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    radius: number,
    opacity = 0.45,
  ): void {
    const geo = new THREE.PlaneGeometry(radius * 2, radius * 2);
    const mat = new THREE.MeshBasicMaterial({
      map: this.shadowTex,
      transparent: true,
      depthWrite: false,
      opacity,
    });
    const plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(x, y, z);
    parent.add(plane);
  }

  private buildTempleEnvironment(): void {
    const envGroup = new THREE.Group();

    const marbleMat = new THREE.MeshStandardMaterial({
      map: this.marbleTex,
      color: 0xf4eee3,
      roughness: 0.42,
      metalness: 0.05,
    });
    this.columnMarbleMat = marbleMat;
    const stoneTerraceMat = new THREE.MeshStandardMaterial({
      color: 0x3b352e,
      roughness: 0.88,
      metalness: 0.02,
    });
    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xb07c3c,
      roughness: 0.28,
      metalness: 0.86,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xe6b85c,
      roughness: 0.2,
      metalness: 0.92,
    });

    const plateau = new THREE.Mesh(
      new THREE.CylinderGeometry(24, 30, 1.4, 48),
      stoneTerraceMat,
    );
    plateau.position.y = -0.82;
    plateau.receiveShadow = true;
    envGroup.add(plateau);

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x204b68,
      roughness: 0.14,
      metalness: 0.72,
      transparent: true,
      opacity: 0.88,
    });
    this.waterRing = new THREE.Mesh(
      new THREE.RingGeometry(3.88, 9.6, 64),
      waterMat,
    );
    this.waterRing.rotation.x = -Math.PI / 2;
    this.waterRing.position.y = -0.095;
    this.waterRing.receiveShadow = true;
    envGroup.add(this.waterRing);

    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xf4efe6,
      roughness: 0.95,
      metalness: 0.0,
      transparent: true,
      opacity: 0.52,
    });
    this.cloudMat = cloudMat;
    for (let c = 0; c < 6; c++) {
      const bank = new THREE.Group();
      const ang = (c / 6) * Math.PI * 2;
      const dist = 9.5 + (c % 2) * 3.0;
      for (let p = 0; p < 3; p++) {
        const puff = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.95 - p * 0.18, 1),
          cloudMat,
        );
        puff.position.set((p - 1) * 0.9, p === 1 ? 0.18 : 0, (p % 2) * 0.3);
        puff.scale.set(1.5, 0.45, 0.95);
        bank.add(puff);
      }
      bank.userData = {
        baseAngle: ang,
        dist,
        y: 3.1 + (c % 3) * 0.65,
        speed: 0.028 + (c % 2) * 0.014,
      };
      bank.position.set(
        Math.cos(ang) * dist,
        bank.userData.y,
        Math.sin(ang) * dist,
      );
      this.cloudBanks.push(bank);
      envGroup.add(bank);
    }

    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x2a2521,
      roughness: 0.92,
      metalness: 0.02,
    });
    for (let i = 0; i < 14; i++) {
      const ang = (i / 14) * Math.PI * 2;
      const dist = 14 + (i % 3) * 3.5;
      const h = 2.4 + ((i * 7) % 5) * 0.9;
      const rock = new THREE.Mesh(
        new THREE.ConeGeometry(2.6 + (i % 2) * 1.1, h, 7),
        rockMat,
      );
      rock.position.set(
        Math.cos(ang) * dist,
        h * 0.32 - 0.8,
        Math.sin(ang) * dist,
      );
      rock.rotation.y = i * 0.8;
      this.mountainRocksGroup.add(rock);
    }
    envGroup.add(this.mountainRocksGroup);

    const tartarusRockMat = new THREE.MeshStandardMaterial({
      color: 0x161822,
      roughness: 0.85,
      metalness: 0.14,
    });
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const dist = 5.4 + (i % 3) * 1.4;
      const h = 2.6 + (i % 4) * 0.85;
      const spire = new THREE.Mesh(
        new THREE.ConeGeometry(0.65 + (i % 2) * 0.35, h, 5),
        tartarusRockMat,
      );
      spire.position.set(
        Math.cos(ang) * dist,
        h * 0.45 - 0.15,
        Math.sin(ang) * dist - 0.4,
      );
      spire.rotation.set(((i % 3) - 1) * 0.08, i * 0.65, ((i % 2) - 0.5) * 0.12);
      this.tartarusRocksGroup.add(spire);
    }
    this.tartarusRocksGroup.visible = false;
    envGroup.add(this.tartarusRocksGroup);

    const step1 = new THREE.Mesh(
      new THREE.CylinderGeometry(3.6, 3.85, 0.18, 48),
      marbleMat,
    );
    step1.position.y = -0.09;
    step1.receiveShadow = true;
    envGroup.add(step1);

    const step2 = new THREE.Mesh(
      new THREE.CylinderGeometry(2.95, 3.1, 0.14, 48),
      marbleMat,
    );
    step2.position.y = 0.06;
    step2.receiveShadow = true;
    envGroup.add(step2);

    const inlayRing = new THREE.Mesh(
      new THREE.RingGeometry(1.75, 1.84, 64),
      new THREE.MeshStandardMaterial({
        color: 0xd9a441,
        roughness: 0.25,
        metalness: 0.9,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      }),
    );
    inlayRing.rotation.x = -Math.PI / 2;
    inlayRing.position.y = 0.135;
    envGroup.add(inlayRing);

    const colAngles = [-2.55, -2.0, -1.45, -0.95, 2.55, 2.0];
    colAngles.forEach((ang, idx) => {
      const colGroup = new THREE.Group();
      const radius = 3.25;
      const cx = Math.sin(ang) * radius;
      const cz = Math.cos(ang) * radius;

      const plinth = new THREE.Mesh(
        new THREE.BoxGeometry(0.56, 0.14, 0.56),
        marbleMat,
      );
      plinth.position.y = 0.07;
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      colGroup.add(plinth);

      const colHeight = idx === 0 || idx === 4 ? 2.55 : 3.45;
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.19, 0.23, colHeight, 16),
        marbleMat,
      );
      shaft.position.y = 0.14 + colHeight * 0.5;
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      colGroup.add(shaft);

      if (colHeight > 3.0) {
        const echinus = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.2, 0.14, 16),
          marbleMat,
        );
        echinus.position.y = 0.14 + colHeight + 0.07;
        colGroup.add(echinus);

        const abacus = new THREE.Mesh(
          new THREE.BoxGeometry(0.58, 0.12, 0.58),
          marbleMat,
        );
        abacus.position.y = 0.14 + colHeight + 0.2;
        abacus.castShadow = true;
        colGroup.add(abacus);
      }

      colGroup.position.set(cx, 0, cz);
      this.addContactShadow(colGroup, 0, 0.01, 0, 0.55, 0.4);
      this.columnsGroup.add(colGroup);
    });
    envGroup.add(this.columnsGroup);

    const brazier = this.brazierGroup;
    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.14, 0.18, 16),
      bronzeMat,
    );
    bowl.position.y = 0.85;
    bowl.castShadow = true;
    brazier.add(bowl);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.27, 0.025, 10, 24),
      goldMat,
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.94;
    brazier.add(rim);

    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.02, 0.85, 8),
        bronzeMat,
      );
      leg.position.set(Math.cos(a) * 0.18, 0.42, Math.sin(a) * 0.18);
      leg.rotation.z = Math.cos(a) * 0.14;
      leg.rotation.x = -Math.sin(a) * 0.14;
      leg.castShadow = true;
      brazier.add(leg);
    }

    const outerCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 0.42, 10),
      new THREE.MeshBasicMaterial({ color: 0xff7b1c, transparent: true, opacity: 0.88 }),
    );
    outerCone.position.y = 0.21;
    const innerCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.28, 8),
      new THREE.MeshBasicMaterial({ color: 0xffe484, transparent: true, opacity: 0.95 }),
    );
    innerCone.position.y = 0.16;
    this.brazierFlame.add(outerCone, innerCone);
    this.brazierFlame.position.y = 0.92;
    brazier.add(this.brazierFlame);
    brazier.position.set(-1.75, 0.13, 0.85);
    this.addContactShadow(brazier, 0, 0.01, 0, 0.45, 0.45);
    envGroup.add(brazier);

    const barkMat = new THREE.MeshStandardMaterial({ color: 0x4b3b2c, roughness: 0.92 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x6c845d, roughness: 0.72 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.18, 1.35, 10), barkMat);
    trunk.position.y = 0.67;
    trunk.rotation.z = -0.08;
    trunk.castShadow = true;
    this.oliveTree.add(trunk);
    const branch1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.85, 8), barkMat);
    branch1.position.set(0.24, 1.45, 0.08);
    branch1.rotation.z = -0.55;
    branch1.castShadow = true;
    this.oliveTree.add(branch1);
    const branch2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.75, 8), barkMat);
    branch2.position.set(-0.22, 1.4, -0.06);
    branch2.rotation.z = 0.5;
    branch2.castShadow = true;
    this.oliveTree.add(branch2);

    [
      [0, 2.0, 0, 0.56],
      [0.42, 1.82, 0.14, 0.42],
      [-0.38, 1.78, -0.1, 0.44],
      [0.14, 1.92, -0.32, 0.38],
      [-0.12, 1.95, 0.28, 0.36],
    ].forEach(([lx, ly, lz, lr]) => {
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(lr, 1), leafMat);
      puff.position.set(lx, ly, lz);
      puff.scale.set(1.15, 0.72, 1.05);
      puff.castShadow = true;
      this.oliveTree.add(puff);
    });

    this.oliveTree.position.set(2.35, 0.0, -1.35);
    this.addContactShadow(envGroup, 2.35, 0.02, -1.35, 0.9, 0.38);
    envGroup.add(this.oliveTree);

    this.buildSceneProps(envGroup);
    this.scene.add(envGroup);
  }

  private buildSceneProps(envGroup: THREE.Group): void {
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x1e1819,
      roughness: 0.45,
      metalness: 0.25,
    });
    const crimsonMat = new THREE.MeshStandardMaterial({
      color: 0x8b1e24,
      roughness: 0.6,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf5c84c,
      roughness: 0.2,
      metalness: 0.9,
    });
    const emeraldCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x065f46,
      emissiveIntensity: 0.65,
      roughness: 0.25,
    });
    const rockDarkMat = new THREE.MeshStandardMaterial({
      color: 0x3b3532,
      roughness: 0.9,
    });
    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.85,
    });

    // 1. Cosmos stars & earth crystals (Cảnh 01)
    const cosmos = new THREE.Group();
    const starMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (let i = 0; i < 12; i++) {
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.08 + (i % 3) * 0.03, 0), starMat);
      const a = (i / 12) * Math.PI * 2;
      star.position.set(Math.cos(a) * 3.1, 2.5 + (i % 4) * 0.45, Math.sin(a) * 2.4 - 0.8);
      cosmos.add(star);
    }
    for (let c = 0; c < 4; c++) {
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), emeraldCrystalMat);
      crystal.scale.set(0.65, 1.9, 0.65);
      crystal.position.set(-2.2 + c * 1.45, 0.35, -1.8 + (c % 2) * 0.3);
      cosmos.add(crystal);
    }
    this.propCosmosStars = cosmos;
    envGroup.add(cosmos);

    // 2. Sickle sky rift (Cảnh 02)
    const sickleGrp = new THREE.Group();
    const skyRift = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.055, 8, 36, Math.PI * 0.85),
      new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.72 }),
    );
    skyRift.position.set(0, 2.75, -1.6);
    skyRift.rotation.z = 0.25;
    sickleGrp.add(skyRift);
    this.propSickleArc = sickleGrp;
    envGroup.add(sickleGrp);

    // 3. Throne of Othrys (Cảnh 03, 04, 09, 18)
    const throne = new THREE.Group();
    throne.position.set(0, 0.13, -1.65);
    const dais = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 1.15), obsidianMat);
    dais.position.y = 0.11;
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.55, 0.75), obsidianMat);
    seat.position.y = 0.48;
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.75, 0.2), obsidianMat);
    back.position.set(0, 1.12, -0.32);
    const crest = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.045, 8, 20), goldMat);
    crest.position.set(0, 2.1, -0.32);
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.62), crimsonMat);
    cushion.position.set(0, 0.78, 0.02);
    throne.add(dais, seat, back, crest, cushion);
    this.propOthrysThrone = throne;
    envGroup.add(throne);

    // 4. Swaddled Omphalos pedestal (Cảnh 03, 05)
    const omphalos = new THREE.Group();
    omphalos.position.set(1.25, 0.13, -0.95);
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.34, 0.65, 14), rockDarkMat);
    ped.position.y = 0.32;
    const stone = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.16, 0.22, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0xefe6d5, roughness: 0.72 }),
    );
    stone.position.y = 0.8;
    stone.rotation.z = 0.25;
    omphalos.add(ped, stone);
    this.propOmphalos = omphalos;
    envGroup.add(omphalos);

    // 5. Crete cave wall sanctuary (Cảnh 06, 07)
    const crete = new THREE.Group();
    const creteStoneMat = new THREE.MeshStandardMaterial({
      color: 0x5c4f42,
      roughness: 0.92,
    });
    for (let r = 0; r < 9; r++) {
      const ang = -Math.PI * 0.88 + (r / 8) * Math.PI * 0.76;
      const wallBlock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.78 + (r % 2) * 0.28, 0),
        creteStoneMat,
      );
      wallBlock.position.set(
        Math.cos(ang) * 2.85,
        0.72 + Math.sin((r / 8) * Math.PI) * 0.95,
        Math.sin(ang) * 2.2 - 0.55,
      );
      wallBlock.scale.set(1.15, 1.45, 0.9);
      crete.add(wallBlock);
    }
    const campGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xfb923c }),
    );
    campGlow.position.set(-0.95, 0.28, 0.85);
    crete.add(campGlow);
    this.propCreteSanctuary = crete;
    envGroup.add(crete);

    // 5b. Curetes bronze shields & spears (Cảnh 06)
    const curetesGrp = new THREE.Group();
    [-2.05, -1.55, 1.55, 2.05].forEach((sx, idx) => {
      const shield = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.05, 18),
        goldMat,
      );
      shield.rotation.x = Math.PI / 2;
      shield.rotation.z = idx < 2 ? 0.22 : -0.22;
      shield.position.set(sx, 0.52, -0.85 + (idx % 2) * 0.35);
      const spear = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 1.75, 8),
        ironMat,
      );
      spear.position.set(sx + (idx < 2 ? -0.14 : 0.14), 0.92, -0.95);
      curetesGrp.add(shield, spear);
    });
    this.propCuretesShields = curetesGrp;
    envGroup.add(curetesGrp);

    // 5c. Metis coastal elixir pedestal (Cảnh 08)
    const elixirGrp = new THREE.Group();
    elixirGrp.position.set(0, 0.13, -0.65);
    const ePed = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.3, 0.72, 16),
      new THREE.MeshStandardMaterial({ color: 0xebe3d3, roughness: 0.45 }),
    );
    ePed.position.y = 0.36;
    const eCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.07, 0.22, 14),
      goldMat,
    );
    eCup.position.y = 0.84;
    const eGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x5eead4 }),
    );
    eGlow.position.y = 1.02;
    elixirGrp.add(ePed, eCup, eGlow);
    this.propElixirPedestal = elixirGrp;
    envGroup.add(elixirGrp);

    // 6. Twin Mountains Olympus vs Othrys (Cảnh 10, 11, 12)
    const twins = new THREE.Group();
    const olympusPeak = new THREE.Mesh(
      new THREE.ConeGeometry(1.5, 3.2, 6),
      new THREE.MeshStandardMaterial({ color: 0xe6dec8, roughness: 0.65 }),
    );
    olympusPeak.position.set(-2.35, 1.5, -2.5);
    const othrysPeak = new THREE.Mesh(
      new THREE.ConeGeometry(1.65, 3.4, 6),
      new THREE.MeshStandardMaterial({ color: 0x2c2020, roughness: 0.88 }),
    );
    othrysPeak.position.set(2.35, 1.6, -2.5);
    twins.add(olympusPeak, othrysPeak);
    this.propTwinPeaks = twins;
    envGroup.add(twins);

    // 7. Tartarus Gate & Chains (Cảnh 13, 14, 15, 16)
    const tartarus = new THREE.Group();
    [-1.4, 1.4].forEach((px) => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.45, 3.1, 0.45), ironMat);
      pillar.position.set(px, 1.55, -1.85);
      tartarus.add(pillar);
    });
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.38, 0.52), ironMat);
    lintel.position.set(0, 3.15, -1.85);
    tartarus.add(lintel);
    for (let ch = 0; ch < 5; ch++) {
      const link = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.032, 6, 14), ironMat);
      link.position.set(-0.9 + ch * 0.45, 2.75 - (ch % 2) * 0.22, -1.78);
      tartarus.add(link);
    }
    [-2.0, 2.0].forEach((cx) => {
      const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), emeraldCrystalMat);
      shard.scale.set(0.6, 2.1, 0.6);
      shard.position.set(cx, 0.45, -1.25);
      tartarus.add(shard);
    });
    this.propTartarusPit = tartarus;
    envGroup.add(tartarus);

    // 8. Cyclopes Forge (Cảnh 17)
    const forge = new THREE.Group();
    forge.position.set(0, 0.13, -1.35);
    const anvilBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 0.52, 8), rockDarkMat);
    anvilBase.position.y = 0.26;
    const anvilTop = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.28, 0.44), ironMat);
    anvilTop.position.y = 0.66;
    const magma = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.85, 0.08, 16),
      new THREE.MeshBasicMaterial({ color: 0xf97316 }),
    );
    magma.position.set(0, 0.04, 0.55);
    forge.add(anvilBase, anvilTop, magma);
    this.propCyclopesForge = forge;
    envGroup.add(forge);

    // 9. Boulder Storm (Cảnh 19, 21)
    const boulders = new THREE.Group();
    for (let b = 0; b < 9; b++) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.26 + (b % 3) * 0.09, 0),
        rockDarkMat,
      );
      const ang = (b / 9) * Math.PI * 2;
      rock.position.set(Math.cos(ang) * 2.2, 1.3 + (b % 3) * 0.65, Math.sin(ang) * 1.4 - 0.5);
      rock.userData = { angle: ang, radius: 1.9 + (b % 3) * 0.35, baseY: 1.2 + (b % 3) * 0.65 };
      boulders.add(rock);
    }
    this.propBoulderStorm = boulders;
    envGroup.add(boulders);

    // 10. Lightning Zenith Arcs (Cảnh 15, 20)
    const bolts = new THREE.Group();
    const boltMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (let l = 0; l < 4; l++) {
      const seg = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), boltMat);
      seg.scale.set(0.32, 8.5, 0.32);
      seg.position.set(-1.5 + l * 1.0, 2.55, -0.9 + (l % 2) * 0.4);
      seg.rotation.z = (l % 2 === 0 ? 1 : -1) * 0.24;
      bolts.add(seg);
    }
    this.propLightningZenith = bolts;
    envGroup.add(bolts);

    // 11. Olympus Dawn Throne & 3 Golden Relics (Cảnh 22)
    const olympus = new THREE.Group();
    olympus.position.set(0, 0.13, -1.6);
    const whiteMarble = new THREE.MeshStandardMaterial({ color: 0xf8f2e4, roughness: 0.35 });
    const oBase = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.24, 1.1), whiteMarble);
    oBase.position.y = 0.12;
    const oSeat = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.52, 0.72), whiteMarble);
    oSeat.position.y = 0.5;
    const oBack = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.7, 0.2), whiteMarble);
    oBack.position.set(0, 1.15, -0.3);
    const sunHalo = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.035, 8, 32), goldMat);
    sunHalo.position.set(0, 1.85, -0.32);
    olympus.add(oBase, oSeat, oBack, sunHalo);

    // Three cosmic relics hovering above
    const relicColors = [0xfde047, 0x38bdf8, 0xc084fc];
    relicColors.forEach((hex, idx) => {
      const gem = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.18, 0),
        new THREE.MeshBasicMaterial({ color: hex }),
      );
      gem.position.set((idx - 1) * 1.15, 2.35, 0.4);
      olympus.add(gem);
    });
    this.propOlympusRelics = olympus;
    envGroup.add(olympus);
  }

  private applyBackdropProps(backdrop: SceneBackdrop): void {
    const isTartarus =
      backdrop === 'tartarus_descent' ||
      backdrop === 'tartarus_gate_campe' ||
      backdrop === 'tartarus_lightning' ||
      backdrop === 'tartarus_freedom';

    this.oliveTree.visible = !isTartarus && backdrop !== 'boulder_storm' && backdrop !== 'cyclopes_forge';
    this.tartarusRocksGroup.visible = isTartarus;

    if (this.propCosmosStars) {
      this.propCosmosStars.visible =
        backdrop === 'cosmos_origin' || backdrop === 'sickle_sky_rift';
    }
    if (this.propSickleArc) {
      this.propSickleArc.visible = backdrop === 'sickle_sky_rift';
    }
    if (this.propOthrysThrone) {
      this.propOthrysThrone.visible =
        backdrop === 'othrys_prophecy' ||
        backdrop === 'othrys_banquet_dark' ||
        backdrop === 'othrys_liberation' ||
        backdrop === 'othrys_siege';
    }
    if (this.propOmphalos) {
      this.propOmphalos.visible =
        backdrop === 'othrys_prophecy' || backdrop === 'crete_night_escape';
    }
    if (this.propCreteSanctuary) {
      this.propCreteSanctuary.visible =
        backdrop === 'crete_sacred_cave' || backdrop === 'crete_storm_cliff';
    }
    if (this.propCuretesShields) {
      this.propCuretesShields.visible = backdrop === 'crete_sacred_cave';
    }
    if (this.propElixirPedestal) {
      this.propElixirPedestal.visible = backdrop === 'ocean_shore_elixir';
    }
    if (this.propTwinPeaks) {
      this.propTwinPeaks.visible =
        backdrop === 'twin_mountains' ||
        backdrop === 'thessaly_war_valley' ||
        backdrop === 'olympus_gaia_oracle';
    }
    if (this.propTartarusPit) {
      this.propTartarusPit.visible = isTartarus;
    }
    if (this.propCyclopesForge) {
      this.propCyclopesForge.visible = backdrop === 'cyclopes_forge';
    }
    if (this.propBoulderStorm) {
      this.propBoulderStorm.visible =
        backdrop === 'boulder_storm' || backdrop === 'cronus_abyss_fall';
    }
    if (this.propLightningZenith) {
      this.propLightningZenith.visible =
        backdrop === 'tartarus_lightning' || backdrop === 'lightning_zenith';
    }
    if (this.propOlympusRelics) {
      this.propOlympusRelics.visible = backdrop === 'olympus_dawn_throne';
    }
  }

  private applyEnvironmentAssets(
    backdrop: SceneBackdrop,
    environmentAssets?: EnvironmentAssetId[],
  ): void {
    if (!environmentAssets || environmentAssets.length === 0) {
      this.applyBackdropProps(backdrop);
      return;
    }

    const active = new Set<EnvironmentAssetId>(environmentAssets);

    const hasStormClouds = active.has('storm-clouds');
    const hasSkyClouds = active.has('sky-clouds');
    const showClouds = hasStormClouds || hasSkyClouds;
    const cloudLimit = hasStormClouds ? 6 : 4;
    if (this.cloudMat) {
      this.cloudMat.color.setHex(hasStormClouds ? 0x52525b : 0xf4efe6);
      this.cloudMat.opacity = hasStormClouds ? 0.72 : 0.52;
    }
    this.cloudBanks.forEach((bank, idx) => {
      bank.visible = showClouds && idx < cloudLimit;
    });

    this.mountainRocksGroup.visible = active.has('primordial-rock');
    this.mountainRocksGroup.children.forEach((child) => {
      child.visible = true;
    });
    this.tartarusRocksGroup.visible = active.has('tartarus-rock');

    const hasOlympusPillar = active.has('olympus-pillar');
    const hasOthrysPillar = active.has('othrys-pillar');
    this.columnsGroup.visible = hasOlympusPillar || hasOthrysPillar;
    if (this.columnMarbleMat) {
      this.columnMarbleMat.color.setHex(
        hasOthrysPillar && !hasOlympusPillar ? 0x3b2e2c : 0xf4eee3,
      );
    }
    this.columnsGroup.children.forEach((child) => {
      child.visible = true;
    });

    if (this.waterRing) {
      this.waterRing.visible = active.has('oceanus-water');
      (this.waterRing.material as THREE.MeshStandardMaterial).opacity = 0.86;
    }
    this.oliveTree.visible = active.has('olive-tree');
    this.brazierGroup.visible = active.has('sacred-brazier');

    if (this.propCosmosStars) {
      this.propCosmosStars.visible = active.has('cosmos-stars');
      this.propCosmosStars.children.forEach((child) => {
        child.visible = true;
      });
    }
    if (this.propSickleArc) this.propSickleArc.visible = active.has('sickle-sky-rift');
    if (this.propOthrysThrone) this.propOthrysThrone.visible = active.has('othrys-throne');
    if (this.propOmphalos) this.propOmphalos.visible = active.has('omphalos-stone');
    if (this.propCreteSanctuary) this.propCreteSanctuary.visible = active.has('crete-cave-wall');
    if (this.propCuretesShields) this.propCuretesShields.visible = active.has('curetes-shields');
    if (this.propElixirPedestal) this.propElixirPedestal.visible = active.has('elixir-pedestal');
    if (this.propTwinPeaks) this.propTwinPeaks.visible = active.has('twin-mountains');
    if (this.propTartarusPit) this.propTartarusPit.visible = active.has('tartarus-gate');
    if (this.propCyclopesForge) this.propCyclopesForge.visible = active.has('cyclopes-forge');
    if (this.propBoulderStorm) {
      this.propBoulderStorm.visible = active.has('boulder-storm');
      this.propBoulderStorm.children.forEach((child) => {
        child.visible = true;
      });
    }
    if (this.propLightningZenith) {
      this.propLightningZenith.visible = active.has('lightning-arcs');
      this.propLightningZenith.children.forEach((child) => {
        child.visible = true;
      });
    }
    if (this.propOlympusRelics) this.propOlympusRelics.visible = active.has('olympus-throne');
  }

  public setScene(
    actors: SceneActor[],
    backdrop: SceneBackdrop,
    atmosphere: ChapterAtmosphere,
    viewMode: StageViewMode,
    interaction: SceneInteraction = 'solo',
    environmentAssets?: EnvironmentAssetId[],
  ): void {
    this.activeActors = actors.length > 0 ? actors : [{ id: 'zeus', expression: 'serene', role: 'center', motion: 'pace' }];
    this.activeBackdrop = backdrop;
    this.activeAtmosphere = atmosphere;
    this.viewMode = viewMode;
    this.activeInteraction = interaction;

    (Object.keys(this.characters) as StageCharacterId[]).forEach((id) => {
      this.characters[id].visible = this.activeActors.some((a) => a.id === id);
    });
    const zeusActor = this.activeActors.find((a) => a.id === 'zeus');
    if (zeusActor) {
      applyZeusVariantToRig(this.rigs.zeus, zeusActor.variant ?? 'warrior');
    }
    this.applyEnvironmentAssets(backdrop, environmentAssets);

    const isCinema = viewMode === 'CINEMA';
    this.controls.enabled = isCinema;
    if (!isCinema) {
      this.userOrbiting = false;
    }
  }

  public triggerReaction(): void {
    this.reactionTimer = 1.0;
  }

  public triggerSceneAction(): void {
    this.actionBeatTimer = 1.0;
    this.reactionTimer = 0.85;
  }

  public setActiveSpeaker(speakerId: StageCharacterId | null): void {
    this.activeSpeakerId = speakerId;
  }

  private bindEvents(): void {
    const onResize = () => {
      if (this.disposed) return;
      const w = Math.max(1, this.container.clientWidth);
      const h = Math.max(1, this.container.clientHeight);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const canvas = this.renderer.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
      this.onContextLostCallback?.(true);
    };
    const onRestored = () => {
      this.onContextLostCallback?.(false);
    };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    this.cleanupListeners = () => {
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }

  private cleanupListeners: () => void = () => {};

  private afterDraw(cb: () => void): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    if (gl && typeof gl.fenceSync === 'function') {
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (this.disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          this.frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          this.frameId = window.setTimeout(cb, 80);
        }
      };
      this.frameId = window.setTimeout(poll, 5);
    } else {
      this.frameId = window.setTimeout(cb, 80);
    }
  }

  private tick = (): void => {
    if (this.disposed) return;

    const now = performance.now();
    const rawDt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    const dt = Math.min(rawDt, 0.05);
    if (!this.reducedMotion) {
      this.elapsed += dt;
    }

    const t = this.elapsed;

    const pal = ATMOSPHERES[this.activeAtmosphere];
    const bg = this.scene.background as THREE.Color;
    _color.setHex(pal.skyHex);
    bg.lerp(_color, 1 - Math.exp(-2.2 * dt));

    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.copy(bg);
      this.scene.fog.density = THREE.MathUtils.damp(
        this.scene.fog.density,
        pal.fogDensity,
        2.5,
        dt,
      );
    }

    _color.setHex(pal.sunHex);
    this.sunLight.color.lerp(_color, 1 - Math.exp(-2.5 * dt));
    this.sunLight.intensity = THREE.MathUtils.damp(
      this.sunLight.intensity,
      pal.sunIntensity,
      2.5,
      dt,
    );

    _color.setHex(pal.hemiSkyHex);
    this.hemiLight.color.lerp(_color, 1 - Math.exp(-2.5 * dt));
    _color.setHex(pal.hemiGroundHex);
    this.hemiLight.groundColor.lerp(_color, 1 - Math.exp(-2.5 * dt));

    if (this.reactionTimer > 0) {
      this.reactionTimer = Math.max(0, this.reactionTimer - dt * 1.4);
    }
    if (this.actionBeatTimer > 0) {
      this.actionBeatTimer = Math.max(0, this.actionBeatTimer - dt * 0.42);
    }
    const beatBoost = Math.sin(this.actionBeatTimer * Math.PI);
    const flare = Math.sin(this.reactionTimer * Math.PI) * 2.2;
    _color.setHex(pal.accentHex);
    this.accentLight.color.lerp(_color, 1 - Math.exp(-3 * dt));
    this.accentLight.intensity = 2.1 + Math.sin(t * 7.5) * 0.25 + flare;

    this.brazierFlame.scale.set(
      1 + Math.sin(t * 9.0) * 0.08,
      1 + Math.cos(t * 11.3) * 0.14,
      1 + Math.sin(t * 8.2) * 0.08,
    );
    this.oliveTree.rotation.z = Math.sin(t * 0.9) * 0.022;

    for (let c = 0; c < this.cloudBanks.length; c++) {
      const bank = this.cloudBanks[c];
      const d = bank.userData;
      const a = d.baseAngle + t * d.speed;
      bank.position.set(
        Math.cos(a) * d.dist,
        d.y + Math.sin(t * 0.45 + c) * 0.12,
        Math.sin(a) * d.dist,
      );
      bank.lookAt(0, bank.position.y, 0);
    }

    if (this.waterRing) {
      const wMat = this.waterRing.material as THREE.MeshStandardMaterial;
      _color.setHex(pal.waterHex);
      wMat.color.lerp(_color, 1 - Math.exp(-2.2 * dt));
      this.waterRing.position.y = -0.095 + Math.sin(t * 1.4) * 0.015;
      this.waterRing.rotation.z = t * 0.025;
    }

    if (this.propBoulderStorm && this.propBoulderStorm.visible) {
      this.propBoulderStorm.rotation.y = t * 0.42;
      for (let b = 0; b < this.propBoulderStorm.children.length; b++) {
        const rock = this.propBoulderStorm.children[b];
        rock.rotation.x = t * 1.4 + b;
        rock.rotation.z = t * 1.1 + b;
        rock.position.y = (rock.userData.baseY ?? 1.5) + Math.sin(t * 2.2 + b) * 0.25;
      }
    }
    if (this.propLightningZenith && this.propLightningZenith.visible) {
      const pulse = 0.72 + Math.abs(Math.sin(t * 9.5)) * 0.48;
      this.propLightningZenith.scale.set(pulse, 1, pulse);
    }
    if (this.propOlympusRelics && this.propOlympusRelics.visible) {
      const children = this.propOlympusRelics.children;
      for (let r = 4; r < children.length; r++) {
        children[r].rotation.y = t * 1.3 + r;
        children[r].position.y = 2.35 + Math.sin(t * 2.1 + r * 1.4) * 0.14;
      }
    }
    if (this.propCosmosStars && this.propCosmosStars.visible) {
      this.propCosmosStars.rotation.y = t * 0.06;
    }

    const cast = this.activeActors;
    const count = cast.length;

    for (let k = 0; k < count; k++) {
      const actor = cast[k];
      const id = actor.id;
      const rig = this.rigs[id];
      if (!rig) continue;

      let baseX = 0;
      let baseZ = 0;
      let targetRotY = 0;

      if (count === 1) {
        baseX = 0;
        baseZ = 0.1;
        targetRotY = Math.sin(t * 0.35) * 0.12;
      } else if (count === 2) {
        if (actor.role === 'left' || k === 0) {
          baseX = -0.92;
          baseZ = 0.14;
          targetRotY = 0.58;
        } else {
          baseX = 0.92;
          baseZ = 0.14;
          targetRotY = -0.58;
        }
      } else {
        switch (actor.role) {
          case 'left':
            baseX = -1.52;
            baseZ = 0.42;
            targetRotY = 0.65;
            break;
          case 'back-left':
            baseX = -0.78;
            baseZ = -0.72;
            targetRotY = 0.34;
            break;
          case 'back-right':
            baseX = 0.78;
            baseZ = -0.72;
            targetRotY = -0.34;
            break;
          case 'right':
            baseX = 1.52;
            baseZ = 0.42;
            targetRotY = -0.65;
            break;
          case 'center':
          default:
            baseX = 0;
            baseZ = 0.16;
            targetRotY = 0;
            break;
        }
      }

      const phase = k * 1.65;
      const inwardSign = baseX < -0.1 ? 1 : baseX > 0.1 ? -1 : 0;
      let motionX = 0;
      let motionY = 0;
      let motionZ = 0;
      let bodyLean = 0;
      let armAngleX = Math.sin(t * 1.5 + phase) * 0.1;
      let leftArmAngleX =
        id === 'curetes'
          ? -0.36 + Math.sin(t * 3.8 + phase) * 0.22
          : Math.sin(t * 1.4 + phase) * 0.09;
      const isSpeaking = this.activeSpeakerId === id;

      const mot: ActorMotion = actor.motion;
      if (mot === 'pace') {
        motionX = Math.sin(t * 1.4 + phase) * 0.22;
        motionY = Math.abs(Math.sin(t * 2.8 + phase)) * 0.04;
      } else if (mot === 'advance') {
        motionX = inwardSign * (0.14 + Math.sin(t * 1.7 + phase) * 0.12 + beatBoost * 0.14);
        motionZ = 0.06 + beatBoost * 0.12;
        bodyLean = 0.08 + beatBoost * 0.06;
      } else if (mot === 'offer') {
        motionX = inwardSign * (0.14 + beatBoost * 0.1);
        armAngleX = -0.52 + Math.sin(t * 2.1 + phase) * 0.14 - beatBoost * 0.28;
        leftArmAngleX = -0.34 - beatBoost * 0.24;
        bodyLean = 0.06 + beatBoost * 0.06;
      } else if (mot === 'lunge') {
        const dash = Math.max(0, Math.sin(t * 3.3 + phase));
        motionX = inwardSign * (dash * 0.36 + beatBoost * 0.22);
        motionZ = dash * 0.12 + beatBoost * 0.14;
        bodyLean = 0.18 + beatBoost * 0.12;
        armAngleX = -0.45 + Math.sin(t * 5.2 + phase) * 0.46 - beatBoost * 0.38;
      } else if (mot === 'recoil') {
        motionX = -inwardSign * (0.16 + Math.abs(Math.sin(t * 2.2 + phase)) * 0.14 + beatBoost * 0.18);
        motionZ = -0.12 - beatBoost * 0.12;
        bodyLean = -0.14 - beatBoost * 0.12;
        armAngleX = -0.22 - beatBoost * 0.25;
        leftArmAngleX = -0.22 - beatBoost * 0.2;
      } else if (mot === 'rally') {
        motionY = 0.08 + Math.abs(Math.sin(t * 2.1 + phase)) * 0.1 + beatBoost * 0.12;
        armAngleX = -0.68 + Math.sin(t * 2.6 + phase) * 0.12 - beatBoost * 0.42;
        leftArmAngleX = -0.32 - beatBoost * 0.32;
        bodyLean = -0.06;
      } else if (mot === 'hover') {
        motionY = 0.16 + Math.sin(t * 1.6 + phase) * 0.12 + beatBoost * 0.14;
      } else {
        motionX = Math.sin(t * 1.05 + phase) * 0.06;
      }

      // Scene-specific choreography synchronized with story events
      const bd = this.activeBackdrop;
      if (bd === 'sickle_sky_rift' && id === 'cronus') {
        armAngleX = -0.85 + Math.sin(t * 4.4) * 0.72 - beatBoost * 0.45;
        bodyLean += 0.14;
      } else if (bd === 'crete_sacred_cave' && id === 'curetes') {
        const beat = Math.sin(t * 5.6);
        armAngleX = -0.58 + beat * 0.42;
        leftArmAngleX = -0.58 - beat * 0.42;
      } else if (bd === 'crete_storm_cliff' && id === 'zeus') {
        armAngleX = -0.78 + Math.sin(t * 3.0) * 0.24 - beatBoost * 0.35;
        leftArmAngleX = -0.45 - beatBoost * 0.25;
      } else if (bd === 'ocean_shore_elixir' && id === 'metis') {
        armAngleX = -0.82 - beatBoost * 0.25;
        leftArmAngleX = -0.42;
      } else if (bd === 'othrys_liberation' && id === 'cronus') {
        bodyLean = 0.22 + Math.sin(t * 6.5) * 0.06;
        motionY -= 0.05;
      } else if ((bd === 'tartarus_gate_campe' || bd === 'tartarus_lightning') && id === 'campe') {
        armAngleX = -0.7 + Math.sin(t * 5.8) * 0.65;
        leftArmAngleX = -0.4 + Math.cos(t * 5.4) * 0.35;
      } else if (bd === 'cyclopes_forge' && (id === 'brontes' || id === 'arges' || id === 'steropes')) {
        const strike = Math.sin(t * 4.8 + phase);
        armAngleX = -0.65 + strike * 0.78;
        bodyLean = 0.12 + Math.max(0, strike) * 0.12;
      } else if (bd === 'boulder_storm' && (id === 'cottus' || id === 'briareus' || id === 'gyges')) {
        armAngleX = -1.05 + Math.sin(t * 4.2 + phase) * 0.45;
        leftArmAngleX = -0.95 + Math.cos(t * 4.2 + phase) * 0.45;
      } else if ((bd === 'tartarus_lightning' || bd === 'lightning_zenith') && id === 'zeus') {
        armAngleX = -1.1 + Math.sin(t * 5.0) * 0.32 - beatBoost * 0.35;
        motionY += 0.1 + beatBoost * 0.18;
      } else if (bd === 'olympus_dawn_throne' && id === 'zeus') {
        armAngleX = -0.92 + Math.sin(t * 2.0) * 0.12 - beatBoost * 0.3;
      }

      if (isSpeaking) {
        motionZ += 0.14;
        armAngleX -= 0.24 + Math.sin(t * 5.2) * 0.18;
        leftArmAngleX -= 0.14 + Math.cos(t * 4.4) * 0.14;
      }

      rig.root.position.x = THREE.MathUtils.damp(rig.root.position.x, baseX + motionX, 4.5, dt);
      rig.root.position.y = THREE.MathUtils.damp(rig.root.position.y, rig.baseY + motionY, 4.5, dt);
      rig.root.position.z = THREE.MathUtils.damp(rig.root.position.z, baseZ + motionZ, 4.5, dt);
      rig.root.rotation.y = THREE.MathUtils.damp(rig.root.rotation.y, targetRotY, 4.5, dt);

      const interactNod = isSpeaking
        ? Math.sin(t * 6.4) * 0.11
        : this.activeInteraction === 'converse' || this.activeInteraction === 'gift'
          ? Math.sin(t * 2.1 + phase) * 0.08
          : Math.sin(t * 1.1 + phase) * 0.035;

      rig.torso.position.y = Math.sin(t * 1.55 + phase) * 0.025;
      rig.torso.rotation.x = THREE.MathUtils.damp(rig.torso.rotation.x, bodyLean, 5, dt);
      rig.torso.rotation.y = Math.sin(t * 0.55 + phase) * 0.07;
      rig.cloak.rotation.z = Math.sin(t * 1.35 + phase) * 0.035;

      // Facial expressions & head pose
      const expr: CharacterExpression = actor.expression;
      const isBlinking = (t + phase) % 3.8 > 3.66;
      let headPitch = interactNod;
      let headRoll = 0;
      let browAngle = 0;
      let browLift = 0;
      let eyeScaleY = 1.0;
      let eyeScaleX = 1.0;
      let mouthSX = 1.0;
      let mouthSY = 1.0;

      if (expr === 'fierce') {
        headPitch += 0.08;
        browAngle = -0.28;
        browLift = -0.012;
        eyeScaleY = 0.72;
        mouthSX = 1.18;
        mouthSY = 0.65;
      } else if (expr === 'sorrow') {
        headPitch += 0.2;
        browAngle = 0.22;
        browLift = -0.004;
        eyeScaleY = 0.85;
        mouthSX = 0.78;
        mouthSY = 0.68;
      } else if (expr === 'fear') {
        headPitch -= 0.12;
        browAngle = 0.12;
        browLift = 0.024;
        eyeScaleX = 1.35;
        eyeScaleY = 1.38;
        mouthSX = 0.85;
        mouthSY = 1.85;
      } else if (expr === 'wise') {
        headRoll = 0.07;
        browAngle = 0.06;
        browLift = 0.006;
        mouthSX = 0.95;
        mouthSY = 0.8;
      } else if (expr === 'triumph') {
        headPitch -= 0.1;
        browLift = 0.016;
        mouthSX = 1.28;
        mouthSY = 1.15;
      }

      if (isSpeaking) {
        mouthSX = 1.05 + Math.abs(Math.sin(t * 9.5)) * 0.35;
        mouthSY = 1.1 + Math.abs(Math.sin(t * 15.2)) * 1.55;
      }

      if (isBlinking) {
        eyeScaleY = 0.12;
      }

      rig.head.rotation.y = isSpeaking
        ? Math.sin(t * 2.4) * 0.14
        : Math.sin(t * 0.72 + phase) * 0.11;
      rig.head.rotation.x = THREE.MathUtils.damp(rig.head.rotation.x, headPitch, 6, dt);
      rig.head.rotation.z = THREE.MathUtils.damp(rig.head.rotation.z, headRoll, 6, dt);

      rig.eyeLeft.scale.set(eyeScaleX, eyeScaleY, 1);
      if (rig.eyeRight) {
        rig.eyeRight.scale.set(eyeScaleX, eyeScaleY, 1);
      }

      if (rig.leftBrow.userData.baseY === undefined) {
        rig.leftBrow.userData.baseY = rig.leftBrow.position.y;
      }
      const leftBrowBaseY = rig.leftBrow.userData.baseY as number;

      if (rig.isCyclops) {
        rig.leftBrow.position.y = leftBrowBaseY + browLift;
        rig.leftBrow.rotation.z = expr === 'fierce' ? -0.14 : 0;
      } else {
        rig.leftBrow.position.y = leftBrowBaseY + browLift;
        rig.leftBrow.rotation.z = Math.PI / 2 + browAngle;
        if (rig.rightBrow) {
          if (rig.rightBrow.userData.baseY === undefined) {
            rig.rightBrow.userData.baseY = rig.rightBrow.position.y;
          }
          const rightBrowBaseY = rig.rightBrow.userData.baseY as number;
          rig.rightBrow.position.y = rightBrowBaseY + browLift + (expr === 'wise' ? 0.01 : 0);
          rig.rightBrow.rotation.z = Math.PI / 2 - browAngle;
        }
      }
      rig.mouth.scale.set(mouthSX, mouthSY, 1);

      if (rig.leftLeg && rig.rightLeg) {
        const strideAmp =
          mot === 'pace' || mot === 'advance'
            ? 0.22
            : mot === 'lunge'
              ? 0.34
              : mot === 'recoil'
                ? 0.16
                : 0.03;
        const strideFreq = mot === 'lunge' ? 5.2 : 2.8;
        const stride = Math.sin(t * strideFreq + phase) * strideAmp;
        rig.leftLeg.rotation.x = THREE.MathUtils.damp(rig.leftLeg.rotation.x, stride, 6, dt);
        rig.rightLeg.rotation.x = THREE.MathUtils.damp(rig.rightLeg.rotation.x, -stride, 6, dt);
      }

      if (rig.rightArm) {
        rig.rightArm.rotation.x = THREE.MathUtils.damp(rig.rightArm.rotation.x, armAngleX, 6, dt);
      }
      if (rig.leftArm) {
        rig.leftArm.rotation.x = THREE.MathUtils.damp(rig.leftArm.rotation.x, leftArmAngleX, 6, dt);
      }
      if (rig.wingLeft && rig.wingRight) {
        const flapSpeed = bd === 'tartarus_gate_campe' || bd === 'tartarus_lightning' ? 5.4 : 2.4;
        rig.wingLeft.rotation.y = 0.2 + Math.sin(t * flapSpeed) * 0.28;
        rig.wingRight.rotation.y = -0.2 - Math.sin(t * flapSpeed) * 0.28;
      }
      if (rig.extraGroup) {
        if (rig.extraGroup.userData.baseY === undefined) {
          rig.extraGroup.userData.baseY = rig.extraGroup.position.y;
        }
        const extraBaseY = rig.extraGroup.userData.baseY as number;
        if (id === 'cottus' || id === 'briareus' || id === 'gyges') {
          const heaveAmp = bd === 'boulder_storm' ? 0.19 : 0.11;
          rig.extraGroup.rotation.z = Math.sin(t * (bd === 'boulder_storm' ? 3.8 : 2.0) + phase) * heaveAmp;
          rig.extraGroup.position.y = extraBaseY + Math.sin(t * 2.6 + phase) * (bd === 'boulder_storm' ? 0.1 : 0.05);
        } else if (id === 'amalthea') {
          rig.extraGroup.rotation.z = Math.sin(t * 3.4 + phase) * 0.08;
        } else {
          rig.extraGroup.position.y = extraBaseY + Math.sin(t * 2.1 + phase) * 0.04;
        }
      }
      if (rig.halo) {
        rig.halo.rotation.z = t * 0.28;
      }
      if (rig.wisps) {
        rig.wisps.rotation.y = -t * 0.52;
      }
    }

    const moteMat = this.motesMesh.material as THREE.MeshBasicMaterial;
    _color.setHex(pal.moteHex);
    moteMat.color.lerp(_color, 1 - Math.exp(-2.5 * dt));

    for (let i = 0; i < this.moteCount; i++) {
      const m = this.moteData[i];
      const yCycle = ((m.y + t * m.speed * (1 + flare * 0.35)) % 4.1) + 0.2;
      const ang = m.angle + t * 0.14;
      _vec3.set(
        Math.cos(ang) * m.radius,
        yCycle,
        Math.sin(ang) * m.radius,
      );
      _quat.setFromEuler(new THREE.Euler(t * 0.7 + m.phase, t * 0.9, 0));
      const pulse = m.scale * (0.75 + 0.35 * Math.sin(t * 2.2 + m.phase));
      _scale.set(pulse, pulse, pulse);
      _mat4.compose(_vec3, _quat, _scale);
      this.motesMesh.setMatrixAt(i, _mat4);
    }
    this.motesMesh.instanceMatrix.needsUpdate = true;

    const crowded = this.activeActors.length >= 3;
    if (this.viewMode === 'TITLE') {
      _targetPos.set(
        Math.sin(t * 0.22) * 1.15 - 0.35,
        2.35 + Math.sin(t * 0.35) * 0.12,
        6.4,
      );
      _targetLook.set(-0.65, 1.35, 0);
      this.camera.position.lerp(_targetPos, 1 - Math.exp(-2.5 * dt));
      this.controls.target.lerp(_targetLook, 1 - Math.exp(-3.0 * dt));
      this.camera.lookAt(this.controls.target);
    } else if (this.viewMode === 'READING') {
      const swayX = Math.sin(t * 0.3) * 0.24;
      const narrow = this.container.clientWidth < 960;
      _targetPos.set(
        narrow ? 0.1 : (crowded ? 1.25 : 1.1) + swayX,
        narrow ? 2.65 : crowded ? 2.35 : 2.15,
        narrow ? (crowded ? 7.3 : 6.4) : crowded ? 6.25 : 5.45,
      );
      _targetLook.set(narrow ? 0 : crowded ? 1.52 : 1.35, 1.25, 0);
      this.camera.position.lerp(_targetPos, 1 - Math.exp(-3.2 * dt));
      this.controls.target.lerp(_targetLook, 1 - Math.exp(-3.5 * dt));
      this.camera.lookAt(this.controls.target);
    } else {
      if (!this.userOrbiting) {
        _targetPos.set(0.35, crowded ? 2.35 : 2.15, crowded ? 6.0 : 5.1);
        _targetLook.set(0, 1.25, 0);
        this.camera.position.lerp(_targetPos, 1 - Math.exp(-3.2 * dt));
        this.controls.target.lerp(_targetLook, 1 - Math.exp(-3.5 * dt));
      }
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    this.cleanupListeners();
    this.controls.dispose();
    this.marbleTex.dispose();
    this.shadowTex.dispose();
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
