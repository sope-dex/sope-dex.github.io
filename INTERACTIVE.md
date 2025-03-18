# 3D Model Viewer with Three.js
(credit to ChatGPT)

This guide explains how to set up an interactive 3D model viewer using **Three.js**. By following these steps, you can integrate a model viewer directly into your website, just like the SOPE experimental setup display.

## **Prerequisites**
Ensure you have the following:
- Basic knowledge of HTML, CSS, and JavaScript.
- Three.js library (via CDN or downloaded locally).
- A `.gltf` or `.glb` 3D model file.

## **Folder Structure**
Organize your project like this:
```
/my_project
  ├── /res
  │    ├── /static
  │    │    ├── 3dmodel
  │    │    │    └── model.gltf
  │    ├── /js
  │    │    ├── model-viewer.js
  │    └── /css
  │         └── styles.css
  ├── index.html
  └── README.md
```

---

## **Step 1: HTML Setup**
Create `index.html` with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>3D Model Viewer</title>
  <style>
    #model-container {
      width: 80%;
      height: 500px;
      margin: 20px auto;
      border: 2px solid #ccc;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      background-color: #ffffff;
    }
  </style>
</head>
<body>
  <div id="model-container"></div>

  <script type="module">
    import { initModelViewer } from "./res/js/model-viewer.js";

    document.addEventListener("DOMContentLoaded", () => {
      initModelViewer("model-container", "./res/static/3dmodel/model.gltf");
    });
  </script>
</body>
</html>
```

---

## **Step 2: JavaScript Code for Viewer**
Create `model-viewer.js` with the following content:

```javascript
import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

export function initModelViewer(containerId, modelPath) {
  const container = document.getElementById(containerId);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
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

      const distanceFactor = 0.45;
      const distance = maxDim * distanceFactor;
      const direction = new THREE.Vector3(0, 0, 1);

      const quaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(-Math.PI / 10, Math.PI / 10, -Math.PI / 20, "XYZ")
      );

      direction.applyQuaternion(quaternion);
      camera.position.copy(center).add(direction.multiplyScalar(distance));
      camera.lookAt(center);

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
      console.log((xhr.loaded / xhr.total) * 100 + "% Loaded");
    },
    function (error) {
      console.error("Error Occurred During Loading the Scene", error);
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
```

---

## **Step 3: Adding Your 3D Model**
To create a `.gltf` or `.glb` file of your experimental setup using a mobile app:

### **1. Choose a 3D Scanning App**
- **Polycam** (iOS/Android)
- **Kiri Engine** (iOS/Android)
- **Scaniverse** (iOS)
- **Trnio** (iOS)

### **2. Scan Your Experimental Setup**
- Place the setup in a well-lit area.
- Slowly move your phone around the object to capture all angles.
- Ensure key parts like the robotic hand and objects are clear.

### **3. Export the Model**
- In the app, export the model as `.gltf` or `.glb`.
- Ensure proper scale and alignment.

### **4. Add the Model to Your Project**
- Place the file in `/res/static/3dmodel/`.
- Update your HTML file:

```javascript
initModelViewer("model-container", "./res/static/3dmodel/model.gltf");
```

Test your model to ensure correct scale, orientation, and visibility. 🚀


If you have any questions or want to expand functionality, feel free to reach out! 🚀

