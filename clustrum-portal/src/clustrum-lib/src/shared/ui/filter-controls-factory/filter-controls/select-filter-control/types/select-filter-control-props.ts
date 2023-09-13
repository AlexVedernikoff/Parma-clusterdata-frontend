import { Content } from './content';

export interface SelectFilterControlProps {
  label: string;
  content: Content[];
  defaultValue?: string | string[];
  multiselect?: boolean;
  searchable?: boolean;
  className?: string;
  onChange: ((value: string | string[]) => void) | null;
  needShowTitle?: boolean;
}

export interface OptionsTypes {
  value: string;
  title: string;
  key: string;
}
