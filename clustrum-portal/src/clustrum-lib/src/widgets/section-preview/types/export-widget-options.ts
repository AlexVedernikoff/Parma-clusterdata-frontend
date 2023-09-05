import { ExportFormat } from './export-format';
import { Encoding } from './encoding';

export interface ExportWidgetOptions {
  delValues: string;
  delNumbers: string;
  format: ExportFormat;
  encoding: Encoding;
}
