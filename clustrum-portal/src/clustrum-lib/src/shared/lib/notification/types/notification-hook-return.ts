import { ReactElement } from 'react';
import { NotificationProps } from './notification-props';

export type UseCustomNotificationReturnType = [
  (args: NotificationProps) => void,
  ReactElement,
];
