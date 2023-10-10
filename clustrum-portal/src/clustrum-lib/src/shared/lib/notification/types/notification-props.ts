import { CSSProperties, ReactNode } from 'react';
import { NotificationAction } from './notification-action';
import { NotificationType } from './notification-types';
import { NotificationPlacement } from 'antd/es/notification/interface';

export interface NotificationProps {
  title: string;
  key: string;
  description?: ReactNode;
  actions?: NotificationAction[];
  type?: NotificationType;
  placement?: NotificationPlacement;
  style?: CSSProperties;
  duration?: number;
  onClose?: () => void;
}
