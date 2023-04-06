import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Icon } from '@kamatech-data-ui/common/src';
import ArrowBack from '../ArrowBack/ArrowBack';
import Utils from '../../../../helpers/utils';
import { getConnectorsMap } from '../../../../constants';

// import './Title.scss';

const b = block('dl-connector-title');

class Title extends React.Component {
  static propTypes = {
    dbType: PropTypes.string.isRequired,
    isNewConnection: PropTypes.bool,
  };

  _getDbType() {
    const { dbType } = this.props;

    return dbType === 'metrika_api' || dbType === 'metrika_logs_api' ? 'metrica' : dbType;
  }

  render() {
    const { dbType, isNewConnection } = this.props;

    return (
      <div className={b()}>
        {isNewConnection && <ArrowBack />}
        <Icon className={b('icon')} data={Utils.getConnectorIcon({ type: dbType })} width={32} />
        <span>{getConnectorsMap()[this._getDbType()]}</span>
      </div>
    );
  }
}

export default Title;
