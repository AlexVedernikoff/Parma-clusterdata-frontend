import { getEntryMetaRequest } from '@lib-shared/api/common-switcher-dataset';
import { EntryMetaResponse } from '../types';

export const getEntryMetaApi = async (entryId: string): Promise<EntryMetaResponse> => {
  return getEntryMetaRequest(entryId);
};
