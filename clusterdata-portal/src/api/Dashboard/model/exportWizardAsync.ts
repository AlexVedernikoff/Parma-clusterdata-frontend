import axiosInstance, {
  AxiosRequest,
} from '../../../../kamatech_modules/@parma-data-ui/chartkit/lib/modules/axios/axios';
import settings from '../../../../kamatech_modules/@parma-data-ui/chartkit/lib/modules/settings/settings';

// @ts-ignore
const ENDPOINTS: Endpoints = window.DL.endpoints;

const apiExportWizardAsync = (data: object) => {
  const request: AxiosRequest = {
    url: `${ENDPOINTS.export}/wizard/async`,
    method: 'post',
    data,
    responseType: 'json',
    headers: {},
  };

  return axiosInstance(settings.requestDecorator(request));
};

export const exportWizardAsync = (data: object) => {
  return apiExportWizardAsync(data);
};
