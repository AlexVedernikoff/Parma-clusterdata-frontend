import {
  Entry,
  exportDashboard as exportDashboardService,
  Tab,
  TabItem,
} from '../../../services/dashboard/export/export-dashboard';
import { ExportFormat } from '../../../../kamatech_modules/@parma-data-ui/chartkit/lib/modules/export/ExportFormat';
import { createDashState } from '../../../services/dashboard/create-dash-state';

export const exportDashboard = async (entry: Entry, tab: Tab, format: ExportFormat) => {
  const stateUuid = await createDashState(
    entry.entryId,
    tab.items.map(({ id }: TabItem): string => id),
  );

  exportDashboardService(entry, tab, format, stateUuid.uuid);
};
