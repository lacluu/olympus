import * as THREE from 'three';
import type { ZeusVariant } from '../data/characters';

export type StageCharacterId =
  | 'zeus'
  | 'cronus'
  | 'rhea'
  | 'gaia'
  | 'uranus'
  | 'metis'
  | 'poseidon'
  | 'hades'
  | 'hera'
  | 'demeter'
  | 'hestia'
  | 'brontes'
  | 'steropes'
  | 'arges'
  | 'cottus'
  | 'briareus'
  | 'gyges'
  | 'campe'
  | 'prometheus'
  | 'amalthea'
  | 'curetes';

export interface FaceControls {
  head: THREE.Group;
  eyeLeft: THREE.Object3D;
  eyeRight?: THREE.Object3D;
  leftBrow: THREE.Object3D;
  rightBrow?: THREE.Object3D;
  mouth: THREE.Object3D;
  isCyclops?: boolean;
}

export interface ZeusVariantRig {
  active: ZeusVariant;
  childGroup: THREE.Group;
  adultGroup: THREE.Group;
  childFace: FaceControls;
  adultFace: FaceControls;
  beardGroup: THREE.Group;
  warriorArmor: THREE.Group;
  kingRegalia: THREE.Group;
  laurelCrown: THREE.Group;
  thunderbolt: THREE.Group;
  kingScepter: THREE.Group;
}

export interface CharacterRig {
  root: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  cloak: THREE.Object3D;
  baseY: number;
  eyeLeft: THREE.Object3D;
  eyeRight?: THREE.Object3D;
  leftBrow: THREE.Object3D;
  rightBrow?: THREE.Object3D;
  mouth: THREE.Object3D;
  isCyclops?: boolean;
  isQuadruped?: boolean;
  leftArm?: THREE.Group;
  rightArm?: THREE.Group;
  leftLeg?: THREE.Group;
  rightLeg?: THREE.Group;
  wingLeft?: THREE.Group;
  wingRight?: THREE.Group;
  extraGroup?: THREE.Group;
  halo?: THREE.Object3D;
  wisps?: THREE.Group;
  zeusControl?: ZeusVariantRig;
}

function addContactShadow(
  parent: THREE.Object3D,
  shadowTex: THREE.Texture,
  x: number,
  y: number,
  z: number,
  radius: number,
  opacity = 0.45,
): void {
  const geo = new THREE.PlaneGeometry(radius * 2, radius * 2);
  const mat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity,
  });
  const plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(x, y, z);
  parent.add(plane);
}

/**
 * Sculpted anatomical face: nose bridge, brow bone, sclera + colored iris, sculpted brows & expressive mouth.
 */
function buildSculptedFace(
  head: THREE.Group,
  headRadius: number,
  skinMat: THREE.Material,
  eyeHex: number,
  browHex: number,
  options?: {
    isCyclops?: boolean;
    mouthHex?: number;
    glowEyes?: boolean;
  },
): FaceControls {
  const isCyclops = options?.isCyclops ?? false;
  const browMat = new THREE.MeshStandardMaterial({ color: browHex, roughness: 0.72 });
  const mouthMat = new THREE.MeshStandardMaterial({
    color: options?.mouthHex ?? 0x5c2b21,
    roughness: 0.62,
  });
  const zFace = headRadius * 0.9;

  // Ears
  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(
      new THREE.SphereGeometry(headRadius * 0.16, 8, 8),
      skinMat,
    );
    ear.scale.set(0.45, 1.15, 0.7);
    ear.position.set(side * headRadius * 0.96, -0.01, -0.01);
    head.add(ear);
  });

  // Defined Jawline & Chin
  const jaw = new THREE.Mesh(
    new THREE.CylinderGeometry(headRadius * 0.76, headRadius * 0.5, headRadius * 0.55, 12),
    skinMat,
  );
  jaw.position.set(0, -headRadius * 0.5, headRadius * 0.14);
  jaw.scale.set(0.95, 1, 0.88);
  head.add(jaw);

  // Sculpted Nose Bridge
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(headRadius * 0.13, headRadius * 0.42, 4),
    skinMat,
  );
  nose.rotation.x = 0.28;
  nose.rotation.y = Math.PI / 4;
  nose.position.set(0, -headRadius * 0.08, zFace + headRadius * 0.06);
  head.add(nose);

  if (isCyclops) {
    const scleraMat = new THREE.MeshBasicMaterial({ color: 0xfef3c7 });
    const eyeLeft = new THREE.Mesh(
      new THREE.SphereGeometry(headRadius * 0.3, 14, 14),
      scleraMat,
    );
    eyeLeft.scale.set(1.15, 0.9, 0.55);
    eyeLeft.position.set(0, headRadius * 0.18, zFace * 0.98);

    const iris = new THREE.Mesh(
      new THREE.SphereGeometry(headRadius * 0.17, 12, 12),
      new THREE.MeshBasicMaterial({ color: eyeHex }),
    );
    iris.position.set(0, 0, headRadius * 0.18);
    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(headRadius * 0.08, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x1c1917 }),
    );
    pupil.position.set(0, 0, headRadius * 0.12);
    iris.add(pupil);
    eyeLeft.add(iris);

    const leftBrow = new THREE.Mesh(
      new THREE.BoxGeometry(headRadius * 0.78, 0.032, 0.036),
      browMat,
    );
    leftBrow.position.set(0, headRadius * 0.52, zFace + 0.02);

    const mouth = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.015, headRadius * 0.36, 4, 8),
      mouthMat,
    );
    mouth.rotation.z = Math.PI / 2;
    mouth.position.set(0, -headRadius * 0.42, zFace * 0.98);

    head.add(eyeLeft, leftBrow, mouth);
    return { head, eyeLeft, leftBrow, mouth, isCyclops: true };
  }

  const scleraMat = new THREE.MeshBasicMaterial({ color: 0xfafafa });
  const irisMat = options?.glowEyes
    ? new THREE.MeshBasicMaterial({ color: eyeHex })
    : new THREE.MeshStandardMaterial({
        color: eyeHex,
        emissive: eyeHex,
        emissiveIntensity: 0.25,
        roughness: 0.25,
      });

  const makeEye = (side: -1 | 1) => {
    const eyeGrp = new THREE.Group();
    eyeGrp.position.set(side * headRadius * 0.35, headRadius * 0.06, zFace * 0.96);

    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.029, 10, 10), scleraMat);
    sclera.scale.set(1.22, 0.86, 0.55);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.017, 10, 10), irisMat);
    iris.position.z = 0.014;
    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.0085, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x111111 }),
    );
    pupil.position.z = 0.011;
    iris.add(pupil);
    eyeGrp.add(sclera, iris);
    return eyeGrp;
  };

  const eyeLeft = makeEye(-1);
  const eyeRight = makeEye(1);

  const browGeo = new THREE.CapsuleGeometry(0.009, 0.056, 4, 6);
  const leftBrow = new THREE.Mesh(browGeo, browMat);
  leftBrow.rotation.z = Math.PI / 2;
  leftBrow.position.set(-headRadius * 0.35, headRadius * 0.28, zFace + 0.014);

  const rightBrow = new THREE.Mesh(browGeo, browMat);
  rightBrow.rotation.z = Math.PI / 2;
  rightBrow.position.set(headRadius * 0.35, headRadius * 0.28, zFace + 0.014);

  const mouth = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.011, 0.052, 4, 8),
    mouthMat,
  );
  mouth.rotation.z = Math.PI / 2;
  mouth.position.set(0, -headRadius * 0.42, zFace + 0.005);

  head.add(eyeLeft, eyeRight, leftBrow, rightBrow, mouth);
  return { head, eyeLeft, eyeRight, leftBrow, rightBrow, mouth };
}

/**
 * Layered flowing hair silhouette (cap + back volume + side locks/curls/braids)
 */
