// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 1;

const uniforms = {
  iResolution: { type: "v3", value: new THREE.Vector3() },
  iMouse: { type: "v2", value: new THREE.Vector2() },
  iTime: { type: "f", value: 0.0 },
};

uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);

// Create a full-screen quad geometry
const geometry = new THREE.PlaneBufferGeometry(2, 2);

const loader = new THREE.FileLoader();

loader.load("../plasma.json", function (data) {
  const parsedData = JSON.parse(data);
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: parsedData.vertexShader,
    fragmentShader: parsedData.fragmentShader,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Rendering and animation setup
  const canvas = document.getElementById("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas });

  function animate() {
    requestAnimationFrame(animate);
    uniforms.iTime.value += 0.05; // Increment the time
    renderer.render(scene, camera);
  }

  animate();
});
