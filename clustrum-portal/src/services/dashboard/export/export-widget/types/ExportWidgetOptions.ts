import { Encoding } from '../../../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/export/Encoding';
import { ExportFormat } from '../../../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/export/ExportFormat';

export interface ExportWidgetOptions {
  delValues: string;
  delNumbers: string;
  format: ExportFormat;
  encoding: Encoding;
}
