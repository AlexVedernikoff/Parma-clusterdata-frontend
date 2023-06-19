const PATTERNS_MAP = {
  default: {
    day: /^(\d{2})([./-]\d{2})([./-][1-2]\d{3})(\s\d{2}(:\d{2})?(:\d{2})?)?/,
    month: /^(\d{2})([./-][1-2]\d{3})$/,
    year: /^[1-2]\d{3}$/,
  },
  // iso: {
  //     day: /^([1-2]\d{3})(\.\d{2})(\.\d{2})(\s\d{2}(:\d{2})?(:\d{2})?)?/,
  //     month: /^([1-2]\d{3})(\.\d{2})$/,
  //     year: /^([1-2]\d{3})$/
  // }
};

const DATES_SEPARATOR_PATTERN = /\s-\s/;
const ILLEGAL_MONTH_PATTERN = /00/;
const DEFAULT_SCALE = 'day';
const DEFAULT_FORMAT = 'default';
const MONTHS_MAX_COUNT = 12;
const HOURS_MAX_COUNT = 24;
const MINUTES_MAX_COUNT = 60;

function getYear(yearTmpl) {
  if (!yearTmpl) {
    return undefined;
  }

  return Number(yearTmpl);
}

function getMonth(monthTmpl) {
  if (!monthTmpl || monthTmpl.match(ILLEGAL_MONTH_PATTERN)) {
    return undefined;
  }

  const month = Number(monthTmpl);

  return month > MONTHS_MAX_COUNT ? undefined : month - 1;
}

function getDay(dayTmpl, month, year) {
  if (!dayTmpl) {
    return undefined;
  }
  const daysMaxCount = new Date(year, month + 1, 0).getDate();
  const day = Number(dayTmpl);

  return day > daysMaxCount || !day ? undefined : day;
}

function getHours(hoursTmpl) {
  if (!hoursTmpl) {
    return undefined;
  }

  const hours = Number(hoursTmpl);

  return hours > HOURS_MAX_COUNT - 1 ? undefined : hours;
}

function getMinutes(minutesTmpl) {
  if (!minutesTmpl) {
    return undefined;
  }

  const minutes = Number(minutesTmpl);

  return minutes > MINUTES_MAX_COUNT - 1 ? undefined : minutes;
}

function getTimeParams(...parseData) {
  const params = [];

  for (let i = 0; i < parseData.length; i++) {
    if (parseData[i] === undefined) {
      break;
    }

    params.push(parseData[i]);
  }

  return params;
}

function getDateFromTemplate(tmpl, scale, dateFormat) {
  let pattern, format, date, year, month, day, hour, min, sec;

  if (dateFormat) {
    format = dateFormat;
  } else {
    format = DEFAULT_FORMAT;
  }

  if (scale) {
    pattern = PATTERNS_MAP[format][scale];
  } else {
    pattern = PATTERNS_MAP[format][DEFAULT_SCALE];
  }

  const match = tmpl.match(pattern);

  if (match) {
    switch (scale) {
      case 'month':
        switch (dateFormat) {
          default:
            year = getYear(match[2] && match[2].slice(1));
            month = getMonth(match[1]);
            date = new Date(year, month);

            break;
        }

        break;
      case 'year':
        switch (dateFormat) {
          default:
            year = getYear(match[0]);
            date = new Date(year, 0);

            break;
        }

        break;
      case 'day':
      default:
        switch (dateFormat) {
          // case 'iso':
          //     year = getYear(match[1]);
          //     month = getMonth(match[2] && match[2].slice(1));
          //     day = getDay(match[3] && match[3].slice(1), month, year);
          //     hour = getHours(match[4] && match[4].slice(1, 3));
          //     min = getMinutes(match[5] && match[5].slice(1));
          //     sec = getMinutes(match[6] && match[6].slice(1));
          //
          //     date = new Date(year, month, day, ...getTimeParams(hour, min, sec));
          //
          //     break;
          default:
            year = getYear(match[3] && match[3].slice(1));
            month = getMonth(match[2] && match[2].slice(1));
            day = getDay(match[1], month, year);
            hour = getHours(match[4] && match[4].slice(1, 3));
            min = getMinutes(match[5] && match[5].slice(1));
            sec = getMinutes(match[6] && match[6].slice(1));

            date = new Date(year, month, day, ...getTimeParams(hour, min, sec));

            break;
        }

        break;
    }
  }

  return date === 'Invalid Date' ? undefined : date;
}

export default function getDatesFromSearchTemplate(searchTmpl, scale, dateFormat) {
  return searchTmpl
    .split(DATES_SEPARATOR_PATTERN)
    .map(tmpl => getDateFromTemplate(tmpl, scale, dateFormat));
}
