import { ItemTypes } from '@lib-entities/visualization-factory/types';

export interface Placeholder {
  allowedTypes: ItemTypes;
  id: string;
  type: string;
  title: string;
  icon: JSX.Element;
  items?: unknown;
  required: boolean;
  capacity: number;
}
