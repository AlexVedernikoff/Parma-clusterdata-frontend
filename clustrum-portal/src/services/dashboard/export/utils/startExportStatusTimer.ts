import { ExportStatus } from '../../../../api/Dashboard';
import {
  FIRST_EXPORT_STATUS_REQUEST_DELAY,
  TIME_BETWEEN_EXPORT_STATUS_REQUESTS,
} from '../consts/timer-consts';

export const startExportStatusTimer = async (
  getExportStatusFunc: () => Promise<ExportStatus>,
  successCallback: Function,
  errorHandler: (status: ExportStatus) => void,
  delay = FIRST_EXPORT_STATUS_REQUEST_DELAY,
): Promise<void> => {
  try {
    const status = await getExportStatusFunc();

    switch (status) {
      case ExportStatus.InProgress:
        setTimeout(async () => {
          await startExportStatusTimer(
            getExportStatusFunc,
            successCallback,
            errorHandler,
            TIME_BETWEEN_EXPORT_STATUS_REQUESTS,
          );
        }, delay);

        break;
      case ExportStatus.Completed:
        await successCallback();

        break;
      default:
        errorHandler(ExportStatus.NotStarted);

        break;
    }
  } catch {
    errorHandler(ExportStatus.Failed);
  }
  return;
};
