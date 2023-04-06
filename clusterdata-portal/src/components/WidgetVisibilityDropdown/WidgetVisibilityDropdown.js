import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import iconOpenEye from '@kamatech-data-ui/clusterdata/src/icons/open-eye.svg';
import iconCloseEye from '@kamatech-data-ui/clusterdata/src/icons/close-eye.svg';
import { Button, Menu, Dropdown, Popup } from 'lego-on-react';
import { i18n } from '@kamatech-data-ui/clusterdata';
import { Icon } from '@kamatech-data-ui/common/src';
import ButtonIcon from '../ButtonIcon/ButtonIcon';

const b = block('widget-visibility-dropdown');

function WidgetVisibilityDropdown({ items, layout, toggleWidgetVisibility }) {
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

  useEffect(() => {
    setWidgetList(getWidgetList());
  }, [items, layout]);

  return (
    <Dropdown
      theme="default"
      view="default"
      tone="default"
      size="n"
      cls={b()}
      switcher={
        <Button
          cls={b('btn')}
          theme="flat"
          view="default"
          tone="default"
          size="n"
          title={i18n('dash.header.view', 'widgets_visibility_dropdown')}
        >
          <ButtonIcon>
            <Icon data={iconOpenEye} width="18" height="18" />
          </ButtonIcon>
        </Button>
      }
      popup={
        <Popup hiding autoclosable onOutsideClick={() => {}}>
          <Menu theme="normal" tone="default" view="default" size="n" type="navigation">
            {widgetList.map(({ id, title, isHidden }) => {
              const iconData = isHidden ? iconCloseEye : iconOpenEye;
              return (
                <Menu.Item key={id} onClick={() => toggleWidgetVisibility(id)} cls={b('item', { hidden: isHidden })}>
                  <div className={b('item-icon')}>
                    <Icon data={iconData} width="18" height={isHidden ? 10 : 18} />
                  </div>
                  <div className={b('item-title')}>{title}</div>
                </Menu.Item>
              );
            })}
          </Menu>
        </Popup>
      }
    />
  );
}

WidgetVisibilityDropdown.propTypes = {
  items: PropTypes.array.isRequired,
  layout: PropTypes.array.isRequired,
  toggleWidgetVisibility: PropTypes.func.isRequired,
};

export default WidgetVisibilityDropdown;
