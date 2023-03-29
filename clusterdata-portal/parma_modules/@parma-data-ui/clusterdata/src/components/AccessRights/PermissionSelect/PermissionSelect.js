import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Utils from '../../../utils';
import { Select } from 'lego-on-react';
import { PERMISSION, DL } from '../../../constants/common';

// import './PermissionSelect.scss';

const b = block('dl-permission-select');

const executeScopes = ['connection', 'dataset'];
const items = [
  { val: PERMISSION.READ, text: Utils.getTextByPermission(PERMISSION.READ) },
  { val: PERMISSION.WRITE, text: Utils.getTextByPermission(PERMISSION.WRITE) },
  { val: PERMISSION.ADMIN, text: Utils.getTextByPermission(PERMISSION.ADMIN) },
  { val: PERMISSION.EXECUTE, text: Utils.getTextByPermission(PERMISSION.EXECUTE) },
];

// TODO: после всех тестов на роль Execute убрать лишнии условия
const excludedItems = items.filter(({ val }) => val !== PERMISSION.EXECUTE);

const getItemsExternal = scope => {
  return executeScopes.includes(scope) ? items : excludedItems;
};

const getItemsInternal = scope => {
  if (!window.DL.appEnv) {
    return excludedItems;
  }
  if (window.DL.appEnv === 'production') {
    return scope === 'connection' ? items : excludedItems;
  }
  return executeScopes.includes(scope) ? items : excludedItems;
};

const getItems = scope => {
  return DL.IS_INTERNAL ? getItemsInternal(scope) : getItemsExternal(scope);
};

const PermissionSelect = ({ val, onChange, disabled, className, scope }) => (
  <Select
    cls={b(false, className)}
    theme="pseudo"
    view="default"
    tone="default"
    disabled={disabled}
    size="s"
    type="radio"
    val={val}
    items={getItems(scope)}
    onChange={([newPermission]) => onChange(newPermission)}
  />
);

PermissionSelect.propTypes = {
  val: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  scope: PropTypes.string,
};

export default PermissionSelect;
