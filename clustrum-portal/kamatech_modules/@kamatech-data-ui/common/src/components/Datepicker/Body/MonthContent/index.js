import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import SketchMonth from '../SketchMonth';
import constants from '../../constants';
import dateHelpers from '../../utils/date';

// import './index.scss';

const b = block(constants.cNameBody);

function getContent(year, lang, minDate, maxDate) {
  return Array.from({ length: 12 }, (it, month) => {
    const curDate = new Date(year, month, 1);
    const isMonthDisabled = dateHelpers.isDateOutOfRange(curDate, minDate, maxDate);

    return (
      <SketchMonth
        key={`${year}-${month}`}
        disabled={isMonthDisabled}
        lang={lang}
        year={year}
        month={month}
        size="m"
      />
    );
  });
}

export default function MonthContent(props) {
  const { year, lang, minDate, maxDate } = props;

  const firstYearDay = new Date(year, 0, 1);
  const isMonthTitleDisabled = dateHelpers.isDateOutOfRange(
    firstYearDay,
    minDate,
    maxDate,
  );

  return (
    <div className={b('chunk-month')} data-year={year}>
      <div className={b('chunk-month-title', { disabled: isMonthTitleDisabled })}>
        {year}
      </div>

      {getContent(year, lang, minDate, maxDate)}
    </div>
  );
}

MonthContent.propTypes = {
  year: PropTypes.number,
  lang: PropTypes.string,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
};
