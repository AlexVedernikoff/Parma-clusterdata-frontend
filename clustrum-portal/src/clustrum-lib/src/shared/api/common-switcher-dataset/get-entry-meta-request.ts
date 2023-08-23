import axios, { AxiosRequestConfig } from 'axios';
import { EntryMetaResponse } from './dto';

export const getEntryMetaRequest = (entryId: string): Promise<EntryMetaResponse> => {
  const requestConfig: AxiosRequestConfig = {
    method: 'post',
    url: `${process.env.REACT_APP_CLUSTRUM_BI_HOST}/getEntryMeta`,
    data: { entryId },
  };

  return axios(requestConfig).then(response => response.data);
};
