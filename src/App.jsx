import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Plane, Box } from "@react-three/drei";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import Input from "./components/Input/Input";
import "./style.scss";

const Stair = ({ position, storyHeight, steps, stairWidth, stairLength }) => {
  const colorMap = useLoader(TextureLoader, "plank.jpg");
  const stepSize = stairLength / steps;
  const stepHeight = storyHeight / steps;

  const stairDepth = stairLength / steps;

  const stairSteps = [];

  for (let i = 0; i < steps; i++) {
    stairSteps.push(
      <mesh key={i} position={[i * stepSize, 0, i * stepHeight]} castShadow={true}>
        <Box args={[stairDepth, stairWidth, 0.1]}>
          <meshStandardMaterial map={colorMap} />
        </Box>
      </mesh>
    );
  }

  return <group position={position}>{stairSteps}</group>;
};

function App() {
  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      stepsNumber: 10,
      storyHeight: 6,
      stairWidth: 3,
      stairLength: 10,
    },
  });

  const { control } = form;
  const stepsNumber = useWatch({ control, name: "stepsNumber" });
  const storyHeight = useWatch({ control, name: "storyHeight" });
  const stairWidth = useWatch({ control, name: "stairWidth" });
  const stairLength = useWatch({ control, name: "stairLength" });

  return (
    <FormProvider {...form}>
      <div style={{ display: "flex", width: "200px", position: "absolute", zIndex: 1, margin: "8px", gap: "8px" }}>
        <Input required name={"stairLength"} label={"Длина лестницы:"} />
        <Input required name={"stepsNumber"} label={"Число ступеней:"} />
        <Input required name={"storyHeight"} label={"Высота этажа:"} />
        <Input required name={"stairWidth"} label={"Ширина лестницы:"} step={0.1} />
      </div>
      <div style={{ height: "100vh" }}>
        <Canvas camera={{ position: [0, 0, 10], up: [0, 0, 1] }} shadows={true}>
          <Suspense fallback={null}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} castShadow={true} />
            <Stair
              position={[-5, 0, 0]}
              steps={stepsNumber}
              storyHeight={storyHeight}
              stairWidth={stairWidth}
              stairLength={stairLength}
            />
            <Box args={[20, 10, 0.1]} position={[3, 0, -0.1]} receiveShadow={true}>
              <meshStandardMaterial color={"white"} />
            </Box>
            <OrbitControls />
          </Suspense>
        </Canvas>
      </div>
    </FormProvider>
  );
}

export default App;
