

import "./style.css";
// import * as THREE from "C:/Users/tnaga/AppData/Local/Microsoft/TypeScript/4.9/node_modules/@types/three/index";
import * as THREE from "three";
import * as dat from "lil-gui";



/**
 * デバッグ(色つけるときに追加)
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffffff",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

// Canvas
const canvas = document.querySelector("#webgl");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

//背景用のテクスチャ
// const textureLoader = new THREE.TextureLoader();
// const bgTexture = textureLoader.load(spaceBG);
// scene.background = bgTexture;

//GridHelperの設定
// const gridHelper = new THREE.GridHelper(30, 30);
// scene.add(gridHelper);

// Camera
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
var camera = new THREE.PerspectiveCamera( 
  35, 
  window.innerWidth / window.innerHeight, 
  5, 
  2000 );

var cameraRange = 6;

var setcolor = 0x000000;


scene.fog = new THREE.FogExp2(0x0000ff, 0.001);

// Renderer
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.needsUpdate = true;

//オブジェクトの追加
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(25, 0.5, -15);
box.rotation.set(1, 0.5, 0);

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(25, 1, 10);

// Extraオブジェクト
//material
const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.865,
  roughness: 0.373,
  flatShading: true,
});

gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

// Meshes
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

scene.add(mesh1, mesh2, mesh3, mesh4);
const sectionMeshes = [mesh1, mesh2, mesh3, mesh4];

// ExtraオブジェクトEND

scene.add(box, torus);

// Particles
//geometry
const particlesCount = 700;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

//Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.025,
});

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Light
 *  */
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
scene.add(ambientLight);

var light = new THREE.SpotLight(0xFFFFFF, 3);
light.position.set(5, 5, 2);
light.castShadow = true;
light.shadow.mapSize.width = 10000;
light.shadow.mapSize.height = light.shadow.mapSize.width;
light.penumbra = 0.5;

var lightBack = new THREE.PointLight(0x0FFFFF, 1);
lightBack.position.set(0, -3, -1);


scene.add(light);
scene.add(lightBack);

var rectSize = 2;
var intensity = 100;
var rectLight = new THREE.RectAreaLight( 0x0FFFFF, intensity,  rectSize, rectSize );
rectLight.position.set( 0, 0, 1 );
rectLight.lookAt( 0, 0, 0 );
scene.add( rectLight )

// rectLightHelper = new THREE.RectAreaLightHelper( rectLight );

/**
 * 線形補間
 * lerp(min, max, ratio)
 */
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

/**
 * lerpの補間率計算(第三引数用)
 **/
function scaleParcent(start, end) {
  return (scrollPercent - start) / (end - start);
}

/**
 * スクロールアニメーション関数定義
 */
const animationScripts = [];

/**
 * スクロールアニメーション開始関数
 */
animationScripts.push({
  start: 0,
  end: 30,
  function() {
    // camera.lookAt(box.position);
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    camera.position.set(25, 1, 10);
    // box.position.z = lerp(-15, 6, scaleParcent(0, 40));
    torus.position.z = lerp(-200, 120, scaleParcent(0, 30));
  },
});

animationScripts.push({
  start: 30,
  end: 60,
  function() {
    // camera.lookAt(box.position);
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    torus.position.z = lerp(10, 50, scaleParcent(30, 60));
    camera.position.x =lerp(25, 0, scaleParcent(30, 60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  function() {
    // camera.lookAt(box.position);
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    // camera.position.x = lerp(0, 0, scaleParcent(60, 80));
    // camera.position.y = lerp(1, 0, scaleParcent(60, 80));
    // camera.position.z = lerp(10, 25, scaleParcent(60, 80));
  },
});

animationScripts.push({
  start: 80,
  end: 90,
  function() {
    // camera.lookAt(box.position);
    box.rotation.x += 0.001;
    box.rotation.y += 0.001;
    // torus.position.z = lerp(-50, 30, scaleParcent(80, 90));
  },
});

animationScripts.push({
  start: 90,
  end: 101,
  function() {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    // box.position.z = lerp(4, 30, scaleParcent(90, 101));
  },
});

/**
 * スクロールアニメーション開始
 */
function playScollAnimation() {
  animationScripts.forEach((animation) => {
    if (scrollPercent >= animation.start && scrollPercent < animation.end) {
      animation.function();
    }
  });
}

/**
 * ブラウザのスクロール率を導出
 */
let scrollPercent = 0;

document.body.onscroll = () => {
  //現在スクロールの進捗をパーセントで算出する。
  scrollPercent =
    (document.documentElement.scrollTop /
      (document.documentElement.scrollHeight -
        document.documentElement.clientHeight)) *
    100;
  // console.log(scrollPercent);
};

//アニメーション
const tick = () => {
  window.requestAnimationFrame(tick);
  /**
   * スクロールアニメーション開始
   */
  playScollAnimation();

  renderer.render(scene, camera);
};

tick();

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.scrollTo({ top: 0, behavior: "smooth" });

//cursor
const cursor = {};
cursor.x = 0;
cursor.y = 0;
// console.log(cursor);
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
  // console.log(cursor);
});

//wheel
let speed = 0;
let rotation = 0;
window.addEventListener("wheel", (event) => {
  // console.log(event.deltaY);
  speed += event.deltaY * 0.0002;
});

function rot() {
  rotation += speed;
  speed *= 0.93;
  // console.log(rotation);

  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);
  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + (3 * Math.PI) / 2);
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + (3 * Math.PI) / 2);

  window.requestAnimationFrame(rot);
}

rot();

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

//アニメーション
const tick2 = () => {
  const elapsedTime = clock.getElapsedTime();
  let deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  //camera animate
  // camera.position.y = (-scrollY / sizes.height) * objectDistance;

  const parallaxX = cursor.x * 0.6;
  const parallaxY = -cursor.y * 0.6;
  camera.position.x += (parallaxX - camera.position.x) * 1 * deltaTime;
  camera.position.y += (parallaxY - camera.position.y) * 1 * deltaTime;

  //mesh animate
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick2);
};

tick2();

// inviniteParticels
let mouseX = 0
let mouseY = 0
const geometry = new THREE.BufferGeometry()
const vertices = []
const size = 2000

for ( let i = 0; i < 20000; i ++ ) {
  const x = (Math.random() * size + Math.random() * size) / 2 - size / 2
  const y = (Math.random() * size + Math.random() * size) / 2 - size / 2
  const z = (Math.random() * size + Math.random() * size) / 2 - size / 2

  vertices.push(x, y, z)
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

material = new THREE.PointsMaterial({
  size: 2,
  color: 0xffffff,
})

// const particles = new THREE.Points(geometry, material)
// scene.add(particles)

function onPointerMove (event) {
  mouseX = event.clientX - windowHalfX 
  mouseY = event.clientY - windowHalfY
}

function animate () {
  requestAnimationFrame(animate)
  render()
}

function render () {
  camera.position.x += (mouseX * 2 - camera.position.x) * 0.02
  camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
  scene.rotation.x += 0.001
  scene.rotation.y += 0.002
}

animate()

