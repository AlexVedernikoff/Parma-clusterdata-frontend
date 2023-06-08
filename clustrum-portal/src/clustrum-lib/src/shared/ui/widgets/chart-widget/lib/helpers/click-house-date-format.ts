import moment from 'moment';

const DATE_TYPE = {
  date: 'date',
  datetime: 'datetime',
};

const DATE_FORMAT = {
  defaultDate: 'DD.MM.YYYY',
  defaultDatetime: 'DD.MM.YYYY HH:mm:ss',
  month: 'MMMM',
  clickhouseDate: 'YYYY-MM-DD',
  clickhouseDatetime: 'YYYY-MM-DD HH:mm:ss',
  clickhouseDatetimeMillis: 'YYYY-MM-DDTHH:mm:ss.sss',
  clickhouseDatetimeMillisUtc: 'YYYY-MM-DDTHH:mm:ss.sssZ',
};

const MONTHS_NAMES = {
  january: 'Январь',
  february: 'Февраль',
  march: 'Март',
  april: 'Апрель',
  may: 'Май',
  june: 'Июнь',
  july: 'Июль',
  august: 'Август',
  september: 'Сентябрь',
  october: 'Октябрь',
  november: 'Ноябрь',
  december: 'Декабрь',
};

export const clickHouseDateFormat = (originalDate: string, dateType: string): string => {
  function isNotValidDate(): boolean {
    return !moment(originalDate).isValid();
  }

  function isDefaultDatetime(): boolean {
    return moment(originalDate, DATE_FORMAT.defaultDatetime, true).isValid();
  }

  function isMonthYearFormat(local = 'ru'): boolean {
    return moment(originalDate, DATE_FORMAT.month, local).isValid();
  }

  function formattedDate(formatDate: string): string {
    return moment(originalDate).format(formatDate);
  }

  function monthTo(): string {
    const dateLow = originalDate.toLowerCase();

    let month: keyof typeof MONTHS_NAMES;
    for (month in MONTHS_NAMES) {
      if (dateLow.includes(month)) {
        return dateLow.replace(month, MONTHS_NAMES[month]);
      }

      if (dateLow.includes(MONTHS_NAMES[month].toLowerCase())) {
        return dateLow.replace(MONTHS_NAMES[month].toLowerCase(), month);
      }
    }

    return formattedDate(DATE_FORMAT.defaultDate);
  }

  function monthToEnglish(): string {
    if (!isMonthYearFormat('ru')) {
      return formattedDate(DATE_FORMAT.defaultDate);
    }

    return monthTo();
  }

  if (isNotValidDate()) {
    return originalDate;
  }

  switch (dateType.toLowerCase()) {
    case DATE_TYPE.date:
      return monthToEnglish();

    case DATE_TYPE.datetime:
      return isDefaultDatetime()
        ? formattedDate(DATE_FORMAT.clickhouseDatetimeMillisUtc)
        : originalDate;
  }

  return originalDate;
};
