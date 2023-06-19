import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import constants from '../../constants';
import locales from '../../locales';

// import './index.scss';

const b = block(constants.cNameBody);

function getDateInfo(year, month) {
  const { normal, ext } = constants.monthCellsCount;

  const date = new Date(year, month + 1, 0);
  const daysCount = date.getDate();

  date.setDate(1);

  const indexUTC = date.getDay();
  const firstWeekday = indexUTC ? indexUTC - 1 : 6;
  const isExtMonth = daysCount + firstWeekday > normal;
  const cellsCount = isExtMonth ? ext : normal;

  return {
    date,
    daysCount,
    cellsCount,
    firstWeekday,
    isExtMonth,
  };
}

function getMonthTitle(date, lang, type) {
  if (type === 'quarter') {
    // для кварталов возвращаем короткие названия месяцев
    return locales[lang].monthShort[constants.monthsMap[date.getMonth()]];
  }

  return locales[lang].month[constants.monthsMap[date.getMonth()]];
}

function getDaysNodes(opt) {
  const { year, month, size, cellsCount, daysCount, firstWeekday } = opt;

  let curWeekday = 0;

  return Array.from({ length: cellsCount }, (it, i) => {
    const key = `${year}-${month}-${i + 1}`;
    const isFilled = i >= firstWeekday && i < daysCount + firstWeekday;
    const content = isFilled ? i + 1 - firstWeekday : null;
    const mods = {
      filled: isFilled,
      weekend: isFilled && curWeekday > 4,
      'left-edge': curWeekday === 0,
      [size]: true,
    };

    curWeekday += 1;

    if (curWeekday > 6) {
      curWeekday = 0;
    }

    return (
      <div key={key} className={b('sketch-month-day', mods)}>
        {content}
      </div>
    );
  });
}

export default function SketchMonth(props) {
  const { year, month, lang, size, type, disabled } = props;
  const { date, daysCount, cellsCount, firstWeekday, isExtMonth } = getDateInfo(
    year,
    month,
  );

  const daysNodes = getDaysNodes({
    year,
    month,
    size,
    cellsCount,
    daysCount,
    firstWeekday,
  });

  const commonMods = {
    [size]: true,
    [type]: Boolean(type),
  };

  const wrapMods = {
    ...commonMods,
    disabled: disabled,
    ext: !isExtMonth,
  };

  return (
    <div className={b('sketch-month-wrap', wrapMods)} data-year={year} data-month={month}>
      <div className={b('sketch-month-title', commonMods)}>
        {getMonthTitle(date, lang, type)}
      </div>
      <div className={b('sketch-month', { ext: isExtMonth, [size]: true })}>
        {daysNodes}
      </div>
    </div>
  );
}

SketchMonth.propTypes = {
  year: PropTypes.number,
  month: PropTypes.number,
  lang: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};
