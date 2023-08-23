export interface EntryMeta {
  entryId: string;
  key: string;
}

export interface CommonSwitcherDatasetProps {
  title: string;
  entryId: string;
  entryMeta: null | EntryMeta;
  onClick(entryId: string): void;
}
