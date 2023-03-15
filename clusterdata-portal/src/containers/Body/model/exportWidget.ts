import {
  exportWidget as exportWidgetService,
  ExportWidgetOptions,
} from '../../../services/dashboard/export/export-widget';
import { createDashState } from '../../../services/dashboard/create-dash-state';

export const exportWidget = (
  id: string,
  name: string,
  tabTitle: string,
  tabItemIds: string[],
  options?: ExportWidgetOptions,
) => {
  exportWidgetService({ id, name, tabTitle }, entryId => createDashState(entryId, tabItemIds), options);
};
