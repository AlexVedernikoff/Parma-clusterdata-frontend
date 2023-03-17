import { i18n } from '@parma-data-ui/clusterdata';

const getErrorMessageHelper = ({ type, status }) => {
  let errorMessage = '';

  switch (type) {
    case 'database-list': {
      if (status === 400) {
        errorMessage = i18n('dataset.dataset-creation.create', 'label_database-list-connection-error');
      } else if (status === 403) {
        errorMessage = i18n('dataset.dataset-creation.create', 'label_database-list-forbidden-error');
      } else {
        errorMessage = i18n('dataset.dataset-creation.create', 'label_database-list-general-error');
      }
      break;
    }
    case 'table-list': {
      if (status === 400) {
        errorMessage = i18n('dataset.dataset-creation.create', 'label_table-list-connection-error');
      } else if (status === 403) {
        errorMessage = i18n('dataset.dataset-creation.create', 'label_table-list-forbidden-error');
      } else {
        errorMessage = i18n('dataset.dataset-creation.create', 'label_table-list-general-error');
      }
      break;
    }
  }

  return errorMessage;
};

export default getErrorMessageHelper;
