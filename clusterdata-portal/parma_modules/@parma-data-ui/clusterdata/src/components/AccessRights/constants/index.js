import {I18n} from 'utils/i18n';
export const i18n = I18n.keyset('component.access-rights.view');

export const STATUS = {
    LOADING: 'loading',
    SUCCESS: 'success',
    FAIL: 'fail',
    NOT_FOUND: 'not_found'
};

export const TIMESTAMP_FORMAT = 'DD.MM.YYYY HH:mm';

export const PERMISSION_ACTION = {
    ACCEPT: 'accept',
    DENY: 'deny',
    DENY_ALL: 'denyAll',
    ACCEPT_ALL: 'acceptAll',
    SELECT_CHANGE: 'selectChange',
    EDIT: 'edit',
    DELETE: 'delete'
};
