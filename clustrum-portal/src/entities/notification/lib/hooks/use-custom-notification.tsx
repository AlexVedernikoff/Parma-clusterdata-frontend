import { notification, Space } from 'antd';
import React from 'react';
import { NotificationActionBody } from '@entities/notification/ui/notification-action-body';
import { NotificationAction as action } from '@entities/notification/types/notification-action';
import { NotificationProps } from '@entities/notification/types/notification-props';
import { NotificationType } from '@entities/notification';
import { UseCustomNotificationReturnType } from '@entities/notification/types/notification-hook-return';

export function useCustomNotification(): UseCustomNotificationReturnType {
  const [api, contextHolder] = notification.useNotification();

  function getDescriptionWithAction(
    description: React.ReactNode,
    actions: action[],
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
            <NotificationActionBody
              key={label}
              description={description}
              onClick={onActionClick}
              label={label}
            />
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
