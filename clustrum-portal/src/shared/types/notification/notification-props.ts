import React from 'react';
import { NotificationAction, NotificationType } from '@shared/types/notification';
import { NotificationPlacement } from 'antd/es/notification/interface';

export interface NotificationProps {
  message: string;
  description?: React.ReactNode;
  actions?: NotificationAction[];
  type?: NotificationType;
  placement?: NotificationPlacement;
  style?: React.CSSProperties;
  duration?: number;
  onClose?: () => void;
  key?: string;
}
