import { Endpoints } from '../types/Endpoints';
import axiosInstance, {
  AxiosRequest,
} from '../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/axios/axios';
import settings from '../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/settings/settings';
import { $appSettingsStore } from '@shared/app-settings';

// @ts-ignore
const ENDPOINTS: Endpoints = $appSettingsStore.getState().endpoints;

const apiDownloadExportedExcel = (fileName: string) => {
  const request: AxiosRequest = {
    url: `${ENDPOINTS.export}/resource/${fileName}`,
    method: 'get',
    responseType: 'blob',
    headers: {},
  };

  return axiosInstance(settings.requestDecorator(request));
};

export const downloadExportedExcel = (fileName: string) => {
  return apiDownloadExportedExcel(fileName);
};
