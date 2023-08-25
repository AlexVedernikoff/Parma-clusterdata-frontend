import { getEntryMetaApi } from '../../api/get-entry-meta';
import { EntryMetaResponse } from '../../types';

export const getCommonSwitcherDatasetModel = async (
  entryId: string,
): Promise<EntryMetaResponse | null> => {
  try {
    const entryMetaResult = await getEntryMetaApi(entryId);
    return entryMetaResult;
  } catch (error) {
    console.error('COMMON_SWITCHER_DATASET_GET_ENTRY', error);
    return null;
  }
};
