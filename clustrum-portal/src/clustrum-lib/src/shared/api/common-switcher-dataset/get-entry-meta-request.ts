import axios, { AxiosRequestConfig } from 'axios';
import ENV from 'ENV';
import { EntryMetaResponse } from './dto';

export const getEntryMetaRequest = (entryId: string): Promise<EntryMetaResponse> => {
  const requestConfig: AxiosRequestConfig = {
    method: 'post',
    url: `${ENV.biHost}/getEntryMeta`,
    data: { entryId },
  };

  return axios(requestConfig).then(response => response.data);
};
