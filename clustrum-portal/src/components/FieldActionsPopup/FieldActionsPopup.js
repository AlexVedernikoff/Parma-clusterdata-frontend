import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button, Menu, Popup } from 'lego-on-react';
import { Icon } from '@kamatech-data-ui/common/src';

// import './FieldActionsPopup.scss';

import iconMore from '@kamatech-data-ui/clustrum/src/icons/more.svg';

const b = block('field-actions-popup');

function FieldActionsPopup(props) {
  const { field, onClickItem } = props;

  const buttonRef = useRef(null);
  const [visible, setVisible] = useState(false);

  return (
    <React.Fragment>
      <Button
        cls={b('control')}
        ref={buttonRef}
        size="s"
        theme="light"
        type="default"
        view="default"
        icon={<Icon className={b('more')} data={iconMore} width="26" height="28" />}
        onClick={() => setVisible(!visible)}
      />
      {visible && (
        <Popup
          cls={b('popup')}
          hiding
          anchor={buttonRef.current}
          theme="normal"
          directions={['bottom-right', 'top-right']}
          visible={visible}
          onOutsideClick={() => setVisible(false)}
        >
          <Menu theme="normal" view="default" tone="default" size="s" type="navigation">
            <Menu.Item
              type="option"
              val="duplicate"
              onClick={() => {
                setVisible(false);

                onClickItem({
                  action: 'duplicate',
                  field,
                });
              }}
            >
              Продублировать
            </Menu.Item>
            <Menu.Item
              type="option"
              val="edit"
              onClick={() => {
                setVisible(false);

                onClickItem({
                  action: 'edit',
                  field,
                });
              }}
            >
              Редактировать
            </Menu.Item>
            <Menu.Item
              type="option"
              val="remove"
              onClick={() => {
                setVisible(false);

                onClickItem({
                  action: 'remove',
                  field,
                });
              }}
            >
              Удалить
            </Menu.Item>
            <Menu.Item
              type="option"
              val="remove"
              onClick={() => {
                setVisible(false);

                onClickItem({
                  action: 'rls',
                  field,
                });
              }}
            >
              Права доступа
            </Menu.Item>
          </Menu>
        </Popup>
      )}
    </React.Fragment>
  );
}

FieldActionsPopup.propTypes = {
  field: PropTypes.object.isRequired,
  onClickItem: PropTypes.func.isRequired,
};

export default FieldActionsPopup;
