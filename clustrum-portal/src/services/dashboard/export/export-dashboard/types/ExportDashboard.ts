import { ExportFormat } from '../../../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/export/ExportFormat';
import { Entry } from './Entry';
import { TabItem } from './TabItem';

export interface SuccessCallbackProps {
  serverFileName: string;
  items: TabItem[];
  index: number;
  entry: Entry;
  format: ExportFormat;
}
