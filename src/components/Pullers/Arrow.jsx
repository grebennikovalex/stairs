import React, { useState } from "react";
import * as THREE from "three";

export default function Arrow({ direction = "x" }) {
  const a = 0.1; // halfArrow
  let rotation = [0, 0, 0];
  if (direction === "x") {
    rotation = [0, 0, Math.PI / 2];
  } else if (direction === "z") {
    rotation = [Math.PI / 2, 0, 0];
  }
  const [opacity, setOpacity] = useState(0.2);
  const arrow = new THREE.Shape();
  arrow.moveTo(a, -a);
  arrow.lineTo(a, a);
  arrow.lineTo(a * 2, a);
  arrow.lineTo(0, a + a * 2);
  arrow.lineTo(-a * 2, a);
  arrow.lineTo(-a, a);
  arrow.lineTo(-a, -a);
  arrow.lineTo(-a * 2, -a);
  arrow.lineTo(0, -a - a * 2);
  arrow.lineTo(a * 2, -a);

  const extrudeSettings = {
    depth: 0.02,
    bevelEnabled: false,
  };

  return (
    <mesh
      rotation={rotation}
      onPointerOver={() => {
        setOpacity(0.8);
      }}
      onPointerOut={() => {
        setOpacity(0.2);
      }}
    >
      <extrudeGeometry args={[arrow, extrudeSettings]} />
      <meshStandardMaterial color={"blue"} opacity={opacity} transparent />
    </mesh>
  );
}
