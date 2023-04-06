import iconMssql from '../icons/mssql.svg';
import iconOracle from '../icons/oracle.svg';
import iconMetrica from '../icons/metrica.svg';
import iconAppMetrica from '../icons/appmetrica.svg';
import iconChOverYt from '@kamatech-data-ui/clustrum/src/icons/choveryt.svg';
import iconClickHouse from '@kamatech-data-ui/clustrum/src/icons/clickhouse.svg';
import iconCsv from '@kamatech-data-ui/clustrum/src/icons/csv.svg';
import iconPostgres from '@kamatech-data-ui/clustrum/src/icons/postgres.svg';
import iconMysql from '@kamatech-data-ui/clustrum/src/icons/mysql.svg';
import iconYt from '@kamatech-data-ui/clustrum/src/icons/yt.svg';
import iconUndefined from '@kamatech-data-ui/clustrum/src/icons/undefined.svg';

export default class Utils {
  static sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];

  static createFromFields = {
    yt: 'YT_TABLE',
    ch_over_yt: 'CH_TABLE',
    clickhouse: 'CH_TABLE',
    postgres: 'PG_TABLE',
    mysql: 'MYSQL_TABLE',
    mssql: 'MSSQL_TABLE',
    oracle: 'ORACLE_TABLE',
    csv: 'CSV',
    metrika_api: 'METRIKA_API',
    metrika_logs_api: 'METRIKA_LOGS_API',
    appmetrica_api: 'APPMETRICA_API',
  };

  static sortObjectBy(sortParameter) {
    return (current, next) => {
      const currentValue = current[sortParameter];
      const nextValue = next[sortParameter];

      return currentValue.localeCompare(nextValue, undefined, { numeric: true });
    };
  }

  static sortStrings(current, next, opt = {}) {
    const { order = 'asc' } = opt;

    return order === 'asc'
      ? current.localeCompare(next, undefined, { numeric: true })
      : next.localeCompare(current, undefined, { numeric: true });
  }

  static filterFieldsBy({ by, fields }) {
    switch (by) {
      case 'hidden': {
        return fields.filter(({ hidden }) => !hidden);
      }
    }
  }

  static findFields({ fields, keyword }) {
    return fields.filter(field => {
      const { title = '' } = field;

      return title.toLowerCase().includes(keyword.toLowerCase());
    });
  }

  static getYqlId({ pubOperationPath }) {
    try {
      return new URL(pubOperationPath).pathname.split('/').pop();
    } catch (error) {
      return pubOperationPath;
    }
  }

  static getYtPath({ str }) {
    try {
      const params = new URL(str).searchParams;

      return params.get('path');
    } catch (error) {
      return str;
    }
  }

  static getDatasetCreationData({
    connectionId,
    connectionType,
    counterSource,
    metricaNamespace,
    entityId,
    ytId,
    datasetName,
    dirPath,
    selectedDatabase,
    selectedTable,
  }) {
    const data = {
      connectionId,
      name: datasetName,
      createFrom: this.createFromFields[connectionType],
      dirPath,
    };

    switch (connectionType) {
      case 'yt': {
        data.ytUrl = ytId;

        break;
      }
      case 'clickhouse':
      case 'postgres':
      case 'mysql':
      case 'oracle': {
        if (entityId) {
          data.pubOperationId = this.getYqlId({ pubOperationPath: entityId });
          data.createFrom = 'YQL_CH_OP';
        } else {
          data.dbName = selectedDatabase;
          data.tableName = selectedTable;
        }

        break;
      }
      case 'ch_over_yt': {
        data.tableName = this.getYtPath({ str: ytId });

        break;
      }

      case 'mssql': {
        data.dbName = selectedDatabase;
        data.tableName = selectedTable;

        break;
      }

      case 'metrika_api':
      case 'metrika_logs_api': {
        data.counterSource = counterSource;

        break;
      }

      case 'appmetrica_api': {
        data.metricaNamespace = metricaNamespace;

        break;
      }
    }

    return data;
  }

  static getConnectionCreationData({
    dirPath,
    dbType,
    dbName,
    dbConnectMethod,
    token,
    cluster,
    counter,
    counterSource,
    alias,
    host,
    name,
    password,
    username,
    port,
    materializationStartDate,
    matSchedConfig,
    maxPoolSize,
  }) {
    let aliasNext;

    if (alias) {
      aliasNext = /^[*]/.test(alias) ? alias : `*${alias}`;
    }

    const commonData = {
      name,
      dirPath,
      type: dbType,
    };
    const credentialData = {
      host,
      port,
      dbName,
      username,
      password,
      maxPoolSize,
    };

    switch (dbType) {
      case 'clickhouse': {
        return {
          ...commonData,
          host,
          port,
          username,
          password,
          maxPoolSize,
        };
      }
      case 'postgres':
      case 'mysql':
      case 'mssql': {
        return {
          ...commonData,
          ...credentialData,
        };
      }
      case 'oracle': {
        return {
          ...commonData,
          ...credentialData,
          dbConnectMethod,
        };
      }
      case 'ch_over_yt': {
        return {
          ...commonData,
          cluster,
          token,
          alias: aliasNext,
        };
      }
      case 'metrika_api':
      case 'appmetrica_api': {
        return {
          ...commonData,
          token,
          counter,
        };
      }
      case 'metrika_logs_api': {
        return {
          ...commonData,
          ...credentialData,
          token,
          counter,
          counterSource,
          materializationStartDate,
          matSchedConfig,
        };
      }
    }
  }

  static getNameByKey({ key = '' }) {
    const matchedValues = key.match(/\/([^/]*)$/);

    return matchedValues ? matchedValues[1] : key;
  }

  static getConnectorIcon({ type }) {
    switch (type) {
      case 'clickhouse':
        return iconClickHouse;
      case 'ch_over_yt':
        return iconChOverYt;
      case 'csv':
        return iconCsv;
      case 'postgres':
        return iconPostgres;
      case 'mysql':
        return iconMysql;
      case 'mssql':
        return iconMssql;
      case 'oracle':
        return iconOracle;
      case 'yt':
        return iconYt;
      case 'metrika_logs_api':
      case 'metrika_api':
      case 'metrica':
        return iconMetrica;
      case 'appmetrica_api':
        return iconAppMetrica;
      default:
        return {
          ...iconUndefined,
          viewBox: '0 0 56 56',
        };
    }
  }

  static getNormalizedError(error) {
    const {
      response: { data: { message: responseMessage } = {}, headers: { 'x-request-id': requestId } = {} } = {},
      message,
    } = error;

    return {
      message: responseMessage || message,
      requestId: requestId,
    };
  }

  static getPersonalFolderPath() {
    const {
      user: { login },
    } = window.DL;

    // Папка обяазетельно должна заканчиваться слэшем (без исключений)
    const rootPath = '/';
    const userPath = `users/${login}/`;

    return window.DL.user.login ? userPath : rootPath;
  }

  static bytesToSize(bytes) {
    if (bytes === 0) {
      return '0 Byte';
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${Math.round(bytes / Math.pow(1024, i))} ${this.sizes[i]}`;
  }

  static openCreationWidgetPage({ datasetId }) {
    const { endpoints: { wizard = '/wizard' } = {} } = window.DL;

    window.open(`${wizard}/?__datasetId=${datasetId}`, '_blank');
  }

  static sortResultSchemaAscending(rowCurrent, rowNext) {
    const { title: titleCurrent } = rowCurrent;
    const { title: titleNext } = rowNext;

    return titleCurrent.localeCompare(titleNext, undefined, { numeric: true });
  }

  static isEnabledFeature(featureName) {
    const { features = {} } = window.DL;

    return features[featureName];
  }

  static isInternal() {
    const { installationType } = window.DL;

    return installationType === 'internal';
  }
}
