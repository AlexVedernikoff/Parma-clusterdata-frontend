import { Content } from './content';

export interface SelectFilterControlProps {
  label: string;
  content: Content[];
  value?: string | string[];
  multiselect?: boolean;
  searchable?: boolean;
  className?: string;
  onChange: (value: string | string[]) => void;
}
