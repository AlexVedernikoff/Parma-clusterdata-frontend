import { Endpoints } from '../types/Endpoints';
import { ExportStatus } from '../types/ExportStatus';
import { ExportStatusDto } from './dto/ExportStatusDto';
import axiosInstance, {
  AxiosRequest,
} from '../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/axios/axios';
import settings from '../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/settings/settings';
import { $appSettingsStore } from '@shared/app-settings';

// @ts-ignore
const ENDPOINTS: Endpoints = $appSettingsStore.getState().endpoints;

const apiGetExportExcelStatus = (fileName: string) => {
  const request: AxiosRequest = {
    url: `${ENDPOINTS.export}/status/${fileName}`,
    method: 'get',
    responseType: 'json',
    headers: {},
  };

  return axiosInstance<{ status: ExportStatusDto }>(settings.requestDecorator(request));
};

export const getExportExcelStatus = async (fileName: string) => {
  const {
    data: { status },
  } = await apiGetExportExcelStatus(fileName);

  return (status as unknown) as ExportStatus;
};
