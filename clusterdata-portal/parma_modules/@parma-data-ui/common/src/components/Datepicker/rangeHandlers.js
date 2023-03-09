import dateHelpers from './utils/date';


const TIMESTAMP_PATTERN = /(\d\d):(\d\d):(\d\d)/;

function convertDateToString(date, timestampType, scale) {
    const year = date.getFullYear();
    let [month, day] = [date.getMonth(), date.getDate()];
    let timestamp = '';

    // месяцы в объекте Date начинаются с 0
    month += 1;

    if (month / 10 < 1) {
        month = `0${month}`;
    }

    if (day / 10 < 1) {
        day = `0${day}`;
    }

    if (timestampType) {
        const timeString = date.toTimeString();
        const match = timeString.match(TIMESTAMP_PATTERN);
        const [hours, min, sec] = [match[1], match[2], match[3]];

        timestamp = timestampType === 'sec' ? ` ${hours}:${min}:${sec}` : ` ${hours}:${min}`;
    }

    if (scale) {
        switch (scale) {
            case 'month':
                return `${month}.${year}`;
            case 'year':
                return `${year}`;
        }
    }

    return `${day}.${month}.${year}${timestamp}`;
}

function getRangeFromProps(props) {
    const {fromDate, toDate, date, scale} = props;
    const range = [];

    if (date && scale) {
        const isValid = dateHelpers.isISOStringValid(date);

        if (isValid) {
            range.push(new Date(date));
        } else {
            console.warn('date is invalid');
        }

        return range;
    }

    if (fromDate) {
        const isValid = dateHelpers.isISOStringValid(fromDate);

        if (isValid) {
            range.push(new Date(fromDate));
        } else {
            console.warn('fromDate is invalid');
        }
    }

    if (toDate) {
        const isValid = dateHelpers.isISOStringValid(toDate);

        if (isValid) {
            range.push(new Date(toDate));
        } else {
            console.warn('toDate is invalid');
        }
    }

    return range;
}

function getConvertingDateFromRange(props, range) {
    const {allowEmptyValue, allowTime, scale} = props;
    const emptyValueText = props.emptyValueText || 'No date';
    let timePrecision;

    if (allowTime) {
        timePrecision = props.timePrecision || 'min';
    }

    const dash = scale ? '' : ' - ';
    let value = '';

    if (range[0]) {
        value += `${convertDateToString(range[0], timePrecision, scale)}${dash}`;
    } else if (allowEmptyValue) {
        value += `${emptyValueText}${dash}`;
    }

    if (range[1] && !scale) {
        value += convertDateToString(range[1], timePrecision, scale);
    } else if (allowEmptyValue && !scale) {
        value += emptyValueText;
    }

    return value;
}

function getDateTime(date) {
    return date && date.getTime();
}

function getRangeDatesTime(range) {
    const time1 = getDateTime(range[0]);
    const time2 = getDateTime(range[1]);

    return [time1, time2];
}

function getRegularizeRange(range) {
    if (!range[1]) {
        return range;
    }

    let regularizedRange = Array.from(range);
    let [fromDate, toDate] = [...regularizedRange];

    if (fromDate.getTime() > toDate.getTime()) {
        [fromDate, toDate] = [toDate, fromDate];
        regularizedRange = [fromDate, toDate];
    }

    return regularizedRange;
}

function getTrimmedRegularizedRange(regularizedRange, minDate, maxDate) {
    if (!minDate && !maxDate) {
        return regularizedRange;
    }

    const trimmedRange = Array.from(regularizedRange);
    const minDateTime = getDateTime(minDate);
    const maxDateTime = getDateTime(maxDate);
    const [minRangeDateTime, maxRangeDateTime] = [...getRangeDatesTime(regularizedRange)];

    if (minDateTime && minRangeDateTime < minDateTime) {
        trimmedRange[0] = minDate;
    }

    if (minDateTime && minRangeDateTime > maxDateTime) {
        trimmedRange[0] = maxDate;
    }

    if (maxDateTime && maxRangeDateTime < minDateTime) {
        trimmedRange[1] = minDate;
    }

    if (maxDateTime && maxRangeDateTime > maxDateTime) {
        trimmedRange[1] = maxDate;
    }

    return trimmedRange;
}

function getResultRange(stateRange, currentRange) {
    const resultRange = Array.from(stateRange);

    const [stateTime1, stateTime2] = [...getRangeDatesTime(resultRange)];
    const [currentTime1, currentTime2] = [...getRangeDatesTime(currentRange)];

    if (currentTime1 && stateTime1 !== currentTime1) {
        resultRange[0] = currentRange[0];
    }

    if (currentTime2 && stateTime2 !== currentTime2) {
        resultRange[1] = currentRange[1];
    }

    if (currentRange.length === 1) {
        resultRange[1] = undefined;
    }

    return resultRange;
}

function isRangesEqual(stateRange, currentRange) {
    const [stateTime1, stateTime2] = [...getRangeDatesTime(stateRange)];
    const [currentTime1, currentTime2] = [...getRangeDatesTime(currentRange)];

    if (stateTime1 !== currentTime1 || stateTime2 !== currentTime2) {
        return false;
    }

    return true;
}

export default {
    getRangeFromProps,
    getConvertingDateFromRange,
    getRegularizeRange,
    getTrimmedRegularizedRange,
    getResultRange,
    isRangesEqual
};