function addHairLocks(
  head: THREE.Group,
  headRadius: number,
  hairMat: THREE.Material,
  style:
    | 'curly_shoulder'
    | 'wild_long'
    | 'braids_twin'
    | 'vine_long'
    | 'chignon_updo'
    | 'low_bun'
    | 'sleek_shoulder'
    | 'short_rough'
    | 'tied_back'
    | 'veiled',
): void {
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(headRadius * 1.07, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.62),
    hairMat,
  );
  cap.position.set(0, 0.025, -0.02);
  head.add(cap);

  if (style === 'curly_shoulder' || style === 'wild_long' || style === 'sleek_shoulder') {
    const lockCount = style === 'wild_long' ? 7 : 5;
    for (let i = 0; i < lockCount; i++) {
      const ang = -Math.PI * 0.8 + (i / (lockCount - 1)) * Math.PI * 1.6;
      const len = style === 'wild_long' ? 0.36 : 0.26;
      const lock = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.042, len, 4, 8),
        hairMat,
      );
      lock.position.set(
        Math.sin(ang) * headRadius * 0.92,
        -0.11,
        -Math.abs(Math.cos(ang)) * headRadius * 0.85 - 0.04,
      );
      lock.rotation.z = Math.sin(ang) * 0.18;
      head.add(lock);
    }
  } else if (style === 'braids_twin') {
    [-1, 1].forEach((side) => {
      for (let b = 0; b < 4; b++) {
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.046 - b * 0.005, 8, 8), hairMat);
        bead.position.set(side * (headRadius * 0.96), -0.05 - b * 0.085, -0.04 - b * 0.02);
        head.add(bead);
      }
      // Face-framing curl
      const curl = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.14, 4, 6), hairMat);
      curl.position.set(side * (headRadius * 0.85), -0.05, 0.08);
      head.add(curl);
    });
  } else if (style === 'vine_long') {
    for (let i = 0; i < 6; i++) {
      const ang = -Math.PI * 0.75 + (i / 5) * Math.PI * 1.5;
      const vine = new THREE.Mesh(new THREE.CapsuleGeometry(0.036, 0.34, 5, 8), hairMat);
      vine.position.set(Math.sin(ang) * headRadius * 0.94, -0.14, -Math.cos(ang) * 0.08 - 0.12);
      vine.rotation.z = Math.sin(ang) * 0.26;
      head.add(vine);
    }
  } else if (style === 'chignon_updo') {
    const bun = new THREE.Mesh(new THREE.SphereGeometry(headRadius * 0.56, 12, 12), hairMat);
    bun.position.set(0, 0.14, -headRadius * 0.86);
    head.add(bun);
    [-1, 1].forEach((side) => {
      const curl = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.16, 4, 6), hairMat);
      curl.position.set(side * headRadius * 0.86, -0.06, 0.06);
      head.add(curl);
    });
  } else if (style === 'low_bun' || style === 'tied_back') {
    const bun = new THREE.Mesh(new THREE.SphereGeometry(headRadius * 0.45, 10, 10), hairMat);
    bun.position.set(0, -0.06, -headRadius * 0.95);
    head.add(bun);
  }
}

function addBeard(
  head: THREE.Group,
  headRadius: number,
  hairMat: THREE.Material,
  type: 'short_neat' | 'long_rough' | 'medium_full' | 'braided_short',
): THREE.Group {
  const grp = new THREE.Group();
  if (type === 'short_neat') {
    const chinBeard = new THREE.Mesh(
      new THREE.CylinderGeometry(headRadius * 0.65, headRadius * 0.36, 0.13, 10, 1, false, -1.2, 2.4),
      hairMat,
    );
    chinBeard.position.set(0, -headRadius * 0.68, 0.03);
    grp.add(chinBeard);
  } else if (type === 'medium_full') {
    const main = new THREE.Mesh(new THREE.ConeGeometry(headRadius * 0.68, 0.24, 10), hairMat);
    main.rotation.x = Math.PI;
    main.position.set(0, -headRadius * 0.92, 0.07);
    grp.add(main);
  } else if (type === 'long_rough') {
    const main = new THREE.Mesh(new THREE.ConeGeometry(headRadius * 0.72, 0.38, 9), hairMat);
    main.rotation.x = Math.PI;
    main.position.set(0, -headRadius * 1.18, 0.06);
    const sideL = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.18, 4, 6), hairMat);
    sideL.position.set(-0.08, -0.2, 0.09);
    const sideR = sideL.clone();
    sideR.position.x = 0.08;
    grp.add(main, sideL, sideR);
  } else if (type === 'braided_short') {
    [-0.06, 0, 0.06].forEach((bx) => {
      const braid = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.14, 4, 6), hairMat);
      braid.position.set(bx, -headRadius * 0.85, 0.1);
      grp.add(braid);
    });
  }
  head.add(grp);
  return grp;
}

/**
 * Articulated Greek Legs & Laced Sandals / Greaves
 */
function buildArticulatedLegs(
  torso: THREE.Group,
  skinMat: THREE.Material,
  footwearMat: THREE.Material,
  strapMat: THREE.Material,
  options?: { highBoots?: boolean; scaleW?: number; scaleH?: number },
): { leftLeg: THREE.Group; rightLeg: THREE.Group } {
  const sw = options?.scaleW ?? 1;
  const sh = options?.scaleH ?? 1;
  const highBoots = options?.highBoots ?? false;

  const makeLeg = (side: -1 | 1) => {
    const leg = new THREE.Group();
    leg.position.set(side * 0.16 * sw, 0.72 * sh, 0);

    const thigh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095 * sw, 0.08 * sw, 0.38 * sh, 10),
      skinMat,
    );
    thigh.position.y = -0.18 * sh;
    thigh.castShadow = true;

    const calf = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075 * sw, 0.056 * sw, 0.36 * sh, 10),
      highBoots ? footwearMat : skinMat,
    );
    calf.position.y = -0.5 * sh;
    calf.castShadow = true;

    // Sandal straps or greave cuff
    if (!highBoots) {
      for (let s = 0; s < 3; s++) {
        const strap = new THREE.Mesh(
          new THREE.TorusGeometry(0.068 * sw, 0.01, 6, 12),
          strapMat,
        );
        strap.rotation.x = Math.PI / 2;
        strap.position.y = (-0.42 - s * 0.09) * sh;
        leg.add(strap);
      }
    } else {
      const kneeTrim = new THREE.Mesh(
        new THREE.TorusGeometry(0.08 * sw, 0.014, 6, 12),
        strapMat,
      );
      kneeTrim.rotation.x = Math.PI / 2;
      kneeTrim.position.y = -0.33 * sh;
      leg.add(kneeTrim);
    }

    const foot = new THREE.Mesh(
      new THREE.BoxGeometry(0.11 * sw, 0.07 * sh, 0.2 * sw),
      footwearMat,
    );
    foot.position.set(0, -0.685 * sh, 0.045 * sw);
    foot.castShadow = true;

    leg.add(thigh, calf, foot);
    torso.add(leg);
    return leg;
  };

  return { leftLeg: makeLeg(-1), rightLeg: makeLeg(1) };
}

/**
 * Sculpted Muscular Chest, Waist Belt & Split Warrior Chiton / Flowing Gown
 */
