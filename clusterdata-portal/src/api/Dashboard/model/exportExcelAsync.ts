import axiosInstance, { AxiosRequest } from '../../../../parma_modules/@parma-data-ui/chartkit/lib/modules/axios/axios';
import settings from '../../../../parma_modules/@parma-data-ui/chartkit/lib/modules/settings/settings';

// @ts-ignore
const ENDPOINTS: Endpoints = window.DL.endpoints;

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
