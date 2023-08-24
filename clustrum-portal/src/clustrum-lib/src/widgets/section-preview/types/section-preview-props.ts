import { ExportWidgetOptions } from './export-widget-options';
import { PaginationInfo } from './pagination-info';
import { Widget } from './widget';

export interface SectionPreviewProps {
  configType: string;
  config: {
    shared: {
      paginationInfo: PaginationInfo;
    };
  };
  widget: Widget;
  datasetError: string;
  setWidget: (widget: any) => void;
  onExport: (id: string, name: string, options: ExportWidgetOptions) => void;
}
