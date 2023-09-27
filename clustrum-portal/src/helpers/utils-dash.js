import { SDK } from '../modules/sdk';
import { ENTRY_ID_REGEXP } from '../modules/constants/constants';
import { $appSettingsStore } from '@shared/app-settings';

export const getPersonalFolderPath = () =>
  `Users/${$appSettingsStore.getState().user.login}/`;

export async function getEntryByIdOrKey(pathname) {
  const keyAlike = pathname.replace(
    /^(\/preview)?((\/wizard\/)|(\/editor\/)|(\/navigation\/))/g,
    '',
  );
  return ENTRY_ID_REGEXP.test(keyAlike)
    ? await SDK.getEntryMeta({ entryId: keyAlike })
    : await SDK.getEntryByKey({ key: keyAlike });
}

/**
 * выкидывает последний слеш и текст справа от этого слеша
 * если пусто, то возвращает просто слеш
 */
export function getNavigationPathFromKey(key) {
  return key.replace(/\/?[^/]*$/g, '') || '/';
}

// обернуть в массив одиночные значения
export function wrapToArray(value = '') {
  return Array.isArray(value) ? value : [value];
}

// достать значения из массивов в 1 элемент, иначе выполнить distinct/uniq + убрать пустые значения
export function unwrapFromArray(array) {
  if (Array.isArray(array)) {
    return array.length === 1 ? array[0] : [...new Set(array.filter(Boolean))];
  }
  return array;
}

export function getLang() {
  return $appSettingsStore.getState().user.lang;
}

export function getCSRFToken() {
  const csrfMetaTag = document.querySelector('meta[name=csrf-token]');
  return csrfMetaTag ? csrfMetaTag.content : null;
}
