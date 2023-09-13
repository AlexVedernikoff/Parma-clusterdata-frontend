export interface InputFilterControlProps {
  label: string;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange: ((str: string) => void) | null;
  needShowTitle?: boolean;
}
