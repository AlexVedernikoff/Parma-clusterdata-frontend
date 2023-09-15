export enum ExportFormat {
  PDF = 'pdf',
  XLSX = 'xlsx',
  XLSX_FROM_TEMPLATE = 'xlsx_from_template',
  XLS = 'xls',
  CSV = 'csv',
  JSON = 'json',
  XML = 'xml',
  ZIP = 'zip',
  DOCX_FROM_TEMPLATE = 'docx_from_template',
}

export function GenerateFileNameFormat(
  format: ExportFormat,
  isZipDownload: boolean,
): string {
  if (format === ExportFormat.CSV || isZipDownload) {
    return ExportFormat.ZIP;
  } else {
    switch (format) {
      case ExportFormat.XLSX_FROM_TEMPLATE:
        return 'xlsx';
      case ExportFormat.DOCX_FROM_TEMPLATE:
        return 'docx';
    }
    console.log(`format ${format}`);
    return format;
  }
}

Object.freeze(ExportFormat);
