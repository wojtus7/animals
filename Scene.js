import React, { useEffect } from "react";
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer, TextureLoader, loadAsync } from 'expo-three';

import {
  AmbientLight,
  BoxBufferGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from 'three';

export default function App() {
  let timeout;

  useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  return (
    <GLView
      style={{ flex: 1 }}
      onContextCreate={async (gl) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 0x999999;

        // Create a WebGLRenderer without a DOM element
        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor(sceneColor);

        const camera = new PerspectiveCamera(75, width / height, 0.01, 1000);
        camera.position.set(0, 1.2, 3.5);

        const scene = new Scene();
        scene.fog = new Fog(sceneColor, 1, 10000);

        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);

        const pointLight = new PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(100, 100, 200);
        scene.add(pointLight);

        const spotLight = new SpotLight(0xffffff, 0.4);
        spotLight.position.set(100, 500, 100);
        spotLight.lookAt(scene.position);
        scene.add(spotLight);
        

        const spotLight2 = new SpotLight(0xffffff, 0.4);
        spotLight2.position.set(-100, 0, 0);
        spotLight2.lookAt(scene.position);
        scene.add(spotLight2);

        const obj = await loadAsync(
          [require('./assets/room.obj'), require('./assets/room.mtl')],
          null,
          imageName => resources[imageName],
        );
        scene.add(obj);
        obj.position.y = 0.4;

        let lastchange = 0;
        function update() {
          change = lastchange + 0.01;
          obj.rotation.y += Math.cos(change)/ 1000;
          lastchange = change;
        }

        // Setup an animation loop
        const render = () => { 
          timeout = requestAnimationFrame(render);
          update();
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };
        render();
      }}
    />
  );
}