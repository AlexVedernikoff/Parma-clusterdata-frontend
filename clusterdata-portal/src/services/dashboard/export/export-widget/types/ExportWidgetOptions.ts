import { Encoding } from '../../../../../../parma_modules/@parma-data-ui/chartkit/lib/modules/export/Encoding';
import { ExportFormat } from '../../../../../../parma_modules/@parma-data-ui/chartkit/lib/modules/export/ExportFormat';

export interface ExportWidgetOptions {
  delValues: string;
  delNumbers: string;
  format: ExportFormat;
  encoding: Encoding;
}
