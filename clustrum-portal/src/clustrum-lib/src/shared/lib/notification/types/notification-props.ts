import { CSSProperties, ReactNode } from 'react';
import {
  NotificationAction,
  NotificationType,
} from '@lib-shared/lib/notification/types/index';
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
