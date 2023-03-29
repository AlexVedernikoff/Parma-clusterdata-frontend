import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import constants from '../../constants';
import locales from '../../locales';
import dateHelpers from '../../utils/date';

// import './index.scss';

const b = block(constants.cNameBody);
const USER_TIMEZONE_OFFSET = (new Date().getTimezoneOffset() / 60) * -1;

function getDateInfo(year, month) {
  const { normal, ext } = constants.monthCellsCount;

  // month + 1 и нулевой день дают последний день текущего месяца
  const date = new Date(year, month + 1, 0);
  const daysCount = date.getDate();

  date.setDate(1);

  // в объекте Date дни недели считаются с Воскресенья по Субботу, им соответствуют индексы 0 - 6
  // получаем день недели первого дня месяца в соответствии с WEEKDAYS_MAP
  const indexUTC = date.getDay();
  const firstWeekday = indexUTC ? indexUTC - 1 : 6;
  const isExtMonth = daysCount + firstWeekday > normal;
  // если первый день месяца начинается раньше чем с четверга, то имя месяца надо поднимать
  const isLiftedTitle = firstWeekday < 3;
  const cellsCount = isExtMonth ? ext : normal;

  return {
    date,
    daysCount,
    cellsCount,
    firstWeekday,
    isExtMonth,
    isLiftedTitle,
  };
}

function getMonthTitle(date, lang) {
  const month = date.getMonth();
  const name = locales[lang].month[constants.monthsMap[date.getMonth()]];
  // добавляем год каждому январю и декабрю
  const year = month === 0 || month === 11 ? date.getFullYear() : '';

  return `${name} ${year}`;
}

function getDaysNodes(opt) {
  const { year, month, cellsCount, daysCount, firstWeekday, minDate, maxDate } = opt;

  let curWeekday = 0;

  return Array.from({ length: cellsCount }, (it, i) => {
    const key = `${year}-${month}-${i + 1}`;
    const curDate = new Date(year, month, i + 1 - firstWeekday, USER_TIMEZONE_OFFSET);
    const isFilled = i >= firstWeekday && i < daysCount + firstWeekday;
    const content = isFilled ? i + 1 - firstWeekday : null;
    const mods = {
      // ячейки дней, в которых есть контент
      filled: isFilled,
      // выходные дни
      weekend: isFilled && curWeekday > 4,
      // если дата не входит в рейдж minDate - maxDate
      disabled: dateHelpers.isDateOutOfRange(curDate, minDate, maxDate),
      // дни слева, у которых отрываем margin-left
      'left-edge': curWeekday === 0,
      // дни, которым оставляем радиуса для правого ребра
      'right-edge': curWeekday === 6,
    };
    // дни, на которые при выделении не вешается ::before
    const firstDay = content === 1 ? 'first-day' : '';
    const lastDay =
      (isFilled && i === cellsCount - 1) || (isFilled && i + 1 >= daysCount + firstWeekday) ? 'last-day' : '';

    curWeekday += 1;

    if (curWeekday > 6) {
      curWeekday = 0;
    }

    return (
      <div key={key} className={`${b('month-day', mods)} ${firstDay} ${lastDay}`} data-day={content}>
        {content}
      </div>
    );
  });
}

export default function Fullmonth(props) {
  const { year, month, lang, minDate, maxDate } = props;
  const { date, daysCount, cellsCount, firstWeekday, isExtMonth, isLiftedTitle } = getDateInfo(year, month);

  const daysNodes = getDaysNodes({
    year,
    month,
    cellsCount,
    daysCount,
    firstWeekday,
    minDate,
    maxDate,
  });

  const firstMonthDay = new Date(year, month, 1);
  const isMonthTitleDisabled = dateHelpers.isDateOutOfRange(firstMonthDay, minDate, maxDate);

  return (
    <div
      className={`${b('month', { ext: isExtMonth, 'lifted-title': isLiftedTitle })}`}
      data-year={year}
      data-month={month}
    >
      <div className={b('month-title', { lifted: isLiftedTitle, disabled: isMonthTitleDisabled })}>
        {getMonthTitle(date, lang)}
      </div>

      {daysNodes}
    </div>
  );
}

Fullmonth.propTypes = {
  year: PropTypes.number,
  month: PropTypes.number,
  lang: PropTypes.string,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
};
