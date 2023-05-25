import { LAYOUT_ID } from '../constants/constants';
import React from 'react';

export function getUniqueId(prefix = 'id') {
  return `${prefix}-${Date.now()}`;
}

import { FontSizeOutlined } from '@ant-design/icons';
import iconCastBoolean from 'icons/cast-boolean.svg';
import iconCastDate from 'icons/cast-date.svg';
import iconCastGeo from 'icons/cast-geo.svg';
import iconCastNumber from 'icons/cast-number.svg';
import iconCastString from 'icons/cast-string.svg';

export function getIconForCast(cast) {
  switch (cast) {
    case 'integer':
    case 'uinteger':
    case 'float':
    case 'double':
    case 'long':
      return iconCastNumber;

    case 'datetime':
    case 'date':
      return iconCastDate;

    case 'geo':
      return iconCastGeo;

    case 'boolean':
      return iconCastBoolean;

    case 'string':
    default:
      return <FontSizeOutlined width="16" />;
  }
}

export function versionExtractor(key, value) {
  if (key === 'id') {
    return undefined;
  }

  if (key === 'dataset') {
    return {
      id: value.id,
      result_schema: value.result_schema
        ? value.result_schema.map(field => {
            return {
              guid: field.guid,
              title: field.title,
            };
          })
        : [],
    };
  }

  if (key === 'dimensions') {
    return undefined;
  }

  if (key === 'measures') {
    return undefined;
  }

  if (key === 'icon') {
    return undefined;
  }

  if (key === 'items') {
    return JSON.stringify(value.map(item => item.guid));
  }

  if (key === 'colors') {
    return JSON.stringify(value.map(item => item.guid));
  }

  return value;
}

export function getLayoutId(itemId, tab) {
  for (let id of Object.values(LAYOUT_ID)) {
    let layout = tab[id].find(l => l.i === itemId);

    if (layout !== undefined) {
      return id;
    }
  }
}
