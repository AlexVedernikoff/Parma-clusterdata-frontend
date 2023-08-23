import { DatasetMode } from './enums';

export interface Dataset {
  ace_url: string;
  ds_mode: DatasetMode;
  id: string;
  is_favorite: boolean;
  key: string;
}
