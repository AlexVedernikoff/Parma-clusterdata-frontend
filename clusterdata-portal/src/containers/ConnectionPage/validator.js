import { FIELD_TYPES } from '../../constants';

const _getConnectorFields = (type, isCreateForm) => {
  let fields = [];

  switch (type) {
    case 'appmetrica_api':
    case 'metrika_api':
      fields = [FIELD_TYPES.NAME, FIELD_TYPES.COUNTER];

      if (isCreateForm) {
        fields.push(FIELD_TYPES.TOKEN);
      }

      break;
    case 'metrika_logs_api':
      fields = [
        FIELD_TYPES.NAME,
        FIELD_TYPES.COUNTER,
        FIELD_TYPES.COUNTER_SOURCE,
        FIELD_TYPES.HOST,
        FIELD_TYPES.PORT,
        FIELD_TYPES.DB_NAME,
        FIELD_TYPES.USERNAME,
      ];

      if (isCreateForm) {
        fields.push(FIELD_TYPES.TOKEN, FIELD_TYPES.PASSWORD);
      }

      break;
    case 'ch_over_yt':
      fields = [FIELD_TYPES.NAME, FIELD_TYPES.ALIAS];

      if (isCreateForm) {
        fields.push(FIELD_TYPES.TOKEN);
      }

      break;
    case 'csv':
      if (!isCreateForm) {
        fields = [FIELD_TYPES.NAME];
      }

      break;
    default:
      fields = [FIELD_TYPES.NAME, FIELD_TYPES.HOST, FIELD_TYPES.PORT, FIELD_TYPES.USERNAME];

      if (type !== 'clickhouse') {
        fields.push(FIELD_TYPES.DB_NAME);
      }

      if (isCreateForm) {
        fields.push(FIELD_TYPES.PASSWORD);
      }

      break;
  }

  return fields;
};

const getEmptyFields = (state = {}) => {
  const { id, connectionId, dbType } = state;
  const isCreateForm = dbType === 'csv' ? !connectionId : !id;
  const fields = _getConnectorFields(dbType, isCreateForm);

  return fields.filter(field => !state[field]);
};

export { getEmptyFields };
