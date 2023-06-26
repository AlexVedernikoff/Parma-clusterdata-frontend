import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import block from 'bem-cn-lite';
import { Button, TextInput } from 'lego-on-react';
import { Icon } from '@kamatech-data-ui/common/src';
import { ActionPanel } from '@kamatech-data-ui/clustrum';
import Utils from './../../helpers/utils';
import { getConnectorsMap, getFakeEntry } from '../../constants';

const b = block('connectors');

export function Connectors({ sdk, location: { search } }) {
  const [searchConnectorName, setSearchConnectorName] = useState();

  const connectionsList = useMemo(() => {
    const unfilteredConnectionsList = Object.entries(getConnectorsMap());

    if (!searchConnectorName) {
      return unfilteredConnectionsList;
    }
    const formattedSearchConnectorName = searchConnectorName
      .toLowerCase()
      .replace(/\s+/g, '');
    return unfilteredConnectionsList.filter(([, title]) =>
      title.toLowerCase().includes(formattedSearchConnectorName),
    );
  }, [searchConnectorName]);

  return (
    <div className={b()}>
      <ActionPanel
        sdk={sdk}
        entry={getFakeEntry('connection')}
        rightItems={[<div key={'fake'} />]}
      />
      <div className={b('panel')}>
        <TextInput
          tabIndex={1}
          cls={b('search-connector-inp')}
          theme="normal"
          size="s"
          view="default"
          tone="default"
          text={searchConnectorName}
          placeholder="Имя коннектора"
          onChange={e => setSearchConnectorName(e.target.value)}
          hasClear
          focused
        />
      </div>

      <div className={b('list')}>
        {connectionsList.map(([connector, title]) => {
          return (
            <Link
              key={connector}
              className={b('link')}
              to={`/connections/new/${connector}${search}`}
            >
              <Button
                cls={b('connector-btn')}
                theme="pseudo"
                size="n"
                view="default"
                tone="default"
              >
                <Icon
                  key={connector}
                  className={b('connector-icon')}
                  data={Utils.getConnectorIcon({ type: connector })}
                  width="56"
                  height="56"
                />
                <div className={b('connector-title')}>{title}</div>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