function buildSculptedBody(
  torso: THREE.Group,
  options: {
    tunicMat: THREE.Material;
    armorMat?: THREE.Material;
    cloakMat: THREE.Material;
    beltMat: THREE.Material;
    trimMat: THREE.Material;
    skinMat: THREE.Material;
    footwearMat: THREE.Material;
    scaleY?: number;
    scaleW?: number;
    dressType: 'warrior_chiton' | 'flowing_peplos' | 'apron_giant';
    highBoots?: boolean;
  },
): {
  cloak: THREE.Mesh;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  chestArmorGroup: THREE.Group;
} {
  const sy = options.scaleY ?? 1;
  const sw = options.scaleW ?? 1;

  const { leftLeg, rightLeg } = buildArticulatedLegs(
    torso,
    options.skinMat,
    options.footwearMat,
    options.beltMat,
    { highBoots: options.highBoots, scaleW: sw, scaleH: sy },
  );

  // Skirt / Chiton / Peplos lower garment
  if (options.dressType === 'flowing_peplos') {
    const skirtPts = [
      new THREE.Vector2(0.39 * sw, 0.05 * sy),
      new THREE.Vector2(0.31 * sw, 0.48 * sy),
      new THREE.Vector2(0.22 * sw, 0.82 * sy),
    ];
    const skirt = new THREE.Mesh(new THREE.LatheGeometry(skirtPts, 20), options.tunicMat);
    skirt.castShadow = true;
    skirt.receiveShadow = true;
    torso.add(skirt);
  } else {
    // Shorter knee-length pleated tunic / kilt showing muscular legs & sandals!
    const skirtPts = [
      new THREE.Vector2(0.31 * sw, 0.44 * sy),
      new THREE.Vector2(0.25 * sw, 0.68 * sy),
      new THREE.Vector2(0.23 * sw, 0.84 * sy),
    ];
    const skirt = new THREE.Mesh(new THREE.LatheGeometry(skirtPts, 18), options.tunicMat);
    skirt.castShadow = true;
    torso.add(skirt);

    // Pteruges leather/bronze battle straps at hip
    for (let p = 0; p < 8; p++) {
      const a = (p / 8) * Math.PI * 2;
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.09 * sw, 0.2 * sy, 0.025),
        options.beltMat,
      );
      strip.position.set(Math.sin(a) * 0.24 * sw, 0.72 * sy, Math.cos(a) * 0.22 * sw);
      strip.rotation.y = a;
      torso.add(strip);
    }
  }

  // Sculpted Upper Torso (broad shoulders, tapered waist)
  const chestPts = [
    new THREE.Vector2(0.2 * sw, 0.8 * sy),
    new THREE.Vector2(0.24 * sw, 1.05 * sy),
    new THREE.Vector2(0.3 * sw, 1.32 * sy),
    new THREE.Vector2(0.18 * sw, 1.46 * sy),
  ];
  const chestMesh = new THREE.Mesh(new THREE.LatheGeometry(chestPts, 18), options.tunicMat);
  chestMesh.scale.set(1.06, 1, 0.78);
  chestMesh.castShadow = true;
  torso.add(chestMesh);

  // Armor Cuirass + Shoulder Pauldrons
  const chestArmorGroup = new THREE.Group();
  if (options.armorMat) {
    const cuirass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.29 * sw, 0.22 * sw, 0.46 * sy, 14),
      options.armorMat,
    );
    cuirass.scale.set(1.06, 1, 0.78);
    cuirass.position.y = 1.16 * sy;
    cuirass.castShadow = true;
    chestArmorGroup.add(cuirass);

    // Pectoral relief plates
    [-1, 1].forEach((side) => {
      const pec = new THREE.Mesh(
        new THREE.SphereGeometry(0.11 * sw, 10, 10),
        options.armorMat!,
      );
      pec.scale.set(1.1, 0.85, 0.55);
      pec.position.set(side * 0.12 * sw, 1.24 * sy, 0.19 * sw);
      chestArmorGroup.add(pec);

      const pauldron = new THREE.Mesh(
        new THREE.SphereGeometry(0.13 * sw, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.6),
        options.armorMat!,
      );
      pauldron.position.set(side * 0.34 * sw, 1.36 * sy, 0);
      pauldron.rotation.z = side * -0.45;
      chestArmorGroup.add(pauldron);
    });
  }
  torso.add(chestArmorGroup);

  // Waist Belt & Central Buckle
  const belt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.23 * sw, 0.23 * sw, 0.09 * sy, 16),
    options.beltMat,
  );
  belt.scale.set(1.05, 1, 0.82);
  belt.position.y = 0.86 * sy;
  torso.add(belt);

  const buckle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06 * sw, 0.06 * sw, 0.03, 12),
    options.trimMat,
  );
  buckle.rotation.x = Math.PI / 2;
  buckle.position.set(0, 0.86 * sy, 0.2 * sw);
  torso.add(buckle);

  // Neck
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08 * sw, 0.095 * sw, 0.16 * sy, 12),
    options.skinMat,
  );
  neck.position.y = 1.49 * sy;
  torso.add(neck);

  // Draped Back Cloak with Gold/Trim Fibula Brooches
  const cloak = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22 * sw, 0.44 * sw, 1.28 * sy, 14, 1, true, 1.2, 3.85),
    options.cloakMat,
  );
  cloak.position.set(0, 0.78 * sy, -0.06 * sw);
  cloak.castShadow = true;
  torso.add(cloak);

  [-1, 1].forEach((side) => {
    const clasp = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), options.trimMat);
    clasp.position.set(side * 0.21 * sw, 1.38 * sy, 0.14 * sw);
    torso.add(clasp);
  });

  return { cloak, leftLeg, rightLeg, chestArmorGroup };
}

function buildArmLimb(
  side: -1 | 1,
  skinMat: THREE.Material,
  bracerMat: THREE.Material,
  sy = 1,
  sw = 1,
): THREE.Group {
  const armGrp = new THREE.Group();
  armGrp.position.set(side * 0.36 * sw, 1.36 * sy, 0.02);

  const upper = new THREE.Mesh(
    new THREE.CylinderGeometry(0.068 * sw, 0.058 * sw, 0.32 * sy, 10),
    skinMat,
  );
  upper.position.set(side * 0.04, -0.14 * sy, 0);
  upper.rotation.z = side * 0.18;
  upper.castShadow = true;

  const forearm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.056 * sw, 0.046 * sw, 0.28 * sy, 10),
    bracerMat,
  );
  forearm.position.set(side * 0.09, -0.34 * sy, 0.1);
  forearm.rotation.set(-0.55, 0, side * 0.12);
  forearm.castShadow = true;

  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.052 * sw, 10, 10), skinMat);
  hand.position.set(side * 0.11, -0.44 * sy, 0.2);

  armGrp.add(upper, forearm, hand);
  return armGrp;
}

/**
 * CHAR-01 — ZEUS (4 switchable variants: child, young, warrior, king)
 */
function buildZeus(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 0.92, 0.5);

  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe3b896, roughness: 0.55 });
  const darkHairMat = new THREE.MeshStandardMaterial({ color: 0x2a1d17, roughness: 0.82 });
  const ivoryMat = new THREE.MeshStandardMaterial({ color: 0xf4eee3, roughness: 0.74 });
  const blueCloakMat = new THREE.MeshStandardMaterial({ color: 0x1e3a6e, roughness: 0.7 });
  const bronzeMat = new THREE.MeshStandardMaterial({ color: 0xc28a38, roughness: 0.26, metalness: 0.88 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf5c84c, roughness: 0.18, metalness: 0.94 });
  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x3b2618, roughness: 0.82 });

  // --- VARIANT A: ZEUS_CHILD (Swaddled infant in white linen with soft black hair) ---
  const childGroup = new THREE.Group();
  childGroup.visible = false;
  const cradle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.34, 0.2, 16),
    new THREE.MeshStandardMaterial({ color: 0x8c6d46, roughness: 0.88 }),
  );
  cradle.position.y = 0.1;
  const swaddle = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.42, 8, 14), ivoryMat);
  swaddle.position.y = 0.42;
  swaddle.rotation.z = 0.15;
  const childHead = new THREE.Group();
  childHead.position.set(-0.08, 0.72, 0.04);
  childHead.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), skinMat));
  const softHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.168, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
    darkHairMat,
  );
  softHair.position.y = 0.02;
  childHead.add(softHair);
  const childFace = buildSculptedFace(childHead, 0.16, skinMat, 0x60a5fa, 0x2a1d17);
  childGroup.add(cradle, swaddle, childHead);
  torso.add(childGroup);

  // --- VARIANT B/C/D: ZEUS ADULT (young / warrior / king) ---
  const adultGroup = new THREE.Group();
  torso.add(adultGroup);

  const { cloak, leftLeg, rightLeg, chestArmorGroup } = buildSculptedBody(adultGroup, {
    tunicMat: ivoryMat,
    armorMat: bronzeMat,
    cloakMat: blueCloakMat,
    beltMat: leatherMat,
    trimMat: goldMat,
    skinMat,
    footwearMat: leatherMat,
    dressType: 'warrior_chiton',
  });

  // Sculpted eagle & lightning chest emblem on warrior armor
  const eagleChest = new THREE.Mesh(new THREE.OctahedronGeometry(0.085, 0), goldMat);
  eagleChest.scale.set(1.8, 0.7, 0.4);
  eagleChest.position.set(0, 1.22, 0.24);
  chestArmorGroup.add(eagleChest);

  // King white & gold imperial sash + laurel
  const kingRegalia = new THREE.Group();
  const goldTrimHem = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.024, 8, 24), goldMat);
  goldTrimHem.rotation.x = Math.PI / 2;
  goldTrimHem.position.y = 0.48;
  const imperialSash = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.65, 0.48), goldMat);
  imperialSash.position.set(0, 1.15, 0);
  imperialSash.rotation.z = 0.42;
  kingRegalia.add(goldTrimHem, imperialSash);
  kingRegalia.visible = false;
  adultGroup.add(kingRegalia);

  // Head with thick dark-brown shoulder-length curly hair + toggleable beard + toggleable laurel crown
  const head = new THREE.Group();
  head.position.set(0, 1.72, 0.02);
  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.195, 18, 18), skinMat);
  cranium.castShadow = true;
  head.add(cranium);
  addHairLocks(head, 0.195, darkHairMat, 'curly_shoulder');
  const beardGroup = addBeard(head, 0.195, darkHairMat, 'short_neat');

  const laurelCrown = new THREE.Group();
  const wreath = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.022, 8, 24), goldMat);
  wreath.rotation.x = Math.PI / 2 - 0.12;
  wreath.position.y = 0.08;
  laurelCrown.add(wreath);
  laurelCrown.visible = false;
  head.add(laurelCrown);

  const adultFace = buildSculptedFace(head, 0.195, skinMat, 0x60a5fa, 0x241914, { glowEyes: true });
  adultGroup.add(head);

  // Articulated Left Arm + King Eagle Scepter
  const leftArm = buildArmLimb(-1, skinMat, bronzeMat);
  const kingScepter = new THREE.Group();
  const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.9, 8), goldMat);
  staff.position.set(-0.11, -0.02, 0.22);
  const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), goldMat);
  orb.position.set(-0.11, 0.96, 0.22);
  kingScepter.add(staff, orb);
  kingScepter.visible = false;
  leftArm.add(kingScepter);
  adultGroup.add(leftArm);

  // Articulated Right Arm + Branching White-Blue Thunderbolt (CHAR-01 spec)
  const rightArm = buildArmLimb(1, skinMat, bronzeMat);
  const thunderbolt = new THREE.Group();
  const boltMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd });
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mainSeg1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), coreMat);
  mainSeg1.scale.set(0.38, 2.8, 0.32);
  mainSeg1.position.set(0.13, -0.2, 0.28);
  mainSeg1.rotation.z = -0.35;
  const branch1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), boltMat);
  branch1.scale.set(0.32, 2.4, 0.28);
  branch1.position.set(0.22, -0.02, 0.3);
  branch1.rotation.z = 0.28;
  const branch2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.075, 0), boltMat);
  branch2.scale.set(0.28, 2.0, 0.26);
  branch2.position.set(0.08, 0.08, 0.34);
  branch2.rotation.z = -0.55;
  thunderbolt.add(mainSeg1, branch1, branch2);
  rightArm.add(thunderbolt);
  adultGroup.add(rightArm);

  return {
    root,
    torso,
    cloak,
    baseY,
    ...adultFace,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    zeusControl: {
      active: 'warrior',
      childGroup,
      adultGroup,
      childFace,
      adultFace,
      beardGroup,
      warriorArmor: chestArmorGroup,
      kingRegalia,
      laurelCrown,
      thunderbolt,
      kingScepter,
    },
  };
}

