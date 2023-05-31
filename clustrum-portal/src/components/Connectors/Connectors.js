import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import block from 'bem-cn-lite';
import { Button, TextInput } from 'lego-on-react';
import { Icon } from '@kamatech-data-ui/common/src';
import { ActionPanel } from '@kamatech-data-ui/clustrum';
import Utils from './../../helpers/utils';
import { getConnectorsMap, getConnectorsMap, getFakeEntry } from '../../constants';

// import './Connectors.scss';

const b = block('connectors');

class Connectors extends React.Component {
  state = {
    searchConnectorName: '',
  };

  changeSearchConnectorName = searchConnectorName => {
    this.setState({
      searchConnectorName,
    });
  };

  render() {
    const {
      sdk,
      location: { search },
    } = this.props;

    const { searchConnectorName } = this.state;
    const connectionsList = useMemo(
      () =>
        Object.entries(getConnectorsMap()).filter(([, title]) => {
          return searchConnectorName
            ? title.toLowerCase().includes(searchConnectorName.toLowerCase().replace(/\s+/g, ''))
            : true;
        }),
      [searchConnectorName],
    );

    return (
      <div className={b()}>
        <ActionPanel
          sdk={sdk}
          entry={getFakeEntry('connection')}
          // если не опустить пустой div, то в правой части панели будет 0
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
            onChange={this.changeSearchConnectorName}
            hasClear
            focused
          />
        </div>

        <div className={b('list')}>
          {connectionsList.map(([connector, title]) => {
            return (
              <Link key={connector} className={b('link')} to={`/connections/new/${connector}${search}`}>
                <Button cls={b('connector-btn')} theme="pseudo" size="n" view="default" tone="default">
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
}

export default Connectors;
