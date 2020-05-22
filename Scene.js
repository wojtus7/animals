import { includes } from 'lodash';
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

export default function App({ furnitures }) {
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

        const room = await loadAsync(
          [require('./assets/room1.obj'), require('./assets/room1.mtl')],
          null,
          imageName => resources[imageName],
        );
        scene.add(room);

        if (includes(furnitures, 'bed')) {
          const bed = await loadAsync(
            [require('./assets/bedFurniture.obj'), require('./assets/bedFurniture.mtl')],
            null,
            imageName => resources[imageName],
          );
          scene.add(bed);
        }

        if (includes(furnitures, 'tv')) {
          const tv = await loadAsync(
            [require('./assets/tvFurniture.obj'), require('./assets/tvFurniture.mtl')],
            null,
            imageName => resources[imageName],
          );
          scene.add(tv);
        }

        if (includes(furnitures, 'rug')) {
          const rug = await loadAsync(
            [require('./assets/rugsFurniture.obj'), require('./assets/rugsFurniture.mtl')],
            null,
            imageName => resources[imageName],
          );
          scene.add(rug);
        }

        if (includes(furnitures, 'plants')) {
          const plants = await loadAsync(
            [require('./assets/plantsFurniture.obj'), require('./assets/plantsFurniture.mtl')],
            null,
            imageName => resources[imageName],
          );
          scene.add(plants);
        }

        if (includes(furnitures, 'radio')) {
          const radio = await loadAsync(
            [require('./assets/radioFurniture.obj'), require('./assets/radioFurniture.mtl')],
            null,
            imageName => resources[imageName],
          );
          scene.add(radio);
        }

        if (includes(furnitures, 'office')) {
          const office = await loadAsync(
            [require('./assets/officeFurniture.obj'), require('./assets/officeFurniture.mtl')],
            null,
            imageName => resources[imageName],
          );
          scene.add(office);
        }

        if (includes(furnitures, 'sofa')) {
          const sofa = await loadAsync(
            [require('./assets/sofaFurniture.obj'), require('./assets/sofaFurniture.mtl')],
            null,
            imageName => resources[imageName],
          );
          scene.add(sofa);
        }

        scene.position.y = 0.4;

        let lastchange = 0;
        function update() {
          change = lastchange + 0.01;
          scene.rotation.y += Math.cos(change) / 1000;
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