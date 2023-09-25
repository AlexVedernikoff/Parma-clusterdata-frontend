import React from 'react';
import { Space, Typography } from 'antd';
import { NotificationActionProps } from '@entities/notification/types/notification-action-props';

export function NotificationActionBody(
  props: NotificationActionProps,
): React.JSX.Element {
  const { description, onClick, label } = props;

  return (
    <Space direction="vertical">
      {description}
      <Typography.Link onClick={onClick}>{label}</Typography.Link>
    </Space>
  );
}
