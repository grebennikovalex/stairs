import React, { Suspense, useState } from "react";
import * as THREE from "three";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useGesture } from "@use-gesture/react";
import Input from "./components/Input/Input";
import "./style.scss";

const Stair = ({ position, storyHeight, steps, stairWidth, stairLength }) => {
  const stepHeight = storyHeight / steps;
  const stepDepth = stairLength / steps;
  const good = stepHeight * 2 + stepDepth >= 0.6 && stepHeight * 2 + stepDepth <= 0.65;
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

const Puller = ({ setLength, setOrbitEnabled, stairLength }) => {
  const init = 5.4;
  const pullerX = 1;
  const halfArrow = 0.2;
  const [drag, setDrag] = useState([-init / 2 - pullerX + 0.5, 0, 0.005]);
  const [opacity, setOpacity] = useState(0.2);

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const bind = useGesture({
    onDrag: ({ offset: [x] }) => {
      const [, y, z] = drag;
      setDrag([x / aspect + (stairLength - pullerX) / 2 - init, -y / aspect, z]);
      setLength(-x / aspect + init);
    },
  });

  const arrow = new THREE.Shape();
  arrow.moveTo(-halfArrow, 0.2);
  arrow.lineTo(halfArrow, 0.2);
  arrow.lineTo(halfArrow, 0.4);
  arrow.lineTo(halfArrow + 0.4, 0);
  arrow.lineTo(halfArrow, -0.4);
  arrow.lineTo(halfArrow, -0.2);
  arrow.lineTo(-halfArrow, -0.2);
  arrow.lineTo(-halfArrow, -0.4);
  arrow.lineTo(-halfArrow - 0.4, -0);
  arrow.lineTo(-halfArrow, 0.4);

  const extrudeSettings = {
    depth: 0.02,
    bevelEnabled: false,
  };

  return (
    <mesh
      scale={0.5}
      {...bind()}
      position={drag}
      onPointerOver={() => {
        setOpacity(0.8);
        setOrbitEnabled(false);
      }}
      onPointerOut={() => {
        setOpacity(0.2);
        setOrbitEnabled(true);
      }}
    >
      <extrudeGeometry args={[arrow, extrudeSettings]} />
      <meshStandardMaterial color={"blue"} opacity={opacity} transparent />
    </mesh>
  );
};

function App() {
  const [stairLength, setStairLength] = useState(5.4);
  const [orbitEnabled, setOrbitEnabled] = useState(true);
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
  // const stairLength = Number(useWatch({ control, name: "stairLength" }));

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
            {/* <Input required name={"stairLength"} label={"Длина лестницы:"} step={0.1} /> */}
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
            setOrbitEnabled={(bool) => setOrbitEnabled(bool)}
          />
          <Box
            // first floor
            args={[stairLength + 2, 5, 0.5]}
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
          <Puller
            position={[-stairLength / 2, 0, 0.1]}
            setOrbitEnabled={setOrbitEnabled}
            stairLength={stairLength}
            setLength={(length) => setStairLength(length)}
          />
          <OrbitControls enabled={orbitEnabled} />
        </Canvas>
      </div>
    </>
  );
}

export default App;
