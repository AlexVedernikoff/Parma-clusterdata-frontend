import { getEntryMetaRequest } from '@lib-shared/api/common-switcher-dataset';

export interface EntryMetaResponse {
  entryId: string;
  key: string;
  scope: string;
  tenantId: string;
}

export const getEntryMetaApi = async (entryId: string): Promise<EntryMetaResponse> => {
  return getEntryMetaRequest(entryId);
};
