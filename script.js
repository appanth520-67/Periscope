// Simple rotating periscope-like 3D scene using Three.js (CDN)
function init3D() {
  const container = document.getElementById('threejs-container');
  if (!container) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 1, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Tube (periscope body)
  const tubeGeometry = new THREE.CylinderGeometry(0.25, 0.25, 6, 32);
  const tubeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 });
  const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
  tube.rotation.x = Math.PI / 2;
  scene.add(tube);

  // Top mirror/prism (simple box approximation)
  const topGeo = new THREE.BoxGeometry(0.8, 0.1, 0.8);
  const topMat = new THREE.MeshStandardMaterial({ color: 0x88aaff, metalness: 0.9, roughness: 0.1 });
  const topMirror = new THREE.Mesh(topGeo, topMat);
  topMirror.position.y = 3;
  topMirror.rotation.z = Math.PI / 4;
  scene.add(topMirror);

  // Bottom mirror/prism
  const bottomMirror = topMirror.clone();
  bottomMirror.position.y = -3;
  bottomMirror.rotation.z = -Math.PI / 4;
  scene.add(bottomMirror);

  // Lights
  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(5, 8, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  // Controls (orbit)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  function animate() {
    requestAnimationFrame(animate);
    tube.rotation.y += 0.003;          // slow rotation of whole periscope
    topMirror.rotation.y += 0.008;     // mirrors spin a bit
    bottomMirror.rotation.y -= 0.008;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Responsive
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

document.addEventListener('DOMContentLoaded', init3D);