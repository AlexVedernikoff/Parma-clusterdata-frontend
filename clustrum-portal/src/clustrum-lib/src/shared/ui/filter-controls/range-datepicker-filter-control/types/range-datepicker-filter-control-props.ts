import { PickerValue } from './picker-value';

export interface RangeDatepickerFilterControlProps {
  className?: string;
  dateFormat?: string;
  label: string;
  maxDate?: string;
  minDate?: string;
  value?: PickerValue;
  onChange(value: PickerValue): void;
}
