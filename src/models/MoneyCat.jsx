import React, { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "/node_modules/three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";

export default function MoneyCat({ position }) {
  const url =
    "https://firebasestorage.googleapis.com/v0/b/stair-maker.appspot.com/o/maneki.gltf?alt=media&token=fbc69b8b-96e2-4293-80be-d7a0703cdc7d";
  const colorMap = useLoader(TextureLoader, "maneki_neko_white_diffuse.jpg");
  const { scene, nodes, materials } = useLoader(
    GLTFLoader,
    url,
    (_) => {},
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
  );
  console.log(nodes, materials);
  return (
    <Suspense fallback={null}>
      <mesh
        geometry={nodes.maneki_neko_gold.geometry}
        rotation={[Math.PI / 2, -Math.PI / 1.5, 0]}
        scale={0.1}
        position={position}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial map={colorMap} />
        {/* <primitive object={scene} /> */}
      </mesh>
    </Suspense>
  );
}
