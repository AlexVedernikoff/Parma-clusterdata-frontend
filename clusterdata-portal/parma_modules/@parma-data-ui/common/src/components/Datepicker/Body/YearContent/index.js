import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import SketchMonth from '../SketchMonth';
import constants from '../../constants';
import dateHelpers from '../../utils/date';


// import './index.scss';

const b = block(constants.cNameBody);

function getContent(year, lang, type) {
    return Array.from({length: 12}, (it, i) => {
        return (
            <SketchMonth
                key={`${year}-${i}-year`}
                lang={lang}
                type={type}
                year={year}
                month={i}
                size="s"
            />
        );
    });
}

export default function YearContent(props) {
    const {year, lang, type, minDate, maxDate} = props;

    const firstYearDay = new Date(year, 0, 1);
    const lastYearDay = new Date(year, 12, 0);
    const isYearTitleDisabled = dateHelpers.isDateOutOfRange(firstYearDay, minDate, maxDate) ||
        dateHelpers.isDateOutOfRange(lastYearDay, minDate, maxDate);

    return (
        <div
            className={b('chunk-year', {disabled: isYearTitleDisabled})}
            data-year={year}
        >
            <div className={b('chunk-year-title')}>{year}</div>
            {getContent(year, lang, type)}
        </div>
    );
}

YearContent.propTypes = {
    year: PropTypes.number,
    lang: PropTypes.string,
    type: PropTypes.string,
    minDate: PropTypes.object,
    maxDate: PropTypes.object
};
