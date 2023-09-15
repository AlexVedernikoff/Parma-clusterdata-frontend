import { FocusEvent } from 'react';

export interface InputNumberProps {
  value: number | null;
  controls: boolean;
  onChange: (newValue: number | null) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
}
