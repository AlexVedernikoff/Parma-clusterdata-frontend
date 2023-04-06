export interface KamatechRangePicker {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  onChange: (value: number) => any;
}
