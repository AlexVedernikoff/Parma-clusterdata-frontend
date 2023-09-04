import {
  ChartWidgetProps,
  ChartWidgetData,
} from '@lib-shared/ui/widgets-factory/widgets/chart-widget/types';
import { UnknownWidgetProps } from '@lib-shared/ui/widgets-factory/widgets/unknown-widget/types';
import { WidgetType } from '.';

interface ConfigType {
  shouldHideComments: boolean;
  shouldShowSideHtml: boolean;
}

// TODO: Взято из `Control.js`, после типизации `Control`-а импортировать типы оттуда
interface SchemeItem {
  type: 'select' | 'button' | 'input' | 'checkbox' | 'datepicker' | 'range-datepicker';
  param: string;
  label: string;
  updateOnChange: boolean;
  updateControlsOnChange: boolean;
}

interface WidgetData {
  widgetType: WidgetType;
  // Следующие два нужны только для `SideHtml`
  config: ConfigType;
  sideHtml: string;
  // Всё что ниже, нужно только для проброса в `Control`
  entryId: string;
  // Тип `object` в `Control.js`
  // TODO: Типизировать `params` после типизации `Control`
  params: object;
  uiScheme: SchemeItem[];
}

// TODO: При типизации остальных виджетов добавлять их пропсы в список родителей
export interface WidgetProps extends UnknownWidgetProps, ChartWidgetProps {
  data: ChartWidgetData & WidgetData;
  onChange(): void;
}
