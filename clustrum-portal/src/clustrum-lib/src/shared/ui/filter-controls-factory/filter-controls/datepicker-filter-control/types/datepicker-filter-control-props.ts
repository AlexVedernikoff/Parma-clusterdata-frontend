import { DateParams } from '@lib-shared/ui/filter-controls-factory/types';

export interface DatepickerFilterControlProps {
  className?: string;
  dateFormat?: string;
  label: string;
  maxDate?: string;
  minDate?: string;
  defaultValue?: DateParams;
  onChange: ((value: string) => void) | null;
  needShowTitle?: boolean;
}
