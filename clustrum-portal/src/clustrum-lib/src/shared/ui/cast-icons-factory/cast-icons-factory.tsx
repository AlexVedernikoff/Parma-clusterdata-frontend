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
  const iconClassName = classNames(styles.icon, className);

  switch (iconType) {
    case CastIconType.Integer:
    case CastIconType.UiIndeger:
    case CastIconType.Float:
    case CastIconType.Double:
    case CastIconType.Long:
      return <NumberOutlined className={iconClassName} />;
    case CastIconType.Datetime:
    case CastIconType.Date:
      return <CalendarOutlined className={iconClassName} />;
    case CastIconType.Geo:
    case CastIconType.Geopolygon:
    case CastIconType.Geopoint:
      return <Icon className={iconClassName} component={GeoIcon} />;
    case CastIconType.Boolean:
      return <Icon className={iconClassName} component={BooleanIcon} />;
    case CastIconType.String:
    default:
      return <FontSizeOutlined className={iconClassName} />;
  }
}
