import { ItemTypes } from './enums';

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
