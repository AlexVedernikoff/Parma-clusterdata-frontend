import { DL } from '@kamatech-data-ui/clustrum/src/constants/common';
import { ADMIN_PARTICIPANT, EXECUTE_PARTICIPANT } from '../../constants';
import Utils from '../../helpers/utils';

const _getUserItem = ({ participant = {}, permission = 'acl_view', freeze = false }) => {
  const { name } = participant;
  return {
    name,
    permission,
    subject: {
      ...participant,
    },
    freeze,
  };
};

const _getBodyForModifyPermissions = () => {
  return {
    diff: {
      added: EXECUTE_PARTICIPANT,
      removed: {},
    },
  };
};

const _getPermissionByParticipants = (participants = []) => {
  return participants.reduce((permissions, permissionItem) => {
    const { name: subject, permission } = permissionItem;

    return {
      ...permissions,
      [permission]: [
        ...(permissions[permission] || []),
        {
          comment: 'initial permission',
          subject,
        },
      ],
    };
  }, {});
};

const _getParticipants = async sdk => {
  const { user: { uid, login } = {} } = window.DL;
  const participants = [];

  if (DL.IS_INTERNAL && uid) {
    const userSubject = await sdk.suggest({ searchText: uid, limit: 1 });

    participants.push(
      _getUserItem({
        participant: userSubject[0],
        permission: 'acl_adm',
        freeze: true,
      }),
    );
  } else if (login) {
    const userSubject = await sdk.suggest({ searchText: login, limit: 1 });

    participants.push(
      _getUserItem({
        participant: userSubject[0],
        permission: 'acl_adm',
        freeze: true,
      }),
    );
  }

  return participants;
};

const _getInitialPermissions = async sdk => {
  if (DL.IS_INTERNAL) {
    const participants = await _getParticipants(sdk);

    return {
      ..._getPermissionByParticipants(participants),
      ...EXECUTE_PARTICIPANT,
    };
  }

  return {
    ...ADMIN_PARTICIPANT,
    ...EXECUTE_PARTICIPANT,
  };
};

const createConnection = async ({ sdk, permissionsMode, connectionState = {} }) => {
  const data = Utils.getConnectionCreationData(connectionState);
  let initialPermissions;

  if (permissionsMode === 'explicit') {
    initialPermissions = await _getInitialPermissions(sdk);
  }

  return sdk.bi.createConnection({
    ...data,
    initialPermissions,
  });
};

const modifyConnection = async ({ sdk, connectionState = {} }) => {
  const {
    id: connectionId,
    dbName,
    dbConnectMethod,
    token,
    cluster,
    counter,
    counterSource,
    name,
    port,
    host,
    username,
    password,
    alias,
    materializationStartDate,
    matSchedConfig,
    dbType,
    modifyFlag,
    maxPoolSize,
  } = connectionState;

  let aliasNext;

  if (alias) {
    aliasNext = /^[*]/.test(alias) ? alias : `*${alias}`;
  }

  return sdk.bi.updateConnection({
    connectionId,
    token,
    host,
    port,
    cluster,
    counter,
    counterSource,
    name,
    username,
    password,
    dbName,
    dbConnectMethod,
    materializationStartDate,
    matSchedConfig,
    alias: aliasNext,
    modifyFlag,
    type: dbType,
    maxPoolSize,
  });
};

const verifyConnection = async ({ sdk, permissionsMode, connectionState = {} }) => {
  const {
    id: connectionId,
    dbType,
    dbName,
    token,
    cluster,
    alias,
    host,
    name,
    password,
    username,
    port,
    counter,
    counterSource,
  } = connectionState;

  let aliasNext = alias;
  let initialPermissions;

  if (permissionsMode === 'explicit') {
    initialPermissions = await _getInitialPermissions(sdk);
  }

  if (aliasNext) {
    aliasNext = /^[*]/.test(alias) ? alias : `*${alias}`;
  }

  const dbNameNext = dbName ? dbName : undefined;

  if (connectionId) {
    await sdk.bi.verifyConnection({
      connectionId,
      type: dbType,
      name,
      dbName: dbNameNext,
      password,
      host,
      port,
      token,
      username,
      alias: aliasNext,
      cluster,
      counter,
      counterSource,
    });
  } else {
    await sdk.bi.verifyConnectionParams({
      password,
      username,
      host,
      type: dbType,
      port,
      cluster,
      alias: aliasNext,
      token,
      name,
      dbName: dbNameNext,
      initialPermissions,
      permissionsMode,
      counter,
      counterSource,
    });
  }
};

const uploadCsv = async ({ sdk, connectionState = {} }) => {
  const { user: { login } = {} } = window.DL;
  const { acceptedFile } = connectionState;
  const permissionsMode = 'explicit';
  let initialPermissions;

  if (DL.IS_INTERNAL) {
    const participants = await _getParticipants(sdk);
    initialPermissions = _getPermissionByParticipants(participants);
  } else {
    initialPermissions = ADMIN_PARTICIPANT;
  }

  const formData = new FormData();

  formData.append('file', acceptedFile);
  formData.append('type', 'csv');
  formData.append('preview', '1');
  formData.append('sample_size', '100');
  formData.append('permissions_mode', permissionsMode);
  formData.append('dir_path', window.DL.user.login ? `users/${login}` : '/');
  formData.append('initial_permissions', JSON.stringify(initialPermissions));

  const connection = await sdk.sendFileInConnectionUploader({ formData }, { passTimezoneOffset: false });

  const { data: { parsing_error: parsingError } = {} } = connection;

  if (parsingError) {
    throw new Error(parsingError);
  }

  return connection;
};

const saveCsv = async ({ sdk, permissionsMode, connectionState = {} }) => {
  const { connectionId, meta: { state } = {}, name, dirPath, delimiter, encoding, hasHeader } = connectionState;

  const isUnvalidated = state === 'unvalidated';

  const creationData = {
    connectionId,
    name,
    delimiter,
    encoding,
    hasHeader: hasHeader ? 1 : 0,
  };

  if (isUnvalidated) {
    creationData.dirPath = dirPath;
  }

  const connection = await sdk.bi.saveConnection(creationData);

  if (isUnvalidated && permissionsMode === 'explicit') {
    const body = _getBodyForModifyPermissions();
    await sdk.modifyPermissions({ entryId: connectionId, body });
  }

  return connection;
};

export { createConnection, modifyConnection, verifyConnection, uploadCsv, saveCsv };
