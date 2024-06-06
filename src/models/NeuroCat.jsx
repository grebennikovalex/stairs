import React, { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "/node_modules/three/examples/jsm/loaders/STLLoader";

export default function NeuroCat({ position }) {
  const url = "kit-02.stl";
  const neurocat = useLoader(STLLoader, url);
  return (
    <Suspense fallback={null}>
      <mesh rotation={[0, 0, -Math.PI / 2]} position={position} receiveShadow castShadow>
        <primitive object={neurocat} />
        <meshStandardMaterial color={"yellow"} />
      </mesh>
    </Suspense>
  );
}
