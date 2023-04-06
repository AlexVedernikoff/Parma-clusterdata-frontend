import { I18n } from '@kamatech-data-ui/clusterdata';

const i18n = I18n.keyset('connections.form');

const getErrorMessage = (emptyFields, fieldType) => {
  return emptyFields.includes(fieldType) ? i18n('label_error-empty-field') : '';
};

const getCounterSelectItems = (counters = []) => {
  return counters.map(({ id, name, create_time: createTime }) => {
    return {
      key: id,
      value: String(id),
      title: name ? `${name} (${id})` : id,
      createTime,
    };
  });
};

export { getErrorMessage, getCounterSelectItems };
