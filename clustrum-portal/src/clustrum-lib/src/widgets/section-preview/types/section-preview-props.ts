import { ExportWidgetOptions } from './export-widget-options';
import { Paginationinfo } from './pagination-info';
import { Widget } from './widget';

export interface SectionPreviewProps {
  configType: string;
  config: {
    shared: {
      paginationInfo: Paginationinfo;
    };
  };
  widget: Widget;
  previewEntryId: string;
  datasetError: string;
  setHighchartsWidget: (highchartsWidget: any) => void;
  onExport: (id: string, name: string, options: ExportWidgetOptions) => void;
}
