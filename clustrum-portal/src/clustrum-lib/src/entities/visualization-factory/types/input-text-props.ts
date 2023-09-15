import { ChangeEvent, FocusEvent } from 'react';

export interface InputTextProps {
  value: string;
  type: string;
  onChange: (newValue: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
}
