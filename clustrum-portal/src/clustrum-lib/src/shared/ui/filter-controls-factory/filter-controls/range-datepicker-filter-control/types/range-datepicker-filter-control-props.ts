import { FieldDataType } from '../../../types';

export interface RangeDatepickerFilterControlProps {
  className?: string;
  dateFormat?: string;
  fieldDataType?: FieldDataType;
  label: string;
  maxDate?: string;
  minDate?: string;
  defaultValue?: string;
  onChange: ((value: string) => void) | null;
  showTitle?: boolean;
}
