import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import Input from "../../components/Input/Input";

export default function ParamsForm() {
  const form = useFormContext();
  const { control } = form;
  const stepsNumber = Number(useWatch({ control, name: "stepsNumber" }));
  const storyHeight = Number(useWatch({ control, name: "storyHeight" }));
  const stairLength = Number(useWatch({ control, name: "stairLength" }));
  return (
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
  );
}
