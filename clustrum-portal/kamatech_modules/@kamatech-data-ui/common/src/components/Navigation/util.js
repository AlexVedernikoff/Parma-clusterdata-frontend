export function getNameByIndex({ path, index }) {
  let name = '/';

  if (path && typeof path === 'string') {
    let pathSplit = path.split('/');
    pathSplit = pathSplit.filter(Boolean);

    if (pathSplit.length !== 0) {
      name = pathSplit.splice(index, 1)[0];
    }
  }

  return name;
}

export function getPathBefore({ path }) {
  let pathBefore = '/';

  if (path && typeof path === 'string') {
    let pathSplit = path.split('/');
    pathSplit = pathSplit.filter(nameStr => nameStr);
    pathSplit.splice(-1, 1);

    if (pathSplit.length !== 0) {
      pathBefore = pathSplit.join('/');
    }
  }

  return pathBefore === '/' ? '/' : pathBefore + '/';
}

export function getBeforeFolderName({ path }) {
  return getNameByIndex({
    path: getPathBefore({ path }),
    index: -1,
  });
}

export function normalizeDestination(destination = '') {
  // Отрываем крайние слэши, и добавляем один справа
  return destination.replace(/^\/+|\/+$/g, '') + '/';
}

import { NAVIGATION_ROOT_NAME } from './i18n/constants';

export function getPathDisplayName({ path }) {
  const name = getNameByIndex({ path, index: -1 });
  return name === '/' ? NAVIGATION_ROOT_NAME : name;
}
