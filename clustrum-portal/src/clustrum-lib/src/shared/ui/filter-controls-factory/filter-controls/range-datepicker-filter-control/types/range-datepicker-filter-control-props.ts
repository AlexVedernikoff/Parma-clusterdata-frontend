import { DateParams } from '@lib-shared/ui/filter-controls-factory/types';
import { PickerValue } from './picker-value';

export interface RangeDatepickerFilterControlProps {
  className?: string;
  dateFormat?: string;
  label: string;
  maxDate?: string;
  minDate?: string;
  defaultValue?: DateParams;
  onChange: ((value: PickerValue) => void) | null;
  showTitle?: boolean;
}
