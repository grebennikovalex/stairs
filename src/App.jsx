import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import Input from "./components/Input/Input";
import "./style.scss";

const Stair = ({ position, storyHeight, steps, stairWidth, stairLength }) => {
  const stepHeight = storyHeight / steps;
  const stepDepth = stairLength / steps;
  const good = stepHeight * 2 + stepDepth > 0.6 && stepHeight * 2 + stepDepth < 0.65;
  const colorMap = useLoader(TextureLoader, good ? "plank.jpg" : "error.jpg");
  const stairSteps = [];

  for (let i = 1; i < steps + 1; i++) {
    stairSteps.push(
      <mesh key={i} position={[i * stepDepth - stepDepth / 2, 0, i * stepHeight - 0.025]}>
        <Box args={[stepDepth, stairWidth, 0.05]} castShadow receiveShadow>
          <meshStandardMaterial map={colorMap} />
        </Box>
      </mesh>
    );
  }

  return (
    <Suspense fallback={null}>
      <group position={position}>{stairSteps}</group>
    </Suspense>
  );
};

function App() {
  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      stepsNumber: 18,
      storyHeight: 2.7,
      stairWidth: 0.9,
      stairLength: 5.4,
    },
  });

  const { control } = form;
  const stepsNumber = Number(useWatch({ control, name: "stepsNumber" }));
  const storyHeight = Number(useWatch({ control, name: "storyHeight" }));
  const stairWidth = Number(useWatch({ control, name: "stairWidth" }));
  const stairLength = Number(useWatch({ control, name: "stairLength" }));

  return (
    <>
      <FormProvider {...form}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            zIndex: 1,
            margin: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "end",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <h3>Размеры в метрах</h3>
            <p>Подступенок: {(storyHeight / stepsNumber).toFixed(2)}</p>
            <p>Проступь: {(stairLength / stepsNumber).toFixed(2)}</p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <Input required name={"stairLength"} label={"Длина лестницы:"} step={0.1} />
            <Input required name={"stepsNumber"} label={"Число подъемов:"} min={3} />
            <Input required name={"storyHeight"} label={"Высота этажа:"} step={0.1} />
            <Input required name={"stairWidth"} label={"Ширина лестницы:"} step={0.1} min={0.6} />
          </div>
        </div>
      </FormProvider>
      <div style={{ height: "100vh" }}>
        <Canvas camera={{ position: [-1, -3.5, 4.5], up: [0, 0, 1] }} shadows>
          <spotLight intensity={Math.PI * 16} position={[-5, -5, 6]} visible castShadow />
          <ambientLight intensity={0.2} />
          <Stair
            position={[-stairLength / 2, 0, 0]}
            steps={stepsNumber}
            storyHeight={storyHeight}
            stairWidth={stairWidth}
            stairLength={stairLength}
          />
          <Box
            // first floor
            args={[stairLength + 1.5, 5, 0.5]}
            position={[0, stairWidth / 2 + 2.5 - 5 + 0.5, -0.25]}
            receiveShadow
          >
            <meshStandardMaterial color={"white"} />
          </Box>
          <Box
            // second floor
            args={[5, 5, storyHeight + 0.5]}
            position={[stairLength / 2 + 2.5, stairWidth / 2 + 2.5 - 5 + 0.5, storyHeight / 2 - 0.25]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={"white"} />
          </Box>
          <Box
            // wall
            args={[stairLength, 0.5, storyHeight]}
            position={[0, stairWidth / 2 + 0.25, storyHeight / 2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={"gray"} />
          </Box>
          <OrbitControls />
        </Canvas>
      </div>
    </>
  );
}

export default App;
