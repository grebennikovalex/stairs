import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import style from "./Input.module.scss";

export default function Input({ label, name, required = false, step = 1 }) {
  const { register, control } = useFormContext();

  return (
    <div className={style.wrapper}>
      <label className={style.label}>{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <input
            {...register(name, { required })}
            type={"number"}
            className={style.input}
            value={value}
            onChange={onChange}
            step={step}
          />
        )}
      />
    </div>
  );
}
