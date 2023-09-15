export interface DatepickerFilterControlProps {
  className?: string;
  dateFormat?: string;
  label: string;
  maxDate?: string;
  minDate?: string;
  defaultValue?: string;
  onChange: ((value: string) => void) | null;
  showTitle?: boolean;
}
