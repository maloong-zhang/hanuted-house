import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Timer } from "three/addons/misc/Timer.js";
//import gsap from "gsap";
import GUI from "lil-gui";
import { Sky } from "three/addons/objects/Sky.js";

const gui = new GUI();
gui.hide();

window.addEventListener("keydown", (event: any) => {
  if (event.key == "h") {
    gui.show(gui._hidden);
  }
});

// Canvas
const canvas: HTMLElement = document.querySelector("canvas.webgl")!;

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();

// Floor
const floorAlphaTexture = textureLoader.load(
  "/assets/textures/floor/alpha.webp",
);
const floorColorTexture = textureLoader.load(
  "/assets/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp",
);

const floorARMTexture = textureLoader.load(
  "/assets/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp",
);
const floorNormalTexture = textureLoader.load(
  "/assets/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp",
);
const floorDisplacementTexture = textureLoader.load(
  "/assets/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp",
);

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

// Walls
const wallColorTexture = textureLoader.load(
  "/assets/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp",
);

const wallARMTexture = textureLoader.load(
  "/assets/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp",
);
const wallNormalTexture = textureLoader.load(
  "/assets/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp",
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof
const roofColorTexture = textureLoader.load(
  "/assets/textures/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp",
);

const roofARMTexture = textureLoader.load(
  "/assets/textures/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp",
);
const roofNormalTexture = textureLoader.load(
  "/assets/textures/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp",
);

roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

// Bush
const bushColorTexture = textureLoader.load(
  "/assets/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp",
);

const bushARMTexture = textureLoader.load(
  "/assets/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp",
);
const bushNormalTexture = textureLoader.load(
  "/assets/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp",
);

bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

// Grave

const graveColorTexture = textureLoader.load(
  "/assets/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp",
);

const graveARMTexture = textureLoader.load(
  "/assets/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp",
);
const graveNormalTexture = textureLoader.load(
  "/assets/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp",
);

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

// Door
const doorColorTexture = textureLoader.load("/assets/textures/door/color.webp");
const doorAlphaTexture = textureLoader.load("/assets/textures/door/alpha.webp");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/assets/textures/door/ambientOcclusion.webp",
);
const doorHeightTexture = textureLoader.load(
  "/assets/textures/door/height.webp",
);
const doorNormalTexture = textureLoader.load(
  "/assets/textures/door/normal.webp",
);
const doorMetalnessTexture = textureLoader.load(
  "/assets/textures/door/metalness.webp",
);
const doorRoughnessTexture = textureLoader.load(
  "/assets/textures/door/roughness.webp",
);
doorColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * House
 */
const houseMeasurements = {
  width: 4,
  height: 2.5,
  depth: 4,
};

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
  }),
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Floor Displacement Scale");
gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("Floor Displacement Bias");

// House container
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(
    houseMeasurements.width,
    houseMeasurements.height,
    houseMeasurements.depth,
  ),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  }),
);
walls.position.y = houseMeasurements.height * 0.5;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  }),
);
roof.position.y = houseMeasurements.height + 1.5 * 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: doorAlphaTexture,
    transparent: true,
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
    normalMap: doorNormalTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
  }),
);
door.position.y = 1;
// add 0.01 to fix the z-fighting
door.position.z = houseMeasurements.depth * 0.5 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  // for make the color not wired
  color: "#ccffcc",
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
// only fix the texture display bugs, hidden the bugs
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
// only fix the texture display bugs, hidden the bugs
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
// only fix the texture display bugs, hidden the bugs
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
// only fix the texture display bugs, hidden the bugs
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  // Mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.x = x;
  grave.position.z = z;
  // move up and down to floor
  grave.position.y = Math.random() * 0.4;
  // change the angle
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  // Add to graves group
  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d4d", 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

// Ghosts
const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);
scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// handle the resize
window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// handle the fullscreen
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || (document as any).webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if ((canvas as any).webkitRequestFullscreen) {
      (canvas as any).webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
  }
});

//const axesHelper = new THREE.AxesHelper(2);
//scene.add(axesHelper);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// Cast and receive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;
for (const grave of graves.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

/**
 * Sky
 */
const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);
sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */
//scene.fog = new THREE.Fog("#ff0000", 10, 13);
scene.fog = new THREE.FogExp2("#02343f", 0.1);

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45);

  const ghost2Angle = -elapsedTime * 0.38;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45);

  const ghost3Angle = elapsedTime * 0.23;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
