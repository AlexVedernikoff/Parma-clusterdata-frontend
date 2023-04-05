import { saveAs } from 'file-saver';
import moment from 'moment';
import { ExportFormat } from '../../../../../kamatech_modules/@parma-data-ui/chartkit/lib/modules/export/ExportFormat';
import { Entry } from './types/Entry';
import { Tab } from './types/Tab';
import { PORTAL_PATH } from '../../../../context-path';
import { store } from '../../../../store';
import { endExport, exportError, startExport } from '../../../../store/actions/dash';
import { downloadExportedExcel, exportExcelAsync, exportPdf, getExportExcelStatus } from '../../../../api/Dashboard';
import { startExportStatusTimer } from '../utils/startExportStatusTimer';
import { FIRST_EXPORT_STATUS_REQUEST_DELAY, TIME_BETWEEN_EXPORT_STATUS_REQUESTS } from '../consts/timer-consts';
import { clientFileName } from '../utils/clientFileName';

const generateFileNameFormat = (format: ExportFormat) => {
  return format === ExportFormat.CSV ? ExportFormat.ZIP : format;
};

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

const exportToExcel = async (entry: Entry, tab: Tab, format = ExportFormat.XLSX, stateUuid: string) => {
  const exportConfig = {
    format,
    delValues: null,
    delNumbers: null,
    encoding: null,
  };

  const clientFileNameWithoutFormat = clientFileName(entry.name, tab.title);

  const data = {
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
            `${clientFileNameWithoutFormat}.${generateFileNameFormat(format)}`,
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

export const exportDashboard = (entry: Entry, tab: Tab, format: ExportFormat, stateUuid = '') => {
  store.dispatch(startExport());

  switch (format) {
    case ExportFormat.PDF:
      exportToPdf(entry, tab, stateUuid);

      break;
    default:
      exportToExcel(entry, tab, format, stateUuid);

      break;
  }
};
