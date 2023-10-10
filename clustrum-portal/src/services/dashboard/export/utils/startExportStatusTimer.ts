import { ExportStatus } from '../../../../api/Dashboard';

export const startExportStatusTimer = async (
  getExportStatusFunc: () => Promise<ExportStatus>,
  successCallback: Function,
  errorHandler: (status: ExportStatus) => void,
): Promise<void> => {
  try {
    const status = await getExportStatusFunc();

    switch (status) {
      case ExportStatus.InProgress:
        await startExportStatusTimer(getExportStatusFunc, successCallback, errorHandler);

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
