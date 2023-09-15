export interface SelectProps {
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (newValue: string) => void;
}
