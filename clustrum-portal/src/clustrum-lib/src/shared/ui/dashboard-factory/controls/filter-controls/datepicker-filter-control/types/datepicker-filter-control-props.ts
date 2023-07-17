import { DateParams } from '@lib-shared/ui/dashboard-factory/DashboardControlsTypes';

export interface DatepickerFilterControlProps {
  className?: string;
  dateFormat?: string;
  label: string;
  maxDate?: string;
  minDate?: string;
  defaultValue?: DateParams;
  onChange: ((value: string) => void) | null;
}
