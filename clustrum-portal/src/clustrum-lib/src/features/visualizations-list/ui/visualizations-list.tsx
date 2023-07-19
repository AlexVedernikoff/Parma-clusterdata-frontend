import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dropdown, MenuProps } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
// TODO Будет исправлено после рефакторинга SectionVisualization №715522
import { VISUALIZATIONS } from '../../../../../constants';
import { useUpdateViewSelector } from '../model/use-update-selector';
import { setVisualization, updatePreview } from '../../../../../actions';
import { VISUALIZATION_LIST } from '../lib/constants/visualization-list';
import { ChartId, VisualizationsListProps } from '../types';
import styles from './visualizations-list.module.css';

export function VisualizationsList(props: VisualizationsListProps): JSX.Element | null {
  const { selectedId } = props;
  const dispatch = useDispatch();
  const params = useUpdateViewSelector();
  const [isOpen, setIsOpen] = useState(false);

  if (!selectedId) {
    return null;
  }

  const items = (Object.keys(VISUALIZATION_LIST) as Array<ChartId>).map(key => ({
    key,
    label: (
      <span className={styles['item']}>
        <span className={styles['item__icon']}>{VISUALIZATION_LIST[key].icon}</span>
        <span className={styles['item__name']}>{VISUALIZATION_LIST[key].name}</span>
      </span>
    ),
  }));

  const handleMenuClick: MenuProps['onClick'] = e => {
    const { key } = e;
    const currentItem = VISUALIZATIONS.find(({ id }) => id === key);
    dispatch(setVisualization({ visualization: currentItem }));
    dispatch(updatePreview({ ...params, visualization: currentItem }));
  };

  const menuProps = {
    items,
    selectable: true,
    defaultSelectedKeys: [selectedId],
    onClick: handleMenuClick,
  };

  return (
    <Dropdown
      menu={menuProps}
      trigger={['click']}
      onOpenChange={(open: boolean): void => {
        setIsOpen(open);
      }}
    >
      <Button type="text" block className={styles['btn']}>
        {VISUALIZATION_LIST[selectedId].icon}
        {VISUALIZATION_LIST[selectedId].name}
        {isOpen ? (
          <UpOutlined className={styles['icon']} />
        ) : (
          <DownOutlined className={styles['icon']} />
        )}
      </Button>
    </Dropdown>
  );
}
