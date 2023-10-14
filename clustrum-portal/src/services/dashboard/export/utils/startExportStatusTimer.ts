import { ExportStatus } from '../../../../api/Dashboard';
import {
  FIRST_EXPORT_STATUS_REQUEST_DELAY,
  TIME_BETWEEN_EXPORT_STATUS_REQUESTS,
} from '../consts/timer-consts';

function promiseDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const startExportStatusTimer = async (
  getExportStatusFunc: () => Promise<ExportStatus>,
  successCallback: Function,
  errorHandler: (status: ExportStatus) => void,
  delay: number = FIRST_EXPORT_STATUS_REQUEST_DELAY,
): Promise<void> => {
  try {
    await promiseDelay(delay);
    const status = await getExportStatusFunc();

    switch (status) {
      case ExportStatus.InProgress:
        await startExportStatusTimer(
          getExportStatusFunc,
          successCallback,
          errorHandler,
          TIME_BETWEEN_EXPORT_STATUS_REQUESTS,
        );

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
