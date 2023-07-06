import { LAYOUT_ID } from '../constants/constants';

export function getUniqueId(prefix = 'id') {
  return `${prefix}-${Date.now()}`;
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
