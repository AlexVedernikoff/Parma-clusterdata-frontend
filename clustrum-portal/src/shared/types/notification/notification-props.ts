import { CSSProperties, ReactNode } from 'react';
import { NotificationAction, NotificationType } from '@shared/types/notification';
import { NotificationPlacement } from 'antd/es/notification/interface';

export interface NotificationProps {
  title: string;
  description?: ReactNode;
  actions?: NotificationAction[];
  type?: NotificationType;
  placement?: NotificationPlacement;
  style?: CSSProperties;
  duration?: number;
  onClose?: () => void;
  key?: string;
}