/**
 * CHAR-02 — CRONUS (Colossal Titan, scratched oxidized dark bronze armor, heavy crimson cloak, silver-streaked black hair & long beard, jagged plate crown, giant Harpe sickle)
 */
function buildCronus(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 1.05, 0.56);

  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xc28f6b, roughness: 0.64 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x262120, roughness: 0.88 });
  const silverStreakMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.72 });
  const darkBronzeMat = new THREE.MeshStandardMaterial({ color: 0x3b2d23, roughness: 0.42, metalness: 0.76 });
  const oxidizedMat = new THREE.MeshStandardMaterial({ color: 0x4b5e4f, roughness: 0.52, metalness: 0.55 });
  const crimsonMat = new THREE.MeshStandardMaterial({ color: 0x7a1c1c, roughness: 0.76 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.2, metalness: 0.94 });

  const { cloak, leftLeg, rightLeg, chestArmorGroup } = buildSculptedBody(torso, {
    tunicMat: darkBronzeMat,
    armorMat: darkBronzeMat,
    cloakMat: crimsonMat,
    beltMat: oxidizedMat,
    trimMat: oxidizedMat,
    skinMat,
    footwearMat: darkBronzeMat,
    scaleY: 1.14,
    scaleW: 1.16,
    dressType: 'warrior_chiton',
    highBoots: true,
  });

  // Engraved Titan ring on cuirass
  const titanRing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 6, 16), oxidizedMat);
  titanRing.position.set(0, 1.32, 0.28);
  chestArmorGroup.add(titanRing);

  const head = new THREE.Group();
  head.position.set(0, 1.94, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.215, 18, 18), skinMat));
  addHairLocks(head, 0.215, hairMat, 'wild_long');
  // Silver streaks in hair
  [-1, 1].forEach((side) => {
    const streak = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.22, 4, 6), silverStreakMat);
    streak.position.set(side * 0.2, -0.08, 0.04);
    head.add(streak);
  });
  addBeard(head, 0.215, hairMat, 'long_rough');

  // Jagged Metal-Plate Crown
  for (let i = 0; i < 7; i++) {
    const ang = (i / 7) * Math.PI * 2;
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.14 + (i % 2) * 0.05, 0.025), steelMat);
    plate.position.set(Math.sin(ang) * 0.21, 0.16, Math.cos(ang) * 0.21);
    plate.rotation.y = ang;
    head.add(plate);
  }

  const face = buildSculptedFace(head, 0.215, skinMat, 0xb45309, 0x1c1614);
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, darkBronzeMat, 1.14, 1.16);
  const rightArm = buildArmLimb(1, skinMat, darkBronzeMat, 1.14, 1.16);

  // Massive Long-Handled Curved War Sickle (Harpe)
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.028, 2.35, 8), darkBronzeMat);
  shaft.position.set(0.14, 0.14, 0.24);
  const blade = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.042, 8, 18, Math.PI * 1.15), steelMat);
  blade.position.set(-0.1, 1.26, 0.24);
  blade.rotation.z = 0.32;
  rightArm.add(shaft, blade);

  torso.add(leftArm, rightArm);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg };
}

/**
 * CHAR-03 — RHEA (Cream peplos, terracotta/olive cloak with leaf trim, braided chestnut-copper hair, swaddled bundle)
 */
function buildRhea(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 0.85, 0.45);
  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xebc5a8, roughness: 0.56 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x7a4228, roughness: 0.78 });
  const creamMat = new THREE.MeshStandardMaterial({ color: 0xf5efe4, roughness: 0.78 });
  const terracottaMat = new THREE.MeshStandardMaterial({ color: 0xb4533c, roughness: 0.72 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.25, metalness: 0.85 });

  const { cloak, leftLeg, rightLeg } = buildSculptedBody(torso, {
    tunicMat: creamMat,
    cloakMat: terracottaMat,
    beltMat: goldMat,
    trimMat: goldMat,
    skinMat,
    footwearMat: goldMat,
    dressType: 'flowing_peplos',
  });

  // Fertility gold necklace
  const necklace = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.014, 6, 16), goldMat);
  necklace.rotation.x = Math.PI / 2 + 0.35;
  necklace.position.set(0, 1.4, 0.08);
  torso.add(necklace);

  const head = new THREE.Group();
  head.position.set(0, 1.66, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.185, 18, 18), skinMat));
  addHairLocks(head, 0.185, hairMat, 'braids_twin');
  const face = buildSculptedFace(head, 0.185, skinMat, 0x92400e, 0x5c3a21);
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, goldMat);
  const rightArm = buildArmLimb(1, skinMat, goldMat);

  // Swaddled bundle / Omphalos stone
  const bundle = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.22, 6, 12), creamMat);
  bundle.rotation.z = Math.PI / 2 - 0.15;
  bundle.position.set(0.14, -0.36, 0.28);
  leftArm.add(bundle);

  torso.add(leftArm, rightArm);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg };
}

/**
 * CHAR-04 — GAIA (Earth mother with moss-green/earth-brown dress, root-vine hair with flowers, glowing earth orb)
 */
function buildGaia(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 0.95, 0.5);
  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd9b392, roughness: 0.72 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x3b4d2b, roughness: 0.85 });
  const mossMat = new THREE.MeshStandardMaterial({ color: 0x2d5a3c, roughness: 0.8 });
  const earthMat = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.82 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4a040, roughness: 0.35, metalness: 0.8 });
  const emeraldMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x065f46,
    emissiveIntensity: 0.6,
    roughness: 0.25,
  });

  const { cloak, leftLeg, rightLeg } = buildSculptedBody(torso, {
    tunicMat: mossMat,
    cloakMat: earthMat,
    beltMat: goldMat,
    trimMat: emeraldMat,
    skinMat,
    footwearMat: earthMat,
    scaleY: 1.06,
    scaleW: 1.06,
    dressType: 'flowing_peplos',
  });

  const head = new THREE.Group();
  head.position.set(0, 1.76, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.195, 18, 18), skinMat));
  addHairLocks(head, 0.195, hairMat, 'vine_long');
  const wreath = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.028, 8, 24), emeraldMat);
  wreath.rotation.x = Math.PI / 2 - 0.15;
  wreath.position.y = 0.09;
  head.add(wreath);
  const face = buildSculptedFace(head, 0.195, skinMat, 0x059669, 0x2f3e1e);
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, emeraldMat, 1.06, 1.06);
  const rightArm = buildArmLimb(1, skinMat, emeraldMat, 1.06, 1.06);

  const extraGroup = new THREE.Group();
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), emeraldMat);
  orb.position.set(-0.48, 1.25, 0.32);
  extraGroup.add(orb);
  torso.add(leftArm, rightArm, extraGroup);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg, extraGroup };
}

/**
 * CHAR-05 — URANUS (Primordial star-sky titan, intersecting armillary celestial rings crown, silver eyes, star cloak)
 */
