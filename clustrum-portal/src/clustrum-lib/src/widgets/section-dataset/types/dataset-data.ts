import { DndItemData } from '@lib-entities/visualization-factory/types';

export interface RawSchema {
  title: string;
  name: string;
  user_type: string;
  nullable?: boolean;
}

export interface Source {
  is_ref: boolean;
  id: string;
  parameters: {
    db_version: string | null;
    db_name: string;
    table_name: string;
  };
  raw_schema: RawSchema[];
  source_type: string;
  connection_id: string;
}

export interface DatasetTasks {
  materialization: unknown[];
  preview: unknown[];
}

export interface DatasetMeta {
  state: string;
  title: string;
  version: number;
  conn_class: string | null;
  version_minor: number;
}

export interface DatasetOrigin {
  table_connection_id: string;
  table_db_name: string;
  table_name: string;
  cluster: string | null;
  path: string | null;
}

export interface DatasetMaterializationProperties {
  materializationConnectionId: string;
  materializationSchemaName: string;
  materializationTableName: string;
  materializationThreadCount: number;
  materializationPageSize: number;
  materializationConnectionMode: string | null;
}

export interface DatasetConnection {
  access_mode: null;
  created_at: string;
  db_name: string;
  db_type: string;
  host: string;
  id: string;
  meta: DatasetMeta;
  name: string;
  port: number;
  sample_table_name: string | null;
  schema_name: string;
  table_name: string | null;
  updated_at: string;
  username: string;
  endpoint: string;
  secure: boolean;
  modifyFlag: number;
  maxPoolSize: number;
  key: string;
}

export interface DatasetData {
  tasks: DatasetTasks;
  is_favorite: false;
  result_schema: DndItemData[];
  ace_url: string;
  preview_enabled: boolean;
  ds_mode: string;
  sources: Source[];
  pub_operation_id: string | null;
  name: string;
  rls: {
    [key: string]: string;
  };
  key: string;
  connection: DatasetConnection;
  origin: DatasetOrigin;
  id: string;
  materializationProperties: DatasetMaterializationProperties;
  realName: string;
  raw_schema: RawSchema[];
}
