import React from 'react';

export interface NotificationActionProps {
  description: React.ReactNode;
  onClick: () => void;
  label: string;
}