function buildUranus(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.22;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, -0.09, 0, 0.9, 0.42);
  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0x3b4d82,
    emissive: 0x1e2954,
    emissiveIntensity: 0.45,
    roughness: 0.45,
  });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.72 });
  const robeMat = new THREE.MeshStandardMaterial({ color: 0x1e254d, roughness: 0.65 });
  const cloakMat = new THREE.MeshStandardMaterial({ color: 0x14224a, roughness: 0.62 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xca8a04, emissiveIntensity: 0.4 });

  const { cloak, leftLeg, rightLeg } = buildSculptedBody(torso, {
    tunicMat: robeMat,
    cloakMat,
    beltMat: goldMat,
    trimMat: goldMat,
    skinMat,
    footwearMat: cloakMat,
    scaleY: 1.08,
    scaleW: 1.04,
    dressType: 'flowing_peplos',
  });

  const head = new THREE.Group();
  head.position.set(0, 1.8, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.195, 18, 18), skinMat));
  addHairLocks(head, 0.195, hairMat, 'wild_long');
  addBeard(head, 0.195, hairMat, 'medium_full');

  // Intersecting celestial armillary crown rings
  [0, 0.7, -0.7].forEach((rot) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.012, 6, 24), goldMat);
    ring.rotation.set(Math.PI / 2 + rot * 0.4, 0, rot);
    ring.position.y = 0.16;
    head.add(ring);
  });

  const face = buildSculptedFace(head, 0.195, skinMat, 0xe2e8f0, 0x64748b, { glowEyes: true });
  torso.add(head);

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.8, 0.022, 8, 48),
    new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.5 }),
  );
  halo.position.set(0, 1.54, -0.34);
  torso.add(halo);

  const leftArm = buildArmLimb(-1, skinMat, hairMat, 1.08, 1.04);
  const rightArm = buildArmLimb(1, skinMat, hairMat, 1.08, 1.04);
  const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.2, 8), hairMat);
  staff.position.set(0.12, 0.08, 0.22);
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 14), goldMat);
  orb.position.set(0.12, 1.22, 0.22);
  rightArm.add(staff, orb);
  torso.add(leftArm, rightArm);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg, halo };
}

/**
 * CHAR-06 — METIS (Slender jade-eyed strategist, low neat bun, teal chiton & silver shawl, herb pouches & ceramic jar)
 */
function buildMetis(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 0.82, 0.45);
  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xebd0b5, roughness: 0.55 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x2b1d17, roughness: 0.82 });
  const tealMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.68 });
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.52 });
  const clayMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.72 });

  const { cloak, leftLeg, rightLeg } = buildSculptedBody(torso, {
    tunicMat: tealMat,
    cloakMat: silverMat,
    beltMat: clayMat,
    trimMat: silverMat,
    skinMat,
    footwearMat: clayMat,
    scaleY: 0.98,
    scaleW: 0.92,
    dressType: 'flowing_peplos',
  });

  // Herb pouches at waist
  [-0.2, 0.2].forEach((px) => {
    const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 0.08), clayMat);
    pouch.position.set(px, 0.78, 0.14);
    torso.add(pouch);
  });

  const head = new THREE.Group();
  head.position.set(0, 1.63, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 18), skinMat));
  addHairLocks(head, 0.18, hairMat, 'low_bun');
  const face = buildSculptedFace(head, 0.18, skinMat, 0x10b981, 0x1f1612);
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, silverMat, 0.98, 0.92);
  const rightArm = buildArmLimb(1, skinMat, silverMat, 0.98, 0.92);

  // Ceramic medicine jar / goblet
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.055, 0.16, 14), clayMat);
  jar.position.set(0.11, -0.38, 0.26);
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x5eead4 }),
  );
  glow.position.set(0.11, -0.26, 0.26);
  rightArm.add(jar, glow);
  torso.add(leftArm, rightArm);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg };
}

/**
 * CHAR-07 — POSEIDON (Broader sun-tanned ocean god, damp dark-teal curls, thick beard, wave-engraved bronze armor, trident + water swirl)
 */
function buildPoseidon(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 0.96, 0.52);
  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xcf946d, roughness: 0.56 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x1f3a44, roughness: 0.72 });
  const tealCloakMat = new THREE.MeshStandardMaterial({ color: 0x0e4d7a, roughness: 0.68 });
  const bronzeMat = new THREE.MeshStandardMaterial({ color: 0xb48342, roughness: 0.26, metalness: 0.88 });
  const brightMetal = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.16, metalness: 0.95 });

  const { cloak, leftLeg, rightLeg } = buildSculptedBody(torso, {
    tunicMat: tealCloakMat,
    armorMat: bronzeMat,
    cloakMat: tealCloakMat,
    beltMat: bronzeMat,
    trimMat: brightMetal,
    skinMat,
    footwearMat: bronzeMat,
    scaleY: 1.05,
    scaleW: 1.09,
    dressType: 'warrior_chiton',
  });

  const head = new THREE.Group();
  head.position.set(0, 1.78, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.205, 18, 18), skinMat));
  addHairLocks(head, 0.205, hairMat, 'curly_shoulder');
  addBeard(head, 0.205, hairMat, 'medium_full');
  const face = buildSculptedFace(head, 0.205, skinMat, 0x0284c7, 0x1e293b);
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, bronzeMat, 1.05, 1.09);
  const rightArm = buildArmLimb(1, skinMat, bronzeMat, 1.05, 1.09);

  // Tall 3-Pronged Bright Metal Trident + Water Swirl
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.35, 8), brightMetal);
  shaft.position.set(0.13, 0.1, 0.24);
  const crossbar = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.04, 0.04), brightMetal);
  crossbar.position.set(0.13, 1.26, 0.24);
  rightArm.add(shaft, crossbar);
  [-0.15, 0, 0.15].forEach((ox) => {
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.26, 6), brightMetal);
    tip.position.set(0.13 + ox, 1.4, 0.24);
    rightArm.add(tip);
  });

  const extraGroup = new THREE.Group();
  const waterRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.022, 6, 20),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.72 }),
  );
  waterRing.position.set(0.52, 2.35, 0.28);
  extraGroup.add(waterRing);

  torso.add(leftArm, rightArm, extraGroup);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg, extraGroup };
}

/**
 * CHAR-08 — HADES (Tall balanced frame, pale skin, grey-violet eyes, dark bronze & deep violet robes, silver-engraved dark Greek Helm of Darkness)
 */
function buildHades(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 0.9, 0.52);
  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.62 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85 });
  const blackBronzeMat = new THREE.MeshStandardMaterial({ color: 0x1e2430, roughness: 0.34, metalness: 0.82 });
  const violetMat = new THREE.MeshStandardMaterial({ color: 0x3b1d6a, roughness: 0.72 });
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.2, metalness: 0.92 });

  const { cloak, leftLeg, rightLeg } = buildSculptedBody(torso, {
    tunicMat: blackBronzeMat,
    armorMat: blackBronzeMat,
    cloakMat: violetMat,
    beltMat: silverMat,
    trimMat: silverMat,
    skinMat,
    footwearMat: blackBronzeMat,
    scaleY: 1.04,
    scaleW: 0.98,
    dressType: 'warrior_chiton',
    highBoots: true,
  });

  const head = new THREE.Group();
  head.position.set(0, 1.75, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.188, 18, 18), skinMat));
  addHairLocks(head, 0.188, hairMat, 'sleek_shoulder');
  addBeard(head, 0.188, hairMat, 'short_neat');

  // Silver-Engraved Greek Helm of Darkness
  const helmDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.21, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
    blackBronzeMat,
  );
  helmDome.position.y = 0.05;
  const helmCrest = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.28), silverMat);
  helmCrest.position.set(0, 0.22, -0.02);
  const helmTrim = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.015, 6, 20), silverMat);
  helmTrim.rotation.x = Math.PI / 2;
  helmTrim.position.y = 0.06;
  head.add(helmDome, helmCrest, helmTrim);

  const face = buildSculptedFace(head, 0.188, skinMat, 0x94a3b8, 0x0f172a);
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, blackBronzeMat, 1.04, 0.98);
  const rightArm = buildArmLimb(1, skinMat, blackBronzeMat, 1.04, 0.98);

  // Two-Pronged Iron Bident
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 2.25, 8), silverMat);
  shaft.position.set(0.12, 0.08, 0.22);
  const p1 = new THREE.Mesh(new THREE.ConeGeometry(0.034, 0.25, 6), silverMat);
  p1.position.set(0.05, 1.28, 0.22);
  const p2 = new THREE.Mesh(new THREE.ConeGeometry(0.034, 0.25, 6), silverMat);
  p2.position.set(0.19, 1.28, 0.22);
  rightArm.add(shaft, p1, p2);

  const wisps = new THREE.Group();
  const wMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.55 });
  for (let i = 0; i < 3; i++) {
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), wMat);
    orb.position.set(Math.cos(i * 2.1) * 0.72, 0.65 + i * 0.3, Math.sin(i * 2.1) * 0.72);
    wisps.add(orb);
  }
  root.add(wisps);
  torso.add(leftArm, rightArm);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg, wisps };
}

/**
 * CHAR-09 — HERA (Tall queenly silhouette, ivory gown + royal blue mantle with gold trim, ornate Greek updo, gold crown & peacock scepter)
 */
