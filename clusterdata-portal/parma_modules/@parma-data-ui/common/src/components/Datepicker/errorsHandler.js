import locales from './locales';

export default function getErrorMessage(props, range, scale) {
  const locale = props.locale || 'ru';

  if ((range[0] && range[1] && !scale) || (range[0] && scale)) {
    return '';
  }

  if (scale) {
    return locales[locale].errors.noDate;
  }

  return locales[locale].errors.invalidDatesCount;
}
