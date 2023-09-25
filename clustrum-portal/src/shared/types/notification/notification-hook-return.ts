import { ReactElement } from 'react';
import { NotificationProps } from '@shared/types/notification/notification-props';

export type UseCustomNotificationReturnType = [
  (args: NotificationProps) => void,
  ReactElement,
];
