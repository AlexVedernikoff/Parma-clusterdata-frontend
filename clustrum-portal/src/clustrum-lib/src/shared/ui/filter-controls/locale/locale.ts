import { Locale } from 'antd/es/locale';
import enUS from 'antd/locale/en_US';
import ruRU from 'antd/locale/ru_RU';
import 'dayjs/locale/ru';

export type LangType = 'ru' | 'en';

export const antdLocales: Record<LangType, Locale> = {
  en: enUS,
  ru: ruRU,
};

export const locales: Record<LangType, { [key: string]: string }> = {
  en: {
    noDateError: 'Specify date',
    invalidDatesRangeError: 'Specify both dates in the range',
  },
  ru: {
    noDateError: 'Укажите дату',
    invalidDatesRangeError: 'Укажите обе даты диапазона',
  },
};
