import React from 'react';
import {
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TableOutlined,
} from '@ant-design/icons';

const ICON_STYLE = {
  fontSize: '12px',
  color: '#000',
};

export const VISUALIZATION_LIST = {
  line: {
    name: 'Линейная диаграмма',
    icon: <LineChartOutlined style={ICON_STYLE} />,
  },
  area: {
    name: 'Диаграмма с областями',
    icon: <AreaChartOutlined style={ICON_STYLE} />,
  },
  column: {
    name: 'Столбчатая диаграмма',
    icon: <BarChartOutlined style={ICON_STYLE} />,
  },
  pie: {
    name: 'Круговая диаграмма',
    icon: <PieChartOutlined style={ICON_STYLE} />,
  },
  flatTable: {
    name: 'Таблица',
    icon: <TableOutlined style={ICON_STYLE} />,
  },
} as const;
