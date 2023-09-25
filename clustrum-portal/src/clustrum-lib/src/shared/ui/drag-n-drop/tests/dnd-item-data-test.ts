export interface DndItemData {
  aggregation?: string;
  aggregation_locked?: string;
  arrayJoinType?: string;
  autoaggregated?: boolean;
  avatar_id?: string;
  calc_mode?: string;
  cast?: string;
  chunk_divider?: boolean;
  className: string;
  data_type?: string;
  datasetId?: string;
  datasetName: string;
  description?: string;
  filter?: Filter;
  formula?: string;
  guid?: string;
  hasArray?: boolean;
  hasIndex?: boolean;
  hasVersion?: boolean;
  has_auto_aggregation?: boolean;
  hidden?: boolean;
  id: string;
  joinType?: string;
  linkedDataset?: string;
  linkedField?: string;
  lock_aggregation?: boolean;
  source?: string;
  spel?: string;
  title: string;
  type: string;
  valid?: boolean;
  verification_rules?: string;
  direction?: string;
}

export interface Filter {
  operation: FilterOperation;
  value: string[];
}

export interface FilterOperation {
  code: string;
  title: string;
  selectable: boolean;
}
