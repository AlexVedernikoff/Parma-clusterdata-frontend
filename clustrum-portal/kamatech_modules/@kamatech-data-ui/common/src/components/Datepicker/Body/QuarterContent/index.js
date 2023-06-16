import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import SketchMonth from '../SketchMonth';
import constants from '../../constants';
import dateHelpers from '../../utils/date';

// import './index.scss';

const b = block(constants.cNameBody);

function getContent(year, lang, type, minDate, maxDate) {
  let month = 0;
  return Array.from({ length: 4 }, (it, quarter) => {
    if (month > 11) {
      month = 0;
    }

    const quarterItem = Array.from({ length: 3 }, () => {
      return (
        <SketchMonth
          key={`${year}-${month}-quarter`}
          lang={lang}
          type={type}
          year={year}
          month={month++}
          size="s"
        />
      );
    });

    const startQuarterMonth = (quarter + 1) * 3 - 3;
    const startQuarterDate = new Date(year, startQuarterMonth, 1);
    const endQuarterMonth = (quarter + 1) * 3;
    const endQuarterDate = new Date(year, endQuarterMonth, 1);
    const isQuarterDisabled =
      dateHelpers.isDateOutOfRange(startQuarterDate, minDate, maxDate) ||
      dateHelpers.isDateOutOfRange(endQuarterDate, minDate, maxDate);

    return (
      <div
        key={`${year}-q${quarter + 1}`}
        className={b('chunk-quarter-item', { disabled: isQuarterDisabled })}
        data-quarter={quarter + 1}
      >
        <div className={b('chunk-quarter-item-title')}>{`Q${quarter + 1}`}</div>
        {quarterItem}
      </div>
    );
  });
}

export default function QuarterContent(props) {
  const { year, lang, type, minDate, maxDate } = props;

  const firstYearDay = new Date(year, 0, 1);
  const isQuarterTitleDisabled = dateHelpers.isDateOutOfRange(
    firstYearDay,
    minDate,
    maxDate,
  );

  return (
    <div className={b('chunk-quarter')} data-year={year}>
      <div className={b('chunk-quarter-title', { disabled: isQuarterTitleDisabled })}>
        {year}
      </div>
      {getContent(year, lang, type, minDate, maxDate)}
    </div>
  );
}

QuarterContent.propTypes = {
  year: PropTypes.number,
  lang: PropTypes.string,
  type: PropTypes.string,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
};
