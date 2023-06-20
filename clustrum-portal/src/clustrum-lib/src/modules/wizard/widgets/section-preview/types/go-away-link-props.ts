export interface goAwayLinkProps {
  loadedData: {
    entryId: string | null;
  };
  propsData: {
    id: string;
    source: string;
    params: object;
  };
  urlPostfix?: string;
  idPrefix?: string;
}
