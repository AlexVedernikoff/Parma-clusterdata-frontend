export interface Dataset {
  ace_url: string;
  ds_mode: DatasetMode;
  id: string;
  is_favorite: boolean;
  key: string;
}

export enum DatasetMode {
  Direct = 'direct',
  Materialized = 'materialized',
  MaterializedByPeriod = 'materialized_by_period',
}
