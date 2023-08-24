import { Dataset } from './dataset';
import { FieldAggregation, ItemTypes } from './enums';

export interface FieldProperties {
  avatar_id: string | null;
  formula: string;
  description: string;
  aggregation: FieldAggregation;
  linkedDataset: Dataset | null;
  linkedField: FieldProperties | null;
  className: string;
  data_type?: string;
  datasetId: string;
  datasetName: string;
  chunk_divider: boolean;
  aggregation_locked: boolean;
  arrayJoinType: string | null;
  autoaggregated: boolean;
  calc_mode: string;
  cast: string;
  guid: string;
  hasArray: boolean;
  hasIndex: boolean;
  hasVersion: boolean;
  has_auto_aggregation: boolean;
  hidden: boolean;
  id: string;
  joinType: string;
  lock_aggregation: boolean;
  source: string;
  spel: string;
  title: string;
  type: ItemTypes;
  valid: boolean;
  verification_rules: string;
}
