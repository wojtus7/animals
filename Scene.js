import React, { Component } from "react";
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

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  return (
    <GLView
      style={{ flex: 1 }}
      onContextCreate={async (gl) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 0x6ad6f0;

        // Create a WebGLRenderer without a DOM element
        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor(sceneColor);

        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(2, 5, 5);

        const scene = new Scene();
        scene.fog = new Fog(sceneColor, 1, 10000);
        scene.add(new GridHelper(10, 10));

        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);

        const pointLight = new PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(0, 200, 200);
        scene.add(pointLight);

        const spotLight = new SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 500, 100);
        spotLight.lookAt(scene.position);
        scene.add(spotLight);

        const obj = await loadAsync(
          [require('./assets/van.obj'), require('./assets/van.mtl')],
          null,
          imageName => resources[imageName],
        );
        scene.add(obj);


        const cube = new IconMesh();
        // scene.add(cube);

        camera.lookAt(cube.position);

        function update() {
          obj.rotation.y += 0.05;
          // obj.rotation.x += 0.025;
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

class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxBufferGeometry(1.0, 4.0, 1.0),
      new MeshStandardMaterial({
        map: new TextureLoader().load(require('./assets/icon.png')),
        // color: 0xff0000
      })
    );
  }
}