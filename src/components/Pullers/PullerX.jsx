import React, { useState } from "react";
import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { useFormContext, useWatch } from "react-hook-form";
import Arrow from "./Arrow";

export default function PullerX({ setOrbitEnabled, name, initValue }) {
  const offsetX = 1;
  const a = 0.1; // halfArrow

  const form = useFormContext();
  const { control, setValue } = form;
  const value = Number(useWatch({ control, name }));

  const [position, setPosition] = useState([-value / 2 - offsetX + 0.5, 0, 0.005]);

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const bind = useGesture({
    onDragEnd: ({ offset: [x] }) => setValue(name, (-x / aspect + initValue).toFixed(1)),
    onDrag: ({ offset: [x] }) => {
      const [, y, z] = position;
      setPosition([x / aspect + (value - offsetX) / 2 - initValue, -y / aspect, z]);
      setValue(name, -x / aspect + initValue);
    },
  });

  return (
    <mesh
      {...bind()}
      position={position}
      onPointerOver={() => setOrbitEnabled(false)}
      onPointerOut={() => setOrbitEnabled(true)}
    >
      <Arrow direction="x" />
    </mesh>
  );
}
