import { ReactElement } from 'react';
import { NotificationProps } from '@lib-shared/lib/notification/types/notification-props';

export type UseCustomNotificationReturnType = [
  (args: NotificationProps) => void,
  ReactElement,
];
