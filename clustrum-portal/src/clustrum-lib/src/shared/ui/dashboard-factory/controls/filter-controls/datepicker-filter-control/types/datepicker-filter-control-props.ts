import { DefaultValueType } from '@lib-shared/ui/dashboard-factory/DashboardControlsTypes';

export interface DatepickerFilterControlProps {
  className?: string;
  dateFormat?: string;
  label: string;
  maxDate?: string;
  minDate?: string;
  defaultValue?: {
    type: DefaultValueType;
    value: { from: string; to: string };
  };
  onChange: ((value: string) => void) | null;
}
