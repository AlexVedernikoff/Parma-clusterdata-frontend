import { DndItemData } from '@lib-shared/ui/drag-n-drop/types';

interface RawSchema {
  title: string;
  name: string;
  user_type: string;
  nullable?: boolean;
}

interface Source {
  is_ref: boolean;
  id: string;
  parameters: {
    db_version: null | string;
    db_name: string;
    table_name: string;
  };
  raw_schema: RawSchema[];
  source_type: string;
  connection_id: string;
}

export interface DatasetData {
  // TODO определить тип
  tasks: {
    materialization: [];
    preview: [];
  };
  is_favorite: false;
  result_schema: DndItemData[];
  ace_url: string;
  preview_enabled: boolean;
  ds_mode: string;
  sources: Source[];
  pub_operation_id: null | string;
  name: string;
  rls: {
    [key: string]: string;
  };
  key: string;
  connection: {
    access_mode: null;
    created_at: string;
    db_name: string;
    db_type: string;
    host: string;
    id: string;
    meta: {
      state: string;
      title: string;
      version: number;
      conn_class: null | string;
      version_minor: number;
    };
    name: string;
    port: number;
    sample_table_name: null | string;
    schema_name: string;
    table_name: null | string;
    updated_at: string;
    username: string;
    endpoint: string;
    secure: boolean;
    modifyFlag: number;
    maxPoolSize: number;
    key: string;
  };
  origin: {
    table_connection_id: string;
    table_db_name: string;
    table_name: string;
    cluster: null | string;
    path: null | string;
  };
  id: string;
  materializationProperties: {
    materializationConnectionId: string;
    materializationSchemaName: string;
    materializationTableName: string;
    materializationThreadCount: number;
    materializationPageSize: number;
    materializationConnectionMode: null | string;
  };
  realName: string;
  raw_schema: RawSchema[];
}
