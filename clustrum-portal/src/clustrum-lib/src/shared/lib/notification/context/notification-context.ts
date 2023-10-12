import React from 'react';
import { NotificationProps } from '../types';
const NotificationContext = React.createContext<
  ((args: NotificationProps) => void) | null
>(null);
export { NotificationContext };
