import { NotificationProps } from '@entities/notification';
import React from 'react';

export type useCustomNotificationReturnType = [
  (args: NotificationProps) => void,
  React.ReactElement<any, string | React.JSXElementConstructor<any>>,
];
