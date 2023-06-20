import { ExportWidgetOptions } from 'src/services/dashboard/export/export-widget/types/ExportWidgetOptions';

export interface SectionPreviewProps {
  configType: string;
  config: {
    shared: {
      paginationInfo: {
        page: number;
        pageSize: number;
      };
    };
  };
  widget: {
    name: string;
    entryId: string;
  };
  previewEntryId: string;
  datasetError: string;
  setHighchartsWidget: (highchartsWidget: any) => void;
  onExport: (id: string, name: string, options: ExportWidgetOptions) => void;
}
