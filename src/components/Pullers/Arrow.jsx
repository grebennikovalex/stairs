import React, { useState } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";

export default function Arrow({ direction = "x" }) {
  const a = 0.1; // halfArrow

  const points = [
    [a, -a],
    [a, a],
    [a * 2, a],
    [0, a + a * 2],
    [-a * 2, a],
    [-a, a],
    [-a, -a],
    [-a * 2, -a],
    [0, -a - a * 2],
    [a * 2, -a],
    [a, -a],
  ];

  let rotation = [0, 0, 0];
  if (direction === "x") {
    rotation = [0, 0, Math.PI / 2];
  } else if (direction === "z") {
    rotation = [Math.PI / 2, 0, 0];
  }
  const [thickness, setThickness] = useState(1);

  const arrow = new THREE.Shape();

  arrow.moveTo(points[0].at(0), points[0].at(1));

  for (let i = 1; i < 11; i++) {
    arrow.lineTo(points[i].at(0), points[i].at(1));
  }

  const extrudeSettings = {
    depth: 0,
    bevelEnabled: false,
  };

  return (
    <group>
      <mesh
        rotation={rotation}
        onPointerOver={() => {
          setThickness(3);
        }}
        onPointerOut={() => {
          setThickness(1);
        }}
      >
        <extrudeGeometry args={[arrow, extrudeSettings]} />
        <meshStandardMaterial color={"blue"} opacity={0.2} transparent />
      </mesh>
      <Line rotation={rotation} points={points} color="blue" lineWidth={thickness} />
    </group>
  );
}
