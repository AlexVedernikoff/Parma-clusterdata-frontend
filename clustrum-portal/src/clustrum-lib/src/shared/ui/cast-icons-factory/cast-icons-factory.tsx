import React from 'react';
import classNames from 'classnames';
import Icon, {
  FontSizeOutlined,
  CalendarOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import { GeoIcon, BooleanIcon } from './icons';
import { CastIconType, CastIconsFactoryProps } from './types';
import styles from './cast-icons-factory.module.css';

export function CastIconsFactory(props: CastIconsFactoryProps): JSX.Element {
  const { className, iconType } = props;

  switch (iconType) {
    case CastIconType.Integer:
    case CastIconType.UiIndeger:
    case CastIconType.Float:
    case CastIconType.Double:
    case CastIconType.Long:
      return <NumberOutlined className={classNames(styles.icon, className)} />;
    case CastIconType.Datetime:
    case CastIconType.Date:
      return <CalendarOutlined className={classNames(styles.icon, className)} />;
    case CastIconType.Geo:
    case CastIconType.Geopolygon:
    case CastIconType.Geopoint:
      return <Icon className={classNames(styles.icon, className)} component={GeoIcon} />;
    case CastIconType.Boolean:
      return (
        <Icon className={classNames(styles.icon, className)} component={BooleanIcon} />
      );
    case CastIconType.String:
    default:
      return <FontSizeOutlined className={classNames(styles.icon, className)} />;
  }
}
