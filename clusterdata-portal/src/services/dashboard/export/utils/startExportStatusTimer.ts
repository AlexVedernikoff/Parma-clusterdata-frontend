import { ExportStatus } from '../../../../api/Dashboard';

export const startExportStatusTimer = (
  firstDelay: number,
  timeBetweenRequests: number,
  getExportStatusFunc: () => Promise<ExportStatus>,
  successCallback: Function,
  errorHandler: (status: ExportStatus) => void,
) => {
  setTimeout(async () => {
    try {
      const status = await getExportStatusFunc();

      switch (status) {
        case ExportStatus.InProgress:
          startExportStatusTimer(
            timeBetweenRequests,
            timeBetweenRequests,
            getExportStatusFunc,
            successCallback,
            errorHandler,
          );

          break;
        case ExportStatus.Completed:
          successCallback();

          break;
        default:
          errorHandler(ExportStatus.NotStarted);

          break;
      }
    } catch {
      errorHandler(ExportStatus.Failed);
    }
  }, firstDelay);
};
