import React, { useState } from "react";
import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { useFormContext, useWatch } from "react-hook-form";
import Arrow from "./Arrow";

export default function PullerY({ setOrbitEnabled, name, initValue }) {
  const offsetY = 1;
  const a = 0.1; // halfArrow

  const form = useFormContext();
  const { control, setValue } = form;
  const value = Number(useWatch({ control, name }));

  const [position, setPosition] = useState([0, -value / 2 - offsetY + 0.5, 0.005]);

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const bind = useGesture({
    onDragEnd: ({ offset: [y] }) => setValue(name, (y / aspect + initValue).toFixed(1)),
    onDrag: ({ offset: [y] }) => {
      const [x, , z] = position;
      setPosition([x / aspect, -y / aspect + (value - offsetY) / 2 - initValue, z]);
      setValue(name, y / aspect + initValue);
    },
  });

  return (
    <mesh
      {...bind()}
      position={position}
      onPointerOver={() => setOrbitEnabled(false)}
      onPointerOut={() => setOrbitEnabled(true)}
    >
      <Arrow direction="y" />
    </mesh>
  );
}
