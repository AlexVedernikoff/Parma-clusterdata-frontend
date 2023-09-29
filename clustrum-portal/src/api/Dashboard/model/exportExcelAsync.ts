import axiosInstance, {
  AxiosRequest,
} from '../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/axios/axios';
import settings from '../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/settings/settings';
import { $appSettingsStore } from '@shared/app-settings';

// @ts-ignore
const ENDPOINTS: Endpoints = $appSettingsStore.getState().endpoints;

const apiExportExcelAsync = (data: object) => {
  const request: AxiosRequest = {
    url: `${ENDPOINTS.export}/dashboard/async`,
    method: 'post',
    data,
    responseType: 'json',
    headers: {},
  };

  return axiosInstance(settings.requestDecorator(request));
};

export const exportExcelAsync = (data: object) => {
  return apiExportExcelAsync(data);
};
