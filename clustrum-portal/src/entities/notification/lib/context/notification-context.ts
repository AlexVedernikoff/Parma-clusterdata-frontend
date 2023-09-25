import React from 'react';
import { NotificationProps } from '@shared/types/notification';
const NotificationContext = React.createContext<
  ((args: NotificationProps) => void) | null
>(null);
export { NotificationContext };
