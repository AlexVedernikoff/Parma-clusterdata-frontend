import { EntryMetaResponse, getEntryMetaApi } from '../../api/get-entry-meta';

export const CommonSwitcherDatasetModel = async (
  entryId: string,
): Promise<EntryMetaResponse | null> => {
  let entryMeta = null;

  try {
    const entryMetaResult = await getEntryMetaApi(entryId);
    entryMeta = entryMetaResult;
  } catch (error) {
    console.error('COMMON_SWITCHER_DATASET_GET_ENTRY', error);
  }

  return entryMeta;
};
