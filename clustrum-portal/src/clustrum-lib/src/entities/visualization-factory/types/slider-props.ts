export interface SliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}
