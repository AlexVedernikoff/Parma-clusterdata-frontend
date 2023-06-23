import { Icon } from '@kamatech-data-ui/common/src';
import React from 'react';
import block from 'bem-cn-lite';
import { Button, Dropdown, Menu, Popup } from 'lego-on-react';

import Utils from '../../../../helpers/utils';
import ConnectionName from '../ConnectionName/ConnectionName';
import ConnectionSubInfo from '../ConnectionSubInfo/ConnectionSubInfo';

import iconMore from '@kamatech-data-ui/clustrum/src/icons/more.svg';
// import './ConnectionInfo.scss';

const b = block('connection-info');

function ConnectionInfo(props) {
  const {
    isProcessing,
    connection: { db_type: connectionType } = {},
    origin,
    connection,
    tableDbName,
    onClickConnectionMoreMenuItem,
  } = props;

  return (
    <div className={b('connection')}>
      <Icon
        className={b('connector-icon')}
        data={Utils.getConnectorIcon({ type: connectionType })}
        width={36}
      />
      <div className={b('connection-info')}>
        <div className={b('connection-info-main')}>
          <ConnectionName {...connection} />
          <Dropdown
            cls={b('more-dropdown')}
            view="default"
            tone="default"
            theme="flat"
            size="n"
            switcher={
              <Button size="n" theme="flat" type="default" view="default" width="max">
                <Icon className={b('more')} data={iconMore} width="22" />
              </Button>
            }
            popup={
              <Popup
                cls={b('entry-panel-more-popup')}
                hiding
                autoclosable
                onOutsideClick={() => ({})}
              >
                <Menu
                  theme="normal"
                  view="default"
                  tone="default"
                  size="s"
                  onClick={onClickConnectionMoreMenuItem}
                >
                  <Menu.Item
                    disabled={isProcessing}
                    type="option"
                    val="update-dataset-schema"
                  >
                    Обновить схему
                  </Menu.Item>
                  <Menu.Item disabled={isProcessing} type="option" val="replace-source">
                    Заменить источник
                  </Menu.Item>
                  <Menu.Group>
                    <Menu.Item type="option" val="open-connection">
                      Перейти к подключению
                    </Menu.Item>
                  </Menu.Group>
                </Menu>
              </Popup>
            }
          />
        </div>
        <div className={b('connection-info-sub', b('text-inactive'))}>
          <ConnectionSubInfo
            origin={origin}
            connection={connection}
            tableDbName={tableDbName}
          />
        </div>
      </div>
    </div>
  );
}

export default ConnectionInfo;
