import {
  exportWidget as exportWidgetService,
  ExportWidgetOptions,
} from '../../../services/dashboard/export/export-widget';

export const exportWidget = (id: string, name: string, options?: ExportWidgetOptions) => {
  exportWidgetService({ id, name }, undefined, options);
};
