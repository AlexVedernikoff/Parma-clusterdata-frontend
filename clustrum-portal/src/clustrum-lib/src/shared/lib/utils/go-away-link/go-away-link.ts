import { GoAwayLinkProps } from '@lib-widgets/section-preview/types/index';

export const goAwayLink = ({
  loadedData,
  propsData,
  urlPostfix = '',
  idPrefix = '',
}: GoAwayLinkProps): string => {
  const { endpoints } = window.DL;
  let url = endpoints.wizard + urlPostfix;
  url +=
    loadedData.entryId || propsData.id
      ? idPrefix + (loadedData.entryId || propsData.id)
      : propsData.source;

  let query = new URLSearchParams({ ...propsData.params }).toString();
  query = query ? '?' + query : query;

  return url + query;
};
