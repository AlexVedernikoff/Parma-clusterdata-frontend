export enum ExportFormat {
  PDF = 'pdf',
  XLSX = 'xlsx',
  XLSX_FROM_TEMPLATE = 'xlsx_from_template',
  XLS = 'xls',
  DOCX = 'docx',
  CSV = 'csv',
  JSON = 'json',
  XML = 'xml',
  ZIP = 'zip',
  DOCX_FROM_TEMPLATE = 'docx_from_template',
}

export function dashboardExportFilename(format: ExportFormat): string {
  switch (format) {
    case ExportFormat.CSV:
      return ExportFormat.ZIP;
    case ExportFormat.XLSX_FROM_TEMPLATE:
      return ExportFormat.XLSX;
    case ExportFormat.DOCX_FROM_TEMPLATE:
      return ExportFormat.DOCX;
    case ExportFormat.DOCX:
      return ExportFormat.DOCX;
    default:
      return format;
  }
}

export function widgetExportFilename(format: ExportFormat): string {
  switch (format) {
    case ExportFormat.XLSX_FROM_TEMPLATE:
      return 'xlsx';
    case ExportFormat.DOCX_FROM_TEMPLATE:
      return 'docx';
    default:
      return format;
  }
}

Object.freeze(ExportFormat);
