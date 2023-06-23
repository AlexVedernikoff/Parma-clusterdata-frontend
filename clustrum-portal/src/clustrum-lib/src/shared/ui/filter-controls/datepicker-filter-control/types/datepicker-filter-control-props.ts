export interface DatepickerFilterControlProps {
  className?: string;
  dateFormat?: string;
  label: string;
  maxDate?: string;
  minDate?: string;
  value?: string;
  onChange(value: string): void;
}
