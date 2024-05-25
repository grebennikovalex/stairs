import React, { useState } from "react";
import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { useFormContext, useWatch } from "react-hook-form";
import Arrow from "./Arrow";

export default function PullerZ({ setOrbitEnabled, name, initValue }) {
  const a = 0.1; // halfArrow

  const form = useFormContext();
  const { control, setValue } = form;
  const value = Number(useWatch({ control, name }));

  const [position, setPosition] = useState([0, 0, value]);

  const { size, viewport } = useThree();
  const aspect = size.height / viewport.height;

  const bind = useGesture({
    onDragEnd: ({ offset: [, z] }) => setValue(name, (-z / aspect + initValue).toFixed(1)),
    onDrag: ({ offset: [, z] }) => {
      const [x, y, ,] = position;
      setPosition([x / aspect, y / aspect, -z / aspect + initValue]);
      setValue(name, -z / aspect + initValue);
    },
  });

  return (
    <mesh
      {...bind()}
      position={position}
      onPointerOver={() => setOrbitEnabled(false)}
      onPointerOut={() => setOrbitEnabled(true)}
    >
      <Arrow direction="z" />
    </mesh>
  );
}
