import settings from '../settings/settings';

import RU from './ru';
import EN from './en';

function i18n(outerKey) {
  return innerKey => {
    const translations = settings.lang.match(/^ru$/i) ? RU : EN;
    return translations[outerKey] && translations[outerKey][innerKey] !== undefined
      ? translations[outerKey][innerKey]
      : `${outerKey}:${innerKey}`;
  };
}

function i18nV2(keyset) {
  return function(key) {
    const lang = settings.lang;
    return keyset[lang] && keyset[lang][key] !== undefined ? keyset[lang][key] : `${lang}:${key}`;
  };
}

export default i18n;

export { i18nV2 };
