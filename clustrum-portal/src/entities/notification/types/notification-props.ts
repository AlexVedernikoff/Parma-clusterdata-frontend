import React from 'react';
import { NotificationAction as action, NotificationType } from '@entities/notification';
import { NotificationPlacement } from 'antd/es/notification/interface';

export interface NotificationProps {
  message: string;
  description?: React.ReactNode;
  actions?: action[];
  type?: NotificationType;
  placement?: NotificationPlacement;
  style?: React.CSSProperties;
  duration?: number;
  onClose?: () => void;
  key?: string;
}
