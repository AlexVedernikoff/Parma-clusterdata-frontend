import React from 'react';
import { NotificationProps } from '@shared/types/notification/notification-props';

export type UseCustomNotificationReturnType = [
  (args: NotificationProps) => void,
  React.ReactElement<any, string | React.JSXElementConstructor<any>>,
];
