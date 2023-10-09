export interface TabItem {
  id: string;
  data: {
    data: {
      uuid: string;
      params: string;
    };
    widgetId: string;
  }[];
  hasExportTemplateXlsx?: boolean;
  hasExportTemplateDocx?: boolean;
}
