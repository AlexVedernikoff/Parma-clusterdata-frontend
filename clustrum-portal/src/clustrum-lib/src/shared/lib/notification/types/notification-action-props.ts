import { ReactNode } from 'react';

export interface NotificationActionProps {
  description: ReactNode;
  onClick: () => void;
  label: string;
}