function buildHera(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 0.85, 0.45);
  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf0cbb0, roughness: 0.56 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x3a2318, roughness: 0.82 });
  const ivoryMat = new THREE.MeshStandardMaterial({ color: 0xf8f2e4, roughness: 0.72 });
  const royalBlueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.65 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2, metalness: 0.92 });

  const { cloak, leftLeg, rightLeg } = buildSculptedBody(torso, {
    tunicMat: ivoryMat,
    cloakMat: royalBlueMat,
    beltMat: goldMat,
    trimMat: goldMat,
    skinMat,
    footwearMat: goldMat,
    scaleY: 1.03,
    scaleW: 0.94,
    dressType: 'flowing_peplos',
  });

  const head = new THREE.Group();
  head.position.set(0, 1.71, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.185, 18, 18), skinMat));
  addHairLocks(head, 0.185, hairMat, 'chignon_updo');
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.18, 0.12, 8, 1, true), goldMat);
  crown.position.y = 0.15;
  head.add(crown);
  const face = buildSculptedFace(head, 0.185, skinMat, 0x92400e, 0x3a2318);
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, goldMat, 1.03, 0.94);
  const rightArm = buildArmLimb(1, skinMat, goldMat, 1.03, 0.94);

  const scepter = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.05, 8), goldMat);
  scepter.position.set(0.11, 0.04, 0.2);
  const plume = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.35 }),
  );
  plume.scale.set(0.8, 1.3, 0.4);
  plume.position.set(0.11, 1.1, 0.2);
  rightArm.add(scepter, plume);
  torso.add(leftArm, rightArm);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg };
}

/**
 * CHAR-10 — DEMETER (Honey-golden wavy hair with wheat wreath, wheat/cream/olive layered linen, sheaf of golden wheat)
 */
function buildDemeter(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 0.85, 0.45);
  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xecc4a2, roughness: 0.58 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.78 });
  const creamMat = new THREE.MeshStandardMaterial({ color: 0xfaf3e0, roughness: 0.78 });
  const oliveMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.76 });
  const wheatMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.65 });

  const { cloak, leftLeg, rightLeg } = buildSculptedBody(torso, {
    tunicMat: creamMat,
    cloakMat: oliveMat,
    beltMat: wheatMat,
    trimMat: wheatMat,
    skinMat,
    footwearMat: wheatMat,
    dressType: 'flowing_peplos',
  });

  const head = new THREE.Group();
  head.position.set(0, 1.66, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.188, 18, 18), skinMat));
  addHairLocks(head, 0.188, hairMat, 'curly_shoulder');
  const wreath = new THREE.Mesh(new THREE.TorusGeometry(0.198, 0.025, 8, 22), wheatMat);
  wreath.rotation.x = Math.PI / 2 - 0.15;
  wreath.position.y = 0.09;
  head.add(wreath);
  const face = buildSculptedFace(head, 0.188, skinMat, 0xca8a04, 0x713f12);
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, wheatMat);
  const rightArm = buildArmLimb(1, skinMat, wheatMat);

  // Sheaf of Golden Wheat
  const sheaf = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.55, 8), wheatMat);
  sheaf.position.set(0.12, -0.2, 0.24);
  sheaf.rotation.z = -0.25;
  rightArm.add(sheaf);
  torso.add(leftArm, rightArm);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg };
}

/**
 * CHAR-11 — HESTIA (Modest cream & terracotta dress, head veil, warm orange sacred flame bowl)
 */
function buildHestia(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 0.82, 0.44);
  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xedd0b5, roughness: 0.58 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x5c3a28, roughness: 0.82 });
  const creamMat = new THREE.MeshStandardMaterial({ color: 0xfaf5eb, roughness: 0.8 });
  const brickMat = new THREE.MeshStandardMaterial({ color: 0xb4533c, roughness: 0.76 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.35, metalness: 0.7 });

  const { cloak, leftLeg, rightLeg } = buildSculptedBody(torso, {
    tunicMat: creamMat,
    cloakMat: brickMat,
    beltMat: goldMat,
    trimMat: goldMat,
    skinMat,
    footwearMat: brickMat,
    scaleY: 0.99,
    scaleW: 0.94,
    dressType: 'flowing_peplos',
  });

  const head = new THREE.Group();
  head.position.set(0, 1.64, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.182, 18, 18), skinMat));
  addHairLocks(head, 0.182, hairMat, 'low_bun');
  // Modest head veil
  const veil = new THREE.Mesh(
    new THREE.SphereGeometry(0.205, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.62),
    creamMat,
  );
  veil.position.set(0, 0.04, -0.03);
  head.add(veil);
  const face = buildSculptedFace(head, 0.182, skinMat, 0x78350f, 0x5c3a28);
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, goldMat, 0.99, 0.94);
  const rightArm = buildArmLimb(1, skinMat, goldMat, 0.99, 0.94);

  // Warm orange-amber hearth bowl
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.07, 0.09, 12), goldMat);
  bowl.position.set(0.11, -0.4, 0.28);
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.08, 0.22, 8),
    new THREE.MeshBasicMaterial({ color: 0xf97316 }),
  );
  flame.position.set(0.11, -0.26, 0.28);
  rightArm.add(bowl, flame);
  torso.add(leftArm, rightArm);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg };
}

/**
 * CHAR-12/13/14 — THREE DISTINCT CYCLOPES (Brontes, Steropes, Arges)
 */
function buildCyclopsVariant(
  variant: 'brontes' | 'steropes' | 'arges',
  shadowTex: THREE.Texture,
): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 1.05, 0.56);
  const torso = new THREE.Group();
  root.add(torso);

  const cfg = {
    brontes: {
      skin: 0x8a7060,
      hair: 0x1c1917,
      eye: 0xf59e0b,
      apron: 0x5c361e,
      metal: 0x78350f,
      sw: 1.32,
      sy: 1.12,
      hairStyle: 'short_rough' as const,
    },
    steropes: {
      skin: 0x64748b,
      hair: 0x334155,
      eye: 0x7dd3fc,
      apron: 0x1e293b,
      metal: 0x94a3b8,
      sw: 1.06,
      sy: 1.24,
      hairStyle: 'tied_back' as const,
    },
    arges: {
      skin: 0x9a633c,
      hair: 0x7f1d1d,
      eye: 0xfacc15,
      apron: 0x7c2d12,
      metal: 0xd97706,
      sw: 1.18,
      sy: 1.16,
      hairStyle: 'curly_shoulder' as const,
    },
  }[variant];

  const skinMat = new THREE.MeshStandardMaterial({ color: cfg.skin, roughness: 0.7 });
  const hairMat = new THREE.MeshStandardMaterial({ color: cfg.hair, roughness: 0.85 });
  const apronMat = new THREE.MeshStandardMaterial({ color: cfg.apron, roughness: 0.78 });
  const metalMat = new THREE.MeshStandardMaterial({ color: cfg.metal, roughness: 0.3, metalness: 0.84 });

  const { cloak, leftLeg, rightLeg, chestArmorGroup } = buildSculptedBody(torso, {
    tunicMat: apronMat,
    armorMat: variant === 'arges' ? metalMat : undefined,
    cloakMat: apronMat,
    beltMat: metalMat,
    trimMat: metalMat,
    skinMat,
    footwearMat: apronMat,
    scaleY: cfg.sy,
    scaleW: cfg.sw,
    dressType: 'warrior_chiton',
  });

  if (variant === 'arges') {
    chestArmorGroup.visible = true;
  }

  const head = new THREE.Group();
  head.position.set(0, 1.72 * cfg.sy, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), skinMat));
  addHairLocks(head, 0.24, hairMat, cfg.hairStyle);
  if (variant === 'brontes') {
    addBeard(head, 0.24, hairMat, 'short_neat');
  } else if (variant === 'arges') {
    addBeard(head, 0.24, hairMat, 'braided_short');
  }

  const face = buildSculptedFace(head, 0.24, skinMat, cfg.eye, cfg.hair, {
    isCyclops: true,
    glowEyes: true,
  });
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, metalMat, cfg.sy, cfg.sw);
  const rightArm = buildArmLimb(1, skinMat, metalMat, cfg.sy, cfg.sw);

  if (variant === 'steropes') {
    // Forge tongs & glowing ingot
    const tongs = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8), metalMat);
    tongs.position.set(0.12, -0.06, 0.28);
    const ingot = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.1, 0.12),
      new THREE.MeshBasicMaterial({ color: 0xbae6fd }),
    );
    ingot.position.set(0.12, 0.66, 0.28);
    rightArm.add(tongs, ingot);
  } else {
    const hammerScale = variant === 'brontes' ? 1.2 : 0.85;
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 1.8, 8), apronMat);
    handle.position.set(0.14, 0.12, 0.24);
    const hammerHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.42 * hammerScale, 0.24 * hammerScale, 0.24 * hammerScale),
      metalMat,
    );
    hammerHead.position.set(0.14, 1.02, 0.24);
    rightArm.add(handle, hammerHead);
  }

  torso.add(leftArm, rightArm);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg };
}

/**
 * CHAR-15/16/17 — THREE DISTINCT HECATONCHEIRES (Cottus, Briareus, Gyges)
 */
