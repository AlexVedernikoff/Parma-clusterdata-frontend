import axiosInstance, { AxiosRequest } from '../../../../parma_modules/@parma-data-ui/chartkit/lib/modules/axios/axios';
import settings from '../../../../parma_modules/@parma-data-ui/chartkit/lib/modules/settings/settings';

// @ts-ignore
const ENDPOINTS: Endpoints = window.DL.endpoints;

const apiExportPdf = (data: object) => {
  const request: AxiosRequest = {
    url: `${ENDPOINTS.exportPdf}`,
    method: 'post',
    data,
    responseType: 'blob',
    headers: {},
  };

  return axiosInstance(settings.requestDecorator(request));
};

export const exportPdf = (data: object) => {
  return apiExportPdf(data);
};
