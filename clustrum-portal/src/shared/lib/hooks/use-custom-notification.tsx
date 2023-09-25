import { notification, Space, Typography } from 'antd';
import React from 'react';
import {
  NotificationAction,
  NotificationProps,
  NotificationType,
  UseCustomNotificationReturnType,
} from '@shared/types/notification';

export function useCustomNotification(): UseCustomNotificationReturnType {
  const [api, contextHolder] = notification.useNotification();

  function getDescriptionWithAction(
    description: React.ReactNode,
    actions: NotificationAction[],
    key?: string,
  ): React.ReactNode {
    if (!actions?.length) {
      return description;
    }

    return (
      <Space direction="vertical">
        {actions.map(({ label, onClick }) => {
          const onActionClick = (): void => {
            onClick();
            if (!key) {
              return;
            }
            api.destroy(key);
          };
          return (
            <Space key={label} direction="vertical">
              {description}
              <Typography.Link onClick={onActionClick}>{label}</Typography.Link>
            </Space>
          );
        })}
      </Space>
    );
  }

  function openNotification(props: NotificationProps): void {
    const {
      message, // заголовок
      description, // тело
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
      message,
      description: fullDescription,
      placement,
      style: {
        width: 400,
        minHeight: 84,
        zIndex: 21202,
        ...style,
      },
      duration,
      onClose,
      key,
    });
  }

  return [openNotification, contextHolder];
}
