import React, { useState } from 'react';
import './ParmaRangePicker.css';
import { ParmaRangePicker } from './ParmaRangePicker.interface';

export function ParmaRangePicker({ min = 0, max = 100, step = 1, initialValue = 0, onChange }: ParmaRangePicker) {
  const [value, setValue] = useState<number>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
  };

  const handleChangeEnd = () => {
    onChange(value);
  };

  return (
    <div className="range-picker">
      <input
        className="range-picker__input"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        onMouseUp={handleChangeEnd}
      />
      <output className="range-picker__output">{value}</output>
    </div>
  );
}
