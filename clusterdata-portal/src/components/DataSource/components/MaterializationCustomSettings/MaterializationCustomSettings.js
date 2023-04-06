import React from 'react';
import Utils from '../../../../helpers/utils';
import { getConnectorsMap } from '../../../../constants';
import SelectConnection from '../../../../containers/SelectConnection/SelectConnection';
import { ParmaTextInput } from '../../../../../kamatech_modules/kamatech-ui';
import iconXsign from '../../../../../kamatech_modules/@kamatech-data-ui/clusterdata/src/icons/x-sign.svg';
import block from 'bem-cn-lite';
import { i18n } from '../../../../../kamatech_modules/@kamatech-data-ui/clusterdata-i18n';
import { YCSelect } from '../../../../../kamatech_modules/@kamatech-data-ui/common/src';
import { Icon } from '@kamatech-data-ui/common/src';

const b = block('dataset-creation');

function MaterializationCustomSettings(props) {
  const { changeMaterializationCustomSettings, materializationCustomSettings, onEntryClick, sdk } = props;

  const handleChange = (name, value) => {
    if ((name === 'materializationThreadCount' || name === 'materializationPageSize') && /\D/.test(value)) {
      return;
    }
    materializationCustomSettings[name] = value;

    changeMaterializationCustomSettings(materializationCustomSettings);
  };

  const entryClick = (entry, closeNavModal) => {
    onEntryClick(entry, closeNavModal, materializationCustomSettings);
  };

  const isDisabledDatabaseSelection = !materializationCustomSettings.databases.length;

  return (
    <div className={b('params')}>
      <div className={b('dataset-panel')}>
        <Icon
          className={b('connector-ic')}
          data={Utils.getConnectorIcon({ type: materializationCustomSettings.connectionType })}
          width="32"
        />
        <span className={b('label-connection-type')}>
          {getConnectorsMap()[materializationCustomSettings.connectionType]}
        </span>
        <span className={b('label-connection-name')}>{materializationCustomSettings.connectionName}</span>
        <SelectConnection
          sdk={sdk}
          connectionId={materializationCustomSettings.connectionId}
          onEntryClick={entryClick}
        />
      </div>
      <div className="row">
        <div className={b('caption')}>
          <span>{i18n('dataset.dataset-creation.create', 'field_db-name')}</span>
        </div>
        <div className={b('field')}>
          <YCSelect
            cls={b('field-databases')}
            items={materializationCustomSettings.databases.map(dbName => {
              return {
                key: dbName,
                value: dbName,
                title: dbName,
              };
            })}
            value={materializationCustomSettings.materializationSchemaName}
            onChange={selected => handleChange('materializationSchemaName', selected)}
            showSearch={false}
            disabled={isDisabledDatabaseSelection}
          />
        </div>
      </div>

      <MaterializationCustomSettingsParamsItem
        label={i18n('dataset.materialization.modify', 'materialization_table')}
        value={materializationCustomSettings.materializationTableName}
        name={'materializationTableName'}
        onChangeValue={handleChange}
      />

      <MaterializationCustomSettingsParamsItem
        label={i18n('dataset.materialization.modify', 'materialization_page_size')}
        value={materializationCustomSettings.materializationPageSize}
        name={'materializationPageSize'}
        onChangeValue={handleChange}
      />
      <MaterializationCustomSettingsParamsItem
        label={i18n('dataset.materialization.modify', 'materialization_thread_count')}
        value={materializationCustomSettings.materializationThreadCount}
        name={'materializationThreadCount'}
        onChangeValue={handleChange}
      />
    </div>
  );
}

function MaterializationCustomSettingsParamsItem(props) {
  const { label, value, name, onChangeValue } = props;

  return (
    <div className={b('params-item')}>
      <div className={b('params_label')}>{label}</div>
      <div className={'parma-textinput__control'}>
        <ParmaTextInput
          view="default"
          tone="default"
          theme="normal"
          size="s"
          hasClear={true}
          text={value}
          onChange={textNext => onChangeValue(name, textNext)}
          iconClearData={iconXsign}
        />
      </div>
    </div>
  );
}

export default MaterializationCustomSettings;
