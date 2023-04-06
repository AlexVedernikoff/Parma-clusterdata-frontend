import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParmaRangePicker } from './ParmaRangePicker';

describe('range picker', () => {
  let rangeInput: HTMLInputElement;
  let output: HTMLElement;
  let mockFn: (v: number) => void;
  const initialValue = 20;
  const minValue = 10;
  const maxValue = 80;

  beforeEach(() => {
    mockFn = jest.fn();
    render(<ParmaRangePicker initialValue={initialValue} min={minValue} max={maxValue} onChange={mockFn} />);
    rangeInput = screen.getByRole('slider');
    output = screen.getByRole('status');
  });

  it('initial value should be in a range input and output', () => {
    expect(Number(rangeInput.value)).toBe(initialValue);
    expect(Number(output.innerHTML)).toEqual(initialValue);
  });

  it('range input change should change output value', () => {
    fireEvent.change(rangeInput, { target: { value: 40 } });
    expect(Number(output.innerHTML)).toEqual(40);
  });

  it('check min', () => {
    fireEvent.change(rangeInput, { target: { value: 0 } });
    expect(Number(rangeInput.value)).toBe(minValue);
    expect(Number(output.innerHTML)).toEqual(minValue);
  });

  it('check max', () => {
    fireEvent.change(rangeInput, { target: { value: 100 } });
    expect(Number(rangeInput.value)).toBe(maxValue);
    expect(Number(output.innerHTML)).toEqual(maxValue);
  });

  it('range input change end should call onChange function', () => {
    fireEvent.mouseUp(rangeInput);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
