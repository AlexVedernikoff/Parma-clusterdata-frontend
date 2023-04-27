import React from 'react';
import block from 'bem-cn-lite';

import Utils from '../../../../helpers/utils';
import { getAppMetricGroupName } from '../../../../constants';

// import './ConnectionSubInfo.scss';

const b = block('connection-sub-info');

function ConnectionSubInfo(props) {
  const {
    connection: { db_type: connectionType, meta: { content_length: contentLength } = {} } = {},
    origin: { table_name: connectionTableName, cluster, path } = {},
    tableDbName,
  } = props;
  let connectionSubInfo;

  switch (connectionType) {
    case 'yt':
      connectionSubInfo = (cluster && path && `${cluster} – ${path}`) || tableDbName;
      break;
    case 'csv':
      connectionSubInfo = contentLength && Utils.bytesToSize(contentLength);
      break;
    case 'appmetrica_api':
      connectionSubInfo = getAppMetricGroupName(tableDbName);
      break;
    default:
      connectionSubInfo = connectionTableName || tableDbName;
      break;
  }

  return <span className={b()}>{connectionSubInfo}</span>;
}

export default ConnectionSubInfo;
