import { NotificationProps } from '@entities/notification';
import React from 'react';

export type UseCustomNotificationReturnType = [
  (args: NotificationProps) => void,
  React.ReactElement<any, string | React.JSXElementConstructor<any>>,
];