function buildHecatoncheiresVariant(
  variant: 'cottus' | 'briareus' | 'gyges',
  shadowTex: THREE.Texture,
): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 1.12, 0.58);
  const torso = new THREE.Group();
  root.add(torso);

  const cfg = {
    cottus: { skin: 0x78716c, hair: 0x44403c, eye: 0xf59e0b, cloth: 0x3f3a36, sw: 1.38, sy: 1.12 },
    briareus: { skin: 0x475569, hair: 0x1e293b, eye: 0x7dd3fc, cloth: 0x1e293b, sw: 1.24, sy: 1.28 },
    gyges: { skin: 0x7c3e32, hair: 0x292524, eye: 0xef4444, cloth: 0x57534e, sw: 1.3, sy: 1.16 },
  }[variant];

  const skinMat = new THREE.MeshStandardMaterial({ color: cfg.skin, roughness: 0.85 });
  const hairMat = new THREE.MeshStandardMaterial({ color: cfg.hair, roughness: 0.9 });
  const clothMat = new THREE.MeshStandardMaterial({ color: cfg.cloth, roughness: 0.82 });
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.92 });
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.85 });

  const { cloak, leftLeg, rightLeg } = buildSculptedBody(torso, {
    tunicMat: clothMat,
    cloakMat: clothMat,
    beltMat: ringMat,
    trimMat: ringMat,
    skinMat,
    footwearMat: clothMat,
    scaleY: cfg.sy,
    scaleW: cfg.sw,
    dressType: 'warrior_chiton',
  });

  // Central Head + 4 Secondary Multi-Tiered Heads around shoulders/neck
  const head = new THREE.Group();
  head.position.set(0, 1.72 * cfg.sy, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.23, 16, 16), skinMat));
  addHairLocks(head, 0.23, hairMat, 'short_rough');
  if (variant === 'gyges') {
    addBeard(head, 0.23, hairMat, 'short_neat');
  }
  const face = buildSculptedFace(head, 0.23, skinMat, cfg.eye, cfg.hair, { glowEyes: true });
  torso.add(head);

  // Secondary heads on shoulders & upper back
  [
    [-0.36, 1.56 * cfg.sy, 0.06],
    [0.36, 1.56 * cfg.sy, 0.06],
    [-0.24, 1.72 * cfg.sy, -0.18],
    [0.24, 1.72 * cfg.sy, -0.18],
  ].forEach(([hx, hy, hz]) => {
    const subHead = new THREE.Group();
    subHead.position.set(hx, hy, hz);
    subHead.add(new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), skinMat));
    const subEyeL = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 6, 6),
      new THREE.MeshBasicMaterial({ color: cfg.eye }),
    );
    subEyeL.position.set(-0.04, 0.02, 0.11);
    const subEyeR = subEyeL.clone();
    subEyeR.position.x = 0.04;
    subHead.add(subEyeL, subEyeR);
    torso.add(subHead);
  });

  const leftArm = buildArmLimb(-1, skinMat, ringMat, cfg.sy, cfg.sw);
  const rightArm = buildArmLimb(1, skinMat, ringMat, cfg.sy, cfg.sw);
  torso.add(leftArm, rightArm);

  // Multi-Layered Fan of 12 Extra Arms Clutching Hurled Boulders
  const extraGroup = new THREE.Group();
  extraGroup.position.set(0, 1.38 * cfg.sy, -0.1);
  [-1, 1].forEach((side) => {
    for (let a = 0; a < 5; a++) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.96, 8), skinMat);
      arm.position.set(
        side * (0.52 + a * 0.12),
        0.38 - a * 0.2,
        -0.08 + (a % 2) * 0.18,
      );
      arm.rotation.z = side * (-1.1 + a * 0.26);
      extraGroup.add(arm);

      if (a % 2 === 0 || variant === 'gyges') {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16, 0), rockMat);
        rock.position.set(
          side * (0.95 + a * 0.14),
          0.66 - a * 0.24,
          -0.08 + (a % 2) * 0.18,
        );
        extraGroup.add(rock);
      }
    }
  });
  torso.add(extraGroup);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg, extraGroup };
}

/**
 * CHAR-18 — CAMPE (Female scaled warrior torso + massive coiled spiked serpent tail instead of legs, horns, snake hair, bat wings, fire whip)
 */
function buildCampe(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.14;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 1.05, 0.56);
  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0x7b8d8e, roughness: 0.58 });
  const scaleMat = new THREE.MeshStandardMaterial({ color: 0x0f292e, roughness: 0.42, metalness: 0.4 });
  const wingMat = new THREE.MeshStandardMaterial({ color: 0x2e1065, roughness: 0.68, side: THREE.DoubleSide });
  const venomMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x14532d,
    emissiveIntensity: 0.5,
    roughness: 0.35,
  });

  // Coiled Spiked Serpent Lower Body (TubeGeometry S-coil)
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.85, 0),
    new THREE.Vector3(0, 0.45, 0.15),
    new THREE.Vector3(-0.32, 0.18, 0.38),
    new THREE.Vector3(0.28, 0.14, 0.12),
    new THREE.Vector3(0.48, 0.18, -0.35),
    new THREE.Vector3(0.1, 0.36, -0.58),
    new THREE.Vector3(-0.38, 0.62, -0.42),
  ]);
  const serpentTail = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 28, 0.17, 10, false), scaleMat);
  serpentTail.castShadow = true;
  torso.add(serpentTail);

  // Dorsal spine spikes along serpent body
  for (let s = 0; s < 6; s++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 5), venomMat);
    spike.position.set(0.25 - s * 0.08, 0.25 + (s % 2) * 0.06, -0.25 - s * 0.04);
    torso.add(spike);
  }

  // Female Scaled Bio-Armor Upper Torso
  const upperBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.18, 0.62, 14), scaleMat);
  upperBody.scale.set(1.04, 1, 0.78);
  upperBody.position.y = 1.15;
  upperBody.castShadow = true;
  torso.add(upperBody);

  const cloak = serpentTail; // sway reference

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.088, 0.16, 10), skinMat);
  neck.position.y = 1.52;
  torso.add(neck);

  const head = new THREE.Group();
  head.position.set(0, 1.72, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.185, 16, 16), skinMat));
  // Horns
  [-1, 1].forEach((side) => {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.18, 6), scaleMat);
    horn.position.set(side * 0.12, 0.19, 0.02);
    horn.rotation.z = side * -0.45;
    head.add(horn);
  });
  // Serpent hair locks
  for (let s = 0; s < 6; s++) {
    const ang = (s / 6) * Math.PI * 2;
    const serpent = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 6, 12, Math.PI * 1.25), venomMat);
    serpent.position.set(Math.cos(ang) * 0.17, 0.1, Math.sin(ang) * 0.17);
    serpent.rotation.y = -ang;
    head.add(serpent);
  }
  const face = buildSculptedFace(head, 0.185, skinMat, 0xea580c, 0x0f172a, { glowEyes: true });
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, scaleMat);
  const rightArm = buildArmLimb(1, skinMat, scaleMat);
  const fireWhip = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.022, 6, 18, Math.PI * 1.3),
    new THREE.MeshBasicMaterial({ color: 0xf97316 }),
  );
  fireWhip.position.set(0.15, -0.58, 0.34);
  rightArm.add(fireWhip);
  torso.add(leftArm, rightArm);

  const makeWing = (side: 1 | -1) => {
    const w = new THREE.Group();
    w.position.set(side * 0.18, 1.32, -0.18);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.56, 0.04), wingMat);
    blade.position.set(side * 0.48, 0.16, -0.05);
    blade.rotation.z = side * 0.35;
    w.add(blade);
    return w;
  };
  const wingLeft = makeWing(-1);
  const wingRight = makeWing(1);
  torso.add(wingLeft, wingRight);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, wingLeft, wingRight };
}

/**
 * CHAR-19 — PROMETHEUS (Scholarly Titan, grey-white & bronze cloak, geometric belt, dark-brown tied hair, symbolic torch)
 */
function buildPrometheus(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 0.88, 0.48);
  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xdfb695, roughness: 0.58 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x29201b, roughness: 0.82 });
  const ashWhiteMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.76 });
  const bronzeMat = new THREE.MeshStandardMaterial({ color: 0x8c6239, roughness: 0.38, metalness: 0.75 });

  const { cloak, leftLeg, rightLeg } = buildSculptedBody(torso, {
    tunicMat: ashWhiteMat,
    cloakMat: bronzeMat,
    beltMat: bronzeMat,
    trimMat: ashWhiteMat,
    skinMat,
    footwearMat: bronzeMat,
    scaleY: 1.03,
    scaleW: 0.98,
    dressType: 'flowing_peplos',
  });

  const head = new THREE.Group();
  head.position.set(0, 1.72, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.19, 18, 18), skinMat));
  addHairLocks(head, 0.19, hairMat, 'tied_back');
  addBeard(head, 0.19, hairMat, 'short_neat');
  const face = buildSculptedFace(head, 0.19, skinMat, 0xca8a04, 0x29201b);
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, bronzeMat, 1.03, 0.98);
  const rightArm = buildArmLimb(1, skinMat, bronzeMat, 1.03, 0.98);

  const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.018, 0.75, 8), bronzeMat);
  torch.position.set(0.11, -0.14, 0.24);
  const glow = new THREE.Mesh(
    new THREE.ConeGeometry(0.075, 0.2, 8),
    new THREE.MeshBasicMaterial({ color: 0xfb923c }),
  );
  glow.position.set(0.11, 0.28, 0.24);
  rightArm.add(torch, glow);
  torso.add(leftArm, rightArm);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg };
}

