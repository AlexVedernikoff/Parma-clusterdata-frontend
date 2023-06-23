export interface goAwayLinkProps {
  loadedData: {
    entryId: string | null;
  };
  propsData: {
    id: string;
    source: string;
    params: Record<string, string>;
  };
  urlPostfix?: string;
  idPrefix?: string;
}
