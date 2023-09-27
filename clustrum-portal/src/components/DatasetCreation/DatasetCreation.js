import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Icon, Loader, Toaster, YCSelect, TextInput } from '@kamatech-data-ui/common/src';
import { PathSelect } from '@kamatech-data-ui/clustrum';

import getErrorMessageHelper from './getErrorMessageHelper';
import UserName from '../UserName/UserName';
import {
  getConnectorsMap,
  getStaticSelectItems,
  TOAST_NAME,
  REPLACE_SOURCE_MODE_ID,
} from '../../constants';
import Utils from '../../helpers/utils';
import SelectConnection from '../../containers/SelectConnection/SelectConnection';
import { getSearchParam } from '../../helpers/QueryParams';

const b = block('dataset-creation');

const SECTIONS = {
  SECTION_PATH_SELECTION: 'SECTION_PATH_SELECTION',
  SECTION_SELECTION_DB_TABLES_HINTS: 'SECTION_SELECTION_DB_TABLES_HINTS',
  SECTION_CLICKHOUSE_YQL: 'SECTION_CLICKHOUSE_YQL',
  SECTION_DATABASE_TABLE_SELECTION: 'SECTION_DATABASE_TABLE_SELECTION',
  SECTION_WARNING_YT: 'SECTION_WARNING_YT',
  SECTION_SELECTION_YT_ID: 'SECTION_SELECTION_YT_ID',
  SECTION_COUNTER_SRC_SELECTION: 'SECTION_COUNTER_SRC_SELECTION',
  SECTION_NAMESPACE_SELECTION: 'SECTION_NAMESPACE_SELECTION',
};