/**
 * CHAR-20 — AMALTHEA (Sacred white-cream goat with curved ivory horns, golden-brown eyes, rope collar & bronze bell)
 */
function buildAmalthea(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 0.78, 0.42);
  const torso = new THREE.Group();
  root.add(torso);

  const fleeceMat = new THREE.MeshStandardMaterial({ color: 0xfaf6eb, roughness: 0.88 });
  const hornMat = new THREE.MeshStandardMaterial({ color: 0xe6dec5, roughness: 0.45 });
  const hoofMat = new THREE.MeshStandardMaterial({ color: 0x3b2d23, roughness: 0.75 });
  const ropeMat = new THREE.MeshStandardMaterial({ color: 0xa68358, roughness: 0.9 });
  const bellMat = new THREE.MeshStandardMaterial({ color: 0xc28a38, roughness: 0.28, metalness: 0.88 });

  // Quadrupedal Goat Body
  const barrel = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.48, 8, 14), fleeceMat);
  barrel.rotation.z = Math.PI / 2;
  barrel.rotation.y = Math.PI / 2;
  barrel.position.set(0, 0.62, 0);
  barrel.castShadow = true;
  torso.add(barrel);

  // Tail
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 8), fleeceMat);
  tail.position.set(0, 0.78, -0.38);
  tail.rotation.x = -0.6;
  torso.add(tail);

  // 4 Sturdy Legs & Hooves
  [
    [-0.15, 0.22],
    [0.15, 0.22],
    [-0.15, -0.24],
    [0.15, -0.24],
  ].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.042, 0.5, 8), fleeceMat);
    leg.position.set(lx, 0.28, lz);
    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.08, 8), hoofMat);
    hoof.position.set(lx, 0.04, lz);
    torso.add(leg, hoof);
  });

  // Neck + Rope Collar + Bronze Bell
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.42, 12), fleeceMat);
  neck.position.set(0, 0.88, 0.28);
  neck.rotation.x = 0.42;
  torso.add(neck);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.022, 6, 16), ropeMat);
  collar.rotation.x = Math.PI / 2 - 0.3;
  collar.position.set(0, 0.82, 0.26);
  torso.add(collar);

  const extraGroup = new THREE.Group();
  const bell = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.09, 10), bellMat);
  bell.position.set(0, 0.72, 0.4);
  extraGroup.add(bell);
  torso.add(extraGroup);

  const head = new THREE.Group();
  head.position.set(0, 1.08, 0.42);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), fleeceMat);
  const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.095, 0.18, 10), fleeceMat);
  muzzle.rotation.x = Math.PI / 2 + 0.25;
  muzzle.position.set(0, -0.04, 0.14);
  head.add(skull, muzzle);

  // Curved Ivory Horns & Ears
  [-1, 1].forEach((side) => {
    const horn = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.026, 6, 14, Math.PI * 0.75), hornMat);
    horn.position.set(side * 0.08, 0.12, -0.04);
    horn.rotation.y = Math.PI / 2 + side * 0.15;
    horn.rotation.z = 0.4;
    const ear = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.045, 0.04), fleeceMat);
    ear.position.set(side * 0.14, 0.04, 0.0);
    ear.rotation.z = side * 0.35;
    head.add(horn, ear);
  });

  const face = buildSculptedFace(head, 0.14, fleeceMat, 0xa16207, 0xd6cbb0);
  torso.add(head);

  return {
    root,
    torso,
    cloak: barrel,
    baseY,
    ...face,
    isQuadruped: true,
    extraGroup,
  };
}

/**
 * CHAR-21 — CURETES (Ritual Cretan guardian warrior: bronze helm, brown leather armor, short brick-red tunic, round bronze shield & long spear)
 */
function buildCuretes(shadowTex: THREE.Texture): CharacterRig {
  const root = new THREE.Group();
  const baseY = 0.13;
  root.position.y = baseY;
  addContactShadow(root, shadowTex, 0, 0.01, 0, 0.88, 0.48);
  const torso = new THREE.Group();
  root.add(torso);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xdfb18e, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x3b2618, roughness: 0.85 });
  const brickRedMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.78 });
  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x784f32, roughness: 0.82 });
  const bronzeMat = new THREE.MeshStandardMaterial({ color: 0xc28a38, roughness: 0.28, metalness: 0.86 });

  const { cloak, leftLeg, rightLeg } = buildSculptedBody(torso, {
    tunicMat: brickRedMat,
    armorMat: leatherMat,
    cloakMat: brickRedMat,
    beltMat: bronzeMat,
    trimMat: bronzeMat,
    skinMat,
    footwearMat: leatherMat,
    scaleY: 0.99,
    scaleW: 1.0,
    dressType: 'warrior_chiton',
  });

  const head = new THREE.Group();
  head.position.set(0, 1.66, 0.02);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.185, 16, 16), skinMat));
  addHairLocks(head, 0.185, hairMat, 'short_rough');
  addBeard(head, 0.185, hairMat, 'short_neat');

  // Simple Bronze Helm with low crest
  const helm = new THREE.Mesh(
    new THREE.SphereGeometry(0.205, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.56),
    bronzeMat,
  );
  helm.position.y = 0.04;
  head.add(helm);

  const face = buildSculptedFace(head, 0.185, skinMat, 0x451a03, 0x3b2618);
  torso.add(head);

  const leftArm = buildArmLimb(-1, skinMat, bronzeMat, 0.99, 1.0);
  // Round Bronze Shield on Left Arm
  const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 24), bronzeMat);
  shield.rotation.x = Math.PI / 2;
  shield.rotation.y = 0.35;
  shield.position.set(-0.22, -0.22, 0.24);
  leftArm.add(shield);

  const rightArm = buildArmLimb(1, skinMat, bronzeMat, 0.99, 1.0);
  // Long Spear
  const spear = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.2, 8), leatherMat);
  spear.position.set(0.12, 0.12, 0.22);
  const spearTip = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 6), bronzeMat);
  spearTip.position.set(0.12, 1.28, 0.22);
  rightArm.add(spear, spearTip);

  torso.add(leftArm, rightArm);

  return { root, torso, cloak, baseY, ...face, leftArm, rightArm, leftLeg, rightLeg };
}

export function applyZeusVariantToRig(rig: CharacterRig, variant: ZeusVariant = 'warrior'): void {
  const zc = rig.zeusControl;
  if (!zc) return;
  zc.active = variant;

  const isChild = variant === 'child';
  zc.childGroup.visible = isChild;
  zc.adultGroup.visible = !isChild;

  const face = isChild ? zc.childFace : zc.adultFace;
  rig.head = face.head;
  rig.eyeLeft = face.eyeLeft;
  rig.eyeRight = face.eyeRight;
  rig.leftBrow = face.leftBrow;
  rig.rightBrow = face.rightBrow;
  rig.mouth = face.mouth;

  if (!isChild) {
    zc.beardGroup.visible = variant !== 'young';
    zc.warriorArmor.visible = variant === 'warrior' || variant === 'king';
    zc.kingRegalia.visible = variant === 'king';
    zc.laurelCrown.visible = variant === 'king';
    zc.thunderbolt.visible = variant === 'warrior' || variant === 'king';
    zc.kingScepter.visible = variant === 'king';
  }
}

export function buildAllCharacterRigs(
  shadowTex: THREE.Texture,
): Record<StageCharacterId, CharacterRig> {
  return {
    zeus: buildZeus(shadowTex),
    cronus: buildCronus(shadowTex),
    rhea: buildRhea(shadowTex),
    gaia: buildGaia(shadowTex),
    uranus: buildUranus(shadowTex),
    metis: buildMetis(shadowTex),
    poseidon: buildPoseidon(shadowTex),
    hades: buildHades(shadowTex),
    hera: buildHera(shadowTex),
    demeter: buildDemeter(shadowTex),
    hestia: buildHestia(shadowTex),
    brontes: buildCyclopsVariant('brontes', shadowTex),
    steropes: buildCyclopsVariant('steropes', shadowTex),
    arges: buildCyclopsVariant('arges', shadowTex),
    cottus: buildHecatoncheiresVariant('cottus', shadowTex),
    briareus: buildHecatoncheiresVariant('briareus', shadowTex),
    gyges: buildHecatoncheiresVariant('gyges', shadowTex),
    campe: buildCampe(shadowTex),
    prometheus: buildPrometheus(shadowTex),
    amalthea: buildAmalthea(shadowTex),
    curetes: buildCuretes(shadowTex),
  };
}
