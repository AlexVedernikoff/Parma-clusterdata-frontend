import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Loader, Icon } from '@kamatech-data-ui/common/src';

import DatasetCreation from '../../components/DatasetCreation/DatasetCreation';
import SelectConnection from '../../containers/SelectConnection/SelectConnection';
import { REPLACE_SOURCE_MODE_ID } from '../../constants';

// import './ConnectionSelection.scss';
import iconFolder from '@kamatech-data-ui/clustrum/src/icons/folder-selection.svg';

const b = block('connection-selection');

function DatasetCreationSettings(props) {
  const { installationType } = window.DL;
  const {
    sdk,
    modeId,
    selectedConnection: { connectionId, connectionType, connectionName, cluster },
    pathSelectInputError,
    onChangeConnectionCallback,
    isLoadingConnection,
    onEntryClick,
  } = props;

  if (isLoadingConnection) {
    return (
      <div className={b('dataset-creation-settings-loader')}>
        <Loader size={'l'} />
      </div>
    );
  }

  if (!connectionId || !connectionType) {
    return null;
  }

  return (
    <DatasetCreation
      sdk={sdk}
      modeId={modeId}
      connectionId={connectionId}
      connectionType={connectionType}
      connectionName={connectionName}
      cluster={cluster}
      installationType={installationType}
      onChangeCallback={onChangeConnectionCallback}
      pathSelectInputError={pathSelectInputError}
      onEntryClick={onEntryClick}
    />
  );
}

class ConnectionSelection extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
    onChangeConnectionCallback: PropTypes.func.isRequired,
    onEntryClick: PropTypes.func.isRequired,
    modeId: PropTypes.oneOf([REPLACE_SOURCE_MODE_ID]),
    isLoadingConnection: PropTypes.bool,
    pathSelectInputError: PropTypes.bool,
    selectedConnection: PropTypes.shape({
      connectionId: PropTypes.string,
      connectionType: PropTypes.string,
      connectionName: PropTypes.string,
      cluster: PropTypes.string,
    }),
    connections: PropTypes.array,
  };

  render() {
    const {
      sdk,
      modeId,
      selectedConnection,
      selectedConnection: { connectionId } = {},
      pathSelectInputError,
      onEntryClick,
      onChangeConnectionCallback,
      isLoadingConnection,
    } = this.props;

    return (
      <div className={b()}>
        {connectionId ? (
          <DatasetCreationSettings
            sdk={sdk}
            modeId={modeId}
            isLoadingConnection={isLoadingConnection}
            selectedConnection={selectedConnection}
            pathSelectInputError={pathSelectInputError}
            onChangeConnectionCallback={onChangeConnectionCallback}
            onEntryClick={onEntryClick}
          />
        ) : (
          <div className={b('select-connection')}>
            {isLoadingConnection ? (
              <div className={b('dataset-creation-settings-loader')}>
                <Loader size={'l'} />
              </div>
            ) : (
              <React.Fragment>
                <Icon className={b('icon-folder')} data={iconFolder} />
                <SelectConnection
                  sdk={sdk}
                  onEntryClick={onEntryClick}
                  connectionId={connectionId}
                />
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    );
  }
}

DatasetCreationSettings.propTypes = {
  sdk: ConnectionSelection.propTypes.sdk,
  isLoadingConnection: ConnectionSelection.propTypes.isLoadingConnection,
  selectedConnection: ConnectionSelection.propTypes.selectedConnection,
  pathSelectInputError: ConnectionSelection.propTypes.pathSelectInputError,
  onChangeConnectionCallback: ConnectionSelection.propTypes.onChangeConnectionCallback,
  onEntryClick: ConnectionSelection.propTypes.onEntryClick,
};

export default ConnectionSelection;
