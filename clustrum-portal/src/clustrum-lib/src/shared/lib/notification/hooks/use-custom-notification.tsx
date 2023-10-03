import { notification, Space, Typography } from 'antd';
import React, { ReactNode } from 'react';
import {
  NotificationAction,
  NotificationProps,
  NotificationType,
  UseCustomNotificationReturnType,
} from '../types';
import classes from './use-custom-notification.module.css';

export function useCustomNotification(): UseCustomNotificationReturnType {
  const [api, contextHolder] = notification.useNotification();

  const getDescriptionWithAction = (
    description: ReactNode,
    actions: NotificationAction[],
    key: string,
  ): ReactNode => {
    if (!actions?.length) {
      return description;
    }

    return (
      <Space direction="vertical">
        {description}
        {actions.map(({ label, onClick, isForceCloseAfterClick = true }) => {
          const handleActionClick = (): void => {
            onClick();
            if (isForceCloseAfterClick) {
              api.destroy(key);
            }
          };

          return (
            <Space key={label} direction="vertical">
              <Typography.Link onClick={handleActionClick}>{label}</Typography.Link>
            </Space>
          );
        })}
      </Space>
    );
  };

  const openNotification = (props: NotificationProps): void => {
    const {
      title,
      description,
      actions = [],
      type = NotificationType.Info,
      placement = 'bottomRight',
      style = {},
      duration = 0,
      onClose,
      key,
    } = props;

    const fullDescription = getDescriptionWithAction(description, actions, key);

    api[type]({
      message: title,
      description: fullDescription,
      placement,
      className: classes['custom-notification'],
      style: { ...style },
      duration,
      onClose,
      key,
    });
  };

  return [openNotification, contextHolder];
}
