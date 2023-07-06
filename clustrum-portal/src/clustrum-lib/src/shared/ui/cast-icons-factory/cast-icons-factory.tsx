import React from 'react';
import Icon, {
  FontSizeOutlined,
  CalendarOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import { GeoIcon } from './icons/geo-icon';
import { BooleanIcon } from './icons/boolean-icon';
import { CastIconType, CastIconsFactoryProps } from './types';

export function CastIconsFactory(props: CastIconsFactoryProps): JSX.Element {
  const { iconType } = props;

  let icon;
  switch (iconType) {
    case CastIconType.Integer:
    case CastIconType.UiIndeger:
    case CastIconType.Float:
    case CastIconType.Double:
    case CastIconType.Long:
      icon = <NumberOutlined width="16" />;
      break;
    case CastIconType.Datetime:
    case CastIconType.Date:
      icon = <CalendarOutlined width="16" />;
      break;
    case CastIconType.Geo:
    case CastIconType.Geopolygon:
      icon = <Icon component={GeoIcon} width="16" />;
      break;
    case CastIconType.Boolean:
      icon = <Icon component={BooleanIcon} width="16" />;
      break;
    case CastIconType.String:
    default:
      icon = <FontSizeOutlined width="16" />;
      break;
  }

  return <div className="item-icon">{icon}</div>;
}
