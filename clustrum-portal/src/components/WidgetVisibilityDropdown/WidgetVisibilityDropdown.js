import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import styles from './withHover.module.css';

function WidgetVisibilityDropdown({
  items,
  layout,
  toggleWidgetVisibility,
  hovering,
  text,
}) {
  const getWidgetList = () => {
    const isWidget = item => item.type === 'widget';
    const isTitle = item => item.type === 'title';
    return items.reduce((acc, item) => {
      const layoutItem = layout.find(l => l.i === item.id);

      if (layoutItem === undefined) {
        return acc;
      }

      if (isWidget(item)) {
        return [
          ...acc,
          ...item.data.map(i => ({
            id: item.id,
            title: i.title,
            isHidden: layoutItem.isHidden,
          })),
        ];
      }

      if (isTitle(item)) {
        return [
          ...acc,
          {
            id: item.id,
            title: item.data.text,
            isHidden: layoutItem.isHidden,
          },
        ];
      }

      return [
        ...acc,
        {
          id: item.id,
          title: item.data.title,
          isHidden: layoutItem.isHidden,
        },
      ];
    }, []);
  };

  const [widgetList, setWidgetList] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setWidgetList(getWidgetList());
  }, [items, layout]);

  const visibilityItems = widgetList.map(({ id, title, isHidden }) => {
    return {
      label: (
        <a onClick={() => toggleWidgetVisibility(id)}>
          {isHidden ? (
            <EyeInvisibleOutlined className="ant-d-header-eye-icon" />
          ) : (
            <EyeOutlined className="ant-d-header-eye-icon" />
          )}
          {title}
        </a>
      ),
      key: id,
    };
  });

  const { WidgetVisibilityDropdown__hint } = styles;

  return (
    <>
      <Dropdown
        menu={{ items: visibilityItems }}
        onOpenChange={flag => setOpen(flag)}
        trigger={['click']}
        open={open}
      >
        <Button icon={<EyeOutlined />} />
      </Dropdown>
      {hovering && <div className={WidgetVisibilityDropdown__hint}>{text}</div>}
    </>
  );
}

WidgetVisibilityDropdown.propTypes = {
  items: PropTypes.array.isRequired,
  layout: PropTypes.array.isRequired,
  toggleWidgetVisibility: PropTypes.func.isRequired,
};

export default WidgetVisibilityDropdown;
