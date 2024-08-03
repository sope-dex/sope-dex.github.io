import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function initModelViewer(containerId, modelPath) {
  const container = document.getElementById(containerId);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xcccccc);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  const controls = new OrbitControls(camera, renderer.domElement);

  const loader = new GLTFLoader();
  loader.load(
    modelPath,
    function (gltf) {
      scene.add(gltf.scene);

      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      // 设置自定义的初始角度（弧度）
      const initialAngleX = -Math.PI / 10; // 绕 X 轴旋转（俯仰角）
      const initialAngleY = Math.PI / 10; // 绕 Y 轴旋转（偏航角）
      const initialAngleZ = -Math.PI / 20; // 绕 Z 轴旋转（翻滚角）

      // 设置自定义的初始距离系数（越小越近）
      const distanceFactor = 0.45;

      // 计算相机位置
      const distance = maxDim * distanceFactor;

      // 创建一个表示相机方向的向量
      const direction = new THREE.Vector3(0, 0, 1);

      // 创建一个四元数来表示旋转
      const quaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(initialAngleX, initialAngleY, initialAngleZ, "XYZ")
      );

      // 应用旋转到方向向量
      direction.applyQuaternion(quaternion);

      // 计算相机位置
      camera.position.copy(center).add(direction.multiplyScalar(distance));

      camera.lookAt(center);
      camera.up.set(0, 1, 0); // 确保相机的 "上" 方向正确

      controls.target.copy(center);
      controls.update();

      camera.near = maxDim / 100;
      camera.far = maxDim * 100;
      camera.updateProjectionMatrix();

      controls.minDistance = maxDim * 0.1;
      controls.maxDistance = maxDim * 0.5;
      controls.update();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% 加载完成");
    },
    function (error) {
      console.error("加载模型时发生错误", error);
    }
  );

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener("resize", onWindowResize, false);
}

export { initModelViewer };
