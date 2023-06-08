export { default as Wizard } from './modules/legacy-wizard/Wizard';
export { DashKit, pluginTitle, pluginWidget } from './modules/legacy-dashboard/src';

export {
  TitleInfoElement,
  TitleInfoElementProps,
} from './shared/ui/info-elements/title-info-element/title-info-element';

export { useDebounce } from './shared/lib/hooks/use-debounce/use-debounce';

export {
  InputFilterControl,
  InputFilterControlProps,
} from './shared/ui/filter-controls/input-filter-control/input-filter-control';
export {
  SelectFilterControl,
  SelectFilterControlProps,
} from './shared/ui/filter-controls/select-filter-control/select-filter-control';
export {
  DatepickerFilterControl,
  DatepickerProps,
} from './shared/ui/filter-controls/datepicker-filter-control/datepicker-filter-control';
export {
  RangeDatepickerFilterControl,
  RangeDatepickerProps,
} from './shared/ui/filter-controls/range-datepicker-filter-control/range-datepicker-filter-control';
export { PickerValue } from './shared/ui/filter-controls/range-datepicker-filter-control/types/picker-value';
export {
  TableWidget,
  TableWidgetProps,
  createCell,
} from './shared/ui/widgets/table-widget';
export {
  ChartWidget,
  ChartWidgetProps,
} from './shared/ui/widgets/chart-widget/chart-widget';
