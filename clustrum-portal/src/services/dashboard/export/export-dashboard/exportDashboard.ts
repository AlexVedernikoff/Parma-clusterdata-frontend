import { saveAs } from 'file-saver';
import moment from 'moment';
import {
  ExportFormat,
  dashboardExportFilename,
} from '../../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/export/ExportFormat';
import { Entry } from './types/Entry';
import { Tab } from './types/Tab';
import { PORTAL_PATH } from '../../../../context-path';
import { store } from '../../../../store';
import { endExport, exportError, startExport } from '../../../../store/actions/dash';
import {
  downloadExportedExcel,
  exportExcelAsync,
  exportPdf,
  exportWordAsync,
  getExportExcelStatus,
} from '../../../../api/Dashboard';
import { startExportStatusTimer } from '../utils/startExportStatusTimer';
import {
  FIRST_EXPORT_STATUS_REQUEST_DELAY,
  TIME_BETWEEN_EXPORT_STATUS_REQUESTS,
} from '../consts/timer-consts';
import { clientFileName } from '../utils/clientFileName';
import { $dashboardWidgets } from '@clustrum-lib/entities/widget-container';

const exportedPagesUrl = (url: string, tabId: string, stateUuid: string) => {
  const baseUrl = `${url}?tab=${tabId}&hide-header-btns=true&export-mode=true`;

  return stateUuid ? `${baseUrl}&state-uuid=${stateUuid}` : baseUrl;
};

const exportedPagesUrls = (entry: Entry, tabId: string, stateUuid: string) => {
  const url = `${document.location.origin}${PORTAL_PATH}/dashboards_simple/${entry.entryId}`;

  return [
    {
      url: exportedPagesUrl(url, tabId, stateUuid),
    },
  ];
};

const exportToPdf = async (entry: Entry, tab: Tab, stateUuid: string) => {
  const margin = 40;

  const data = {
    createdAt: moment().format(),
    pdfOptions: {
      format: 'A4',
      displayHeaderFooter: true,
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: margin,
        bottom: margin,
        left: margin,
        right: margin,
      },
    },
    isReadySelector: '.dash-body__content',
    pages: exportedPagesUrls(entry, tab.id, stateUuid),
  };

  try {
    const response = await exportPdf(data);

    saveAs(new Blob([response.data]), `${clientFileName(entry.name, tab.title)}.pdf`);

    store.dispatch(endExport());
  } catch {
    store.dispatch(exportError());
  }
};

const exportToWord = async (entry: Entry, tab: Tab) => {
  const dashboardWidgets = $dashboardWidgets.getState();
  const exportConfig = {
    entryId: entry.entryId,
    tabId: tab.id,
    dashboardWidgets: dashboardWidgets,
  };

  try {
    const response = await exportWordAsync(exportConfig);

    saveAs(new Blob([response.data]), `${clientFileName(entry.name, tab.title)}.docx`);

    store.dispatch(endExport());
  } catch {
    store.dispatch(exportError());
  }
};

const exportToExcel = async (
  entry: Entry,
  tab: Tab,
  format = ExportFormat.XLSX,
  stateUuid: string,
) => {
  const exportConfig = {
    format,
    delValues: null,
    delNumbers: null,
    encoding: null,
  };

  const clientFileNameWithoutFormat = clientFileName(entry.name, tab.title);

  const data = {
    createdAt: moment().format(),
    dashboardId: entry.entryId,
    tabId: tab.id,
    exportConfig,
    fileName: clientFileNameWithoutFormat,
    stateUuid,
  };

  try {
    const {
      data: { fileName: serverFileName },
    } = await exportExcelAsync(data);

    startExportStatusTimer(
      FIRST_EXPORT_STATUS_REQUEST_DELAY,
      TIME_BETWEEN_EXPORT_STATUS_REQUESTS,
      () => getExportExcelStatus(serverFileName),
      async () => {
        try {
          const response = await downloadExportedExcel(serverFileName);

          saveAs(
            new Blob([response.data], { type: response.headers['content-type'] }),
            `${clientFileNameWithoutFormat}.${dashboardExportFilename(format)}`,
          );

          store.dispatch(endExport());
        } catch {
          store.dispatch(exportError());
        }
      },
      () => store.dispatch(exportError()),
    );
  } catch {
    store.dispatch(exportError());
  }
};

export const exportDashboard = (
  entry: Entry,
  tab: Tab,
  format: ExportFormat,
  stateUuid = '',
) => {
  store.dispatch(startExport());

  switch (format) {
    case ExportFormat.PDF:
      exportToPdf(entry, tab, stateUuid);

      break;
    case ExportFormat.DOCX:
      exportToWord(entry, tab);

      break;
    default:
      exportToExcel(entry, tab, format, stateUuid);

      break;
  }
};