class DatasetCreation extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
    connectionId: PropTypes.string.isRequired,
    onEntryClick: PropTypes.func.isRequired,
    installationType: PropTypes.string,
    cluster: PropTypes.string,
    onChangeCallback: PropTypes.func,
    modeId: PropTypes.oneOf([REPLACE_SOURCE_MODE_ID]),
  };

  static getDerivedStateFromProps(props, state) {
    const { dirPath } = state;
    const {
      connectionType,
      connectionId,
      connectionName,
      cluster,
      pathSelectInputError,
    } = props;

    if (pathSelectInputError) {
      return {
        pathSelectInputError,
      };
    }

    if (dirPath) {
      return {
        pathSelectInputError,
      };
    } else {
      return {
        dirPath: getSearchParam('currentPath') || Utils.getPersonalFolderPath(),
        pathSelectInputError,
        connectionType,
        connectionId,
        connectionName,
        cluster,
      };
    }
  }

  state = {
    connectionType: '',
    connectionName: '',
    counterSource: 'visits',
    metricaNamespace: 'installs',
    datasetTitle: '',
    dirPath: '',
    selectedDatabase: '',
    selectedTable: '',
    entityId: '',
    ytId: '',

    isLoadingDatabasesList: false,
    isLoadingDatabaseTablesList: false,
    pathSelectInputError: false,
    databases: [],
    databaseTables: [],
    error: {},
    ytIdErrorText: '',
    isChanged: false,
  };

  async componentDidMount() {
    console.log(' ');
    console.log('componentDidMount()');
    const { sdk, connectionId, connectionType } = this.props;

    // *****************
    const origin = JSON.parse(localStorage.getItem('origin'));
    this.setState(prevState => {
      console.log('CDM setState()');
      return {
        ...prevState,
        selectedTable: origin.table_name,
        selectedDatabase: origin.table_db_name,
      };
    });
    // this.setState({
    //   selectedTable: origin.table_name,
    //   selectedDatabase: origin.table_db_name,
    // });

    // *****************
    const isNeedDatabaseList =
      connectionId &&
      ['clickhouse', 'mysql', 'mssql', 'postgres', 'oracle'].includes(connectionType);
    const isYtConnection = connectionType === 'yt';

    if (isNeedDatabaseList) {
      try {
        this.setState({
          isLoadingDatabasesList: true,
        });

        const { items: databases } = await sdk.bi.getConnectionStructure({
          connectionId,
          infoType: 'dbs',
        });

        const sortedDatabases = databases.sort(Utils.sortStrings);

        this.setState(prevState => {
          console.log('CDM setState() 137');
          return {
            ...prevState,
            databases: sortedDatabases,
            // selectedDatabase: sortedDatabases[0],
            selectedDatabase: origin.table_db_name,
            isLoadingDatabasesList: false,
          };
        });

        // this.setState(
        //   {
        //     databases: sortedDatabases,
        //     // selectedDatabase: sortedDatabases[0],
        //     selectedDatabase: origin.table_db_name,
        //     isLoadingDatabasesList: false,
        //   },
        //   this.onChangeCallback,
        // );
      } catch (error) {
        const { response: { status: responseStatus } = {} } = error;

        this.setState(
          {
            error,
            isLoadingDatabasesList: false,
          },
          this.onChangeCallback,
        );

        const title = getErrorMessageHelper({
          type: 'database-list',
          status: responseStatus,
        });

        this.toaster.createToast({
          name: TOAST_NAME,
          title,
          type: 'error',
          allowAutoHiding: false,
        });
      }
    } else if (isYtConnection && !connectionId) {
      const { connections } = await sdk.bi.getConnections();

      const { id: connectionIdYt, ...ytConnection } =
        connections.find(({ type }) => type === 'yt') || {};

      this.setState(
        {
          connectionId: connectionIdYt,
          ...ytConnection,
        },
        this.onChangeCallback,
      );
    } else {
      this.onChangeCallback();
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const { sdk, connectionId, connectionType } = this.props;
    const { selectedDatabase, isChanged } = this.state;

    console.log(' ');
    console.log('componentDidUpdate()');
    console.log('componentDidUpdate isChanged = ', isChanged);

    const { selectedDatabase: selectedDatabasePrev } = prevState;
    console.log(
      'componentDidUpdate selectedDatabase, selectedDatabasePrev = ',
      selectedDatabase,
      ' ',
      selectedDatabasePrev,
    );
    console.log(
      'selectedDatabasePrev !== selectedDatabase',
      selectedDatabasePrev !== selectedDatabase,
    );

    // *****************
    const origin = JSON.parse(localStorage.getItem('origin'));
    // console.log('186 origin.table_db_name  = ', origin.table_db_name);
    // console.log('186 origin.table_name  = ', origin.table_name);
    // // table_db_name: 'public';
    // // table_name: 't_list_of_fk';
    // !isChanged &&
    //   this.setState({
    //     selectedTable: origin.table_name,
    //     selectedDatabase: origin.table_db_name,
    //     isChanged: true,
    //   });

    // *****************

    const isNeedDatabaseTableList =
      connectionId &&
      ['clickhouse', 'mysql', 'mssql', 'postgres', 'oracle'].includes(connectionType);

    if (selectedDatabasePrev !== selectedDatabase && isNeedDatabaseTableList) {
      console.log('Мы здесь!');
      try {
        this.setState({
          isLoadingDatabaseTablesList: true,
        });

        const { items: databaseTables } = await sdk.bi.getConnectionStructure({
          connectionId,
          infoType: 'tables',
          dbName: selectedDatabase,
        });

        const sortedDatabaseTables = databaseTables.sort(Utils.sortStrings);

        console.log('sortedDatabaseTables[0] = ', sortedDatabaseTables[0]);

        this.setState(
          {
            databaseTables: sortedDatabaseTables,
            // selectedTable: origin.table_name,
            selectedTable:
              isChanged && selectedDatabase !== origin.table_db_name
                ? sortedDatabaseTables[0]
                : origin.table_name,
            isLoadingDatabaseTablesList: false,
          },
          this.onChangeCallback,
        );
      } catch (error) {
        const { response: { status: responseStatus } = {} } = error;

        this.setState(
          {
            error,
            isLoadingDatabaseTablesList: false,
          },
          this.onChangeCallback,
        );

        const title = getErrorMessageHelper({
          type: 'database-list',
          status: responseStatus,
        });

        this.toaster.createToast({
          name: TOAST_NAME,
          title,
          type: 'error',
          allowAutoHiding: false,
        });
      }
    }
  }

  toaster = new Toaster();

  _databaseNameInpRef = React.createRef();

  isDisplaySection = ({ connectionType, section, isInternal }) => {
    const {
      // SECTION_CLICKHOUSE_YQL,
      SECTION_DATABASE_TABLE_SELECTION,
      SECTION_PATH_SELECTION,
      SECTION_SELECTION_DB_TABLES_HINTS,
      SECTION_WARNING_YT,
      SECTION_SELECTION_YT_ID,
      SECTION_COUNTER_SRC_SELECTION,
      SECTION_NAMESPACE_SELECTION,
    } = SECTIONS;
    let allowedSections = [];

    switch (connectionType) {
      case 'csv':
      case 'metrika_logs_api': {
        allowedSections = [SECTION_PATH_SELECTION];
        break;
      }
      case 'appmetrica_api': {
        allowedSections = [SECTION_PATH_SELECTION, SECTION_NAMESPACE_SELECTION];
        break;
      }
      case 'metrika_api': {
        allowedSections = [SECTION_PATH_SELECTION, SECTION_COUNTER_SRC_SELECTION];
        break;
      }
      case 'yt': {
        allowedSections = [
          SECTION_PATH_SELECTION,
          SECTION_SELECTION_YT_ID,
          SECTION_WARNING_YT,
        ];
        break;
      }
      case 'clickhouse': {
        allowedSections = [
          SECTION_PATH_SELECTION,
          SECTION_SELECTION_DB_TABLES_HINTS,
          SECTION_DATABASE_TABLE_SELECTION,
        ];

        if (isInternal) {
          // allowedSections.push(SECTION_CLICKHOUSE_YQL);
        }

        break;
      }
      case 'mssql':
      case 'mysql':
      case 'postgres':
      case 'oracle': {
        allowedSections = [
          SECTION_PATH_SELECTION,
          SECTION_SELECTION_DB_TABLES_HINTS,
          SECTION_DATABASE_TABLE_SELECTION,
        ];

        break;
      }
      case 'ch_over_yt': {
        allowedSections = [SECTION_PATH_SELECTION, SECTION_SELECTION_YT_ID];

        break;
      }
    }

    return allowedSections.includes(section);
  };

  changeValue = data => {
    this.setState(
      {
        ...data,
        isChanged: true,
      },
      this.onChangeCallback,
    );
  };

  onChangeCallback = () => {
    const { onChangeCallback } = this.props;

    if (onChangeCallback) {
      onChangeCallback(this.state);
    }
  };

  _setDatabaseNameInpInnerRef = el => {
    this._databaseNameInpRef = el;
  };

  setYtPathInputError = ytIdErrorText => {
    this.setState({
      ytIdErrorText,
    });
  };

  clearYtPathInputError = () => {
    this.setState({
      ytIdErrorText: '',
    });
  };

  getYtPath = ytIdRaw => {
    const { cluster } = this.state;

    this.clearYtPathInputError();

    if (ytIdRaw) {
      try {
        const url = new URL(ytIdRaw);
        const path = url.searchParams.get('path');

        if (!path) {
          const ytIdErrorText = 'Указан неправильный путь или URL к таблице';

          this.setYtPathInputError(ytIdErrorText);
        }

        if (!ytIdRaw.includes(`/${cluster}/`)) {
          const ytIdErrorText = `В подключении используется ${cluster} кластер`;

          this.setYtPathInputError(ytIdErrorText);
        }
      } catch (e) {}

      return ytIdRaw;
    }
  };

  changeYtId = ytIdRaw => {
    const ytId = this.getYtPath(ytIdRaw);

    this.setState(
      {
        ytId,
      },
      this.onChangeCallback,
    );
  };

  render() {
    const { sdk, installationType, modeId, connectionId, onEntryClick } = this.props;
    const {
      connectionType,
      connectionName,
      counterSource,
      metricaNamespace,
      dirPath,
      datasetTitle,
      selectedDatabase,
      selectedTable,
      entityId,
      ytId,
      databases,
      databaseTables,
      isLoadingDatabasesList,
      isLoadingDatabaseTablesList,
      pathSelectInputError,
      ytIdErrorText,
    } = this.state;

    const isInternal = installationType === 'internal';

    const isDisabledDatabaseSelection = !databases.length;
    const isDisabledDatabaseTableSelection = !databaseTables.length;

    const [isHiddenItem] = Array(2).fill([REPLACE_SOURCE_MODE_ID].includes(modeId));

    return (
      <div className={b()}>
        <div className={b('panel')}>
          <Icon
            className={b('connector-ic')}
            data={Utils.getConnectorIcon({ type: connectionType })}
            width="32"
          />
          <span className={b('label-connection-type')}>
            {getConnectorsMap()[connectionType]}
          </span>
          <span className={b('label-connection-name')}>{connectionName}</span>
          <SelectConnection
            sdk={sdk}
            connectionId={connectionId}
            onEntryClick={onEntryClick}
          />
        </div>
        <div className={b('fields')}>
          {!isHiddenItem &&
            this.isDisplaySection({
              connectionType,
              section: SECTIONS.SECTION_PATH_SELECTION,
            }) && (
              <div className="row">
                <PathSelect
                  inputRef={this._setDatabaseNameInpInnerRef}
                  inputError={
                    pathSelectInputError ? 'Поле обязательно для заполнения' : null
                  }
                  sdk={sdk}
                  defaultPath={dirPath}
                  withInput={true}
                  onChoosePath={dirPath => this.changeValue({ dirPath })}
                  inputValue={datasetTitle}
                  onChangeInput={datasetTitle => this.changeValue({ datasetTitle })}
                  placeholder="Имя набора данных"
                />
              </div>
            )}
          {this.isDisplaySection({
            connectionType,
            section: SECTIONS.SECTION_COUNTER_SRC_SELECTION,
          }) && (
            <div className={b('row')}>
              <div className={b('caption')}>
                <span>Источник счетчика</span>
              </div>
              <YCSelect
                cls={b('field-counter-source')}
                items={getStaticSelectItems(['visits', 'hits'])}
                value={counterSource}
                onChange={counterSource => this.changeValue({ counterSource })}
                showSearch={false}
              />
            </div>
          )}
          {this.isDisplaySection({
            connectionType,
            section: SECTIONS.SECTION_NAMESPACE_SELECTION,
          }) && (
            <div className={b('row')}>
              <div className={b('caption')}>
                <span>Группа метрик</span>
              </div>
              <YCSelect
                cls={b('field-counter-source')}
                items={getStaticSelectItems([
                  'installs',
                  'audience',
                  'client_events',
                  'push_events',
                  'audience_socdem',
                ])}
                value={metricaNamespace}
                onChange={metricaNamespace => this.changeValue({ metricaNamespace })}
                showSearch={false}
              />
            </div>
          )}
          {this.isDisplaySection({
            connectionType,
            section: SECTIONS.SECTION_SELECTION_DB_TABLES_HINTS,
            isInternal,
          }) && (
            <div className="row">
              <span className={b('caption')}>Выберите базу данных и таблицу:</span>
            </div>
          )}
          {this.isDisplaySection({
            connectionType,
            section: SECTIONS.SECTION_DATABASE_TABLE_SELECTION,
          }) && (
            <React.Fragment>
              <div className="row">
                <div className={b('caption')}>
                  <span>База данных</span>
                </div>
                <div className={b('field')}>
                  {console.log('537 selectedDatabase = ', selectedDatabase)}
                  <YCSelect
                    cls={b('field-databases')}
                    items={databases.map(dbName => {
                      return {
                        key: dbName,
                        value: dbName,
                        title: dbName,
                      };
                    })}
                    value={selectedDatabase}
                    // value={'public'}
                    // public
                    onChange={selectedDatabase => this.changeValue({ selectedDatabase })}
                    showSearch={false}
                    disabled={isDisabledDatabaseSelection}
                  />
                  {isLoadingDatabasesList && (
                    <div className={b('loader-wrap')}>
                      <Loader size="s" className={b('loader')} />
                    </div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className={b('caption')}>
                  <span>Таблица</span>
                </div>
                <div className={b('field')}>
                  {console.log('566 selectedTable  = ', selectedTable)}
                  <YCSelect
                    cls={b('field-database-tables')}
                    items={databaseTables.map(tableName => {
                      return {
                        key: tableName,
                        value: tableName,
                        title: tableName,
                      };
                    })}
                    value={selectedTable}
                    onChange={selectedTable => this.changeValue({ selectedTable })}
                    showSearch={false}
                    disabled={isDisabledDatabaseTableSelection}
                  />
                  {isLoadingDatabaseTablesList && (
                    <div className={b('loader-wrap')}>
                      <Loader size="s" className={b('loader')} />
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          )}
          {!isHiddenItem &&
            this.isDisplaySection({
              connectionType,
              section: SECTIONS.SECTION_CLICKHOUSE_YQL,
              isInternal,
            }) && (
              <div className={b('row')}>
                <div className={b('caption')}>
                  <span>или введите YQL Public Link:</span>
                </div>
                <TextInput
                  cls={b('field-yql-id')}
                  theme="normal"
                  size="s"
                  view="default"
                  tone="default"
                  text={entityId}
                  onChange={entityId => this.changeValue({ entityId })}
                  hasClear
                />
              </div>
            )}
          {this.isDisplaySection({
            connectionType,
            section: SECTIONS.SECTION_SELECTION_YT_ID,
            isInternal,
          }) && (
            <div className={b('row')}>
              <div className={b('caption')}>
                <span>Путь к таблице в YT</span>
              </div>
              <TextInput
                cls={b('field-yt-id')}
                theme="normal"
                size="s"
                view="default"
                tone="default"
                text={ytId}
                onChange={this.changeYtId}
                error={ytIdErrorText}
                hasClear
              />
            </div>
          )}
          {this.isDisplaySection({
            connectionType,
            section: SECTIONS.SECTION_WARNING_YT,
            isInternal,
          }) && (
            <div className={b('warning-yt')}>
              <span>
                Указанная таблица будет загружена в ClickHouse, должна соответствовать
                требованиям:
              </span>
              <ol>
                <li>Быть схематизированной</li>
                <li>
                  Открыта на чтение роботу <UserName inline>@robot-clustrum</UserName>
                </li>
                <li>Размер (uncompressed size) таблицы не должен превышать 1ГБ</li>
              </ol>
              <span>
                В текущей реализации Статистика ходит за данными от имени{' '}
                <UserName inline>@robot-clustrum</UserName>. Создание подключений от имени
                других пользователей и роботов пока недоступно.
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DatasetCreation;
