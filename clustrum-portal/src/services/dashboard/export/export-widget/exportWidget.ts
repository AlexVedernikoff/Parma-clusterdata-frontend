import { saveAs } from 'file-saver';
import { Encoding } from '../../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/export/Encoding';
import {
  getStorageState,
  setStorageState,
} from '../../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/export/export';
import {
  Encoding as ApiEncoding,
  getExportExcelStatus,
  downloadExportedExcel,
  exportWizardAsync,
} from '../../../../api/Dashboard';
import { store } from '../../../../store';
import { endExport, exportError, startExport } from '../../../../store/actions/dash';
import {
  FIRST_EXPORT_STATUS_REQUEST_DELAY,
  TIME_BETWEEN_EXPORT_STATUS_REQUESTS,
} from '../consts/timer-consts';
import { CreateStateUuidFunc } from '../../create-dash-state';
import { ExportWidgetOptions } from './types/ExportWidgetOptions';
import { WidgetData } from './types/WidgetData';
import { clientFileName } from '../utils/clientFileName';
import { startExportStatusTimer } from '../utils/startExportStatusTimer';
import {
  dashboardExportFilename,
  widgetExportFilename,
} from '@kamatech-data-ui/chartkit/lib/modules/export/ExportFormat';
import moment from 'moment';

async function getStateUuid(
  entryId: string,
  createStateUuid: CreateStateUuidFunc | undefined,
) {
  if (!createStateUuid) {
    return '';
  }

  const stateUuid = await createStateUuid(entryId);

  return stateUuid.uuid;
}

export const exportWidget = async (
  widgetData: WidgetData,
  createStateUuid?: CreateStateUuidFunc,
  options: ExportWidgetOptions = getStorageState(),
) => {
  store.dispatch(startExport());

  setStorageState(options);

  const uuid = await getStateUuid(widgetData.id, createStateUuid);

  const data = {
    ...widgetData,
    stateUuid: uuid,
    createdAt: moment().format(),
    exportConfig: {
      delimiter: options.delValues,
      format: options.format,
      floatDelimiter: options.delNumbers,
      encoding: options.encoding
        ? options.encoding === Encoding.UTF8
          ? ApiEncoding.UTF8
          : ApiEncoding.CP1251
        : null,
    },
  };

  const clientFileNameWithoutFormat = clientFileName(
    widgetData.name,
    widgetData.tabTitle,
  );

  try {
    const {
      data: { fileName: serverFileName },
    } = await exportWizardAsync(data);

    startExportStatusTimer(
      FIRST_EXPORT_STATUS_REQUEST_DELAY,
      TIME_BETWEEN_EXPORT_STATUS_REQUESTS,
      () => getExportExcelStatus(serverFileName),
      async () => {
        try {
          const response = await downloadExportedExcel(serverFileName);

          saveAs(
            new Blob([response.data], { type: response.headers['content-type'] }),
            `${clientFileNameWithoutFormat}.${widgetExportFilename(
              data.exportConfig.format,
            )}`,
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
