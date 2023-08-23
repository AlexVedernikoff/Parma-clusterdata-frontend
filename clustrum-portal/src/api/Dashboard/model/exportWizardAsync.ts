import axiosInstance, {
  AxiosRequest,
} from '../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/axios/axios';
import settings from '../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/settings/settings';
import { $appSettingsStore } from '@entities/app-settings';

// @ts-ignore
const ENDPOINTS: Endpoints = $appSettingsStore.getState().endpoints;

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
