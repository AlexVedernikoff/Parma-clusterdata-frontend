import moment from 'moment';

export const getNow = () => Number(new Date());

export const calculateNormalizedBounds = (props) => {

}

export const minute = 60 * 1000;
export const hour = minute * 60;
export const day = hour * 24;
export const week = day * 7;
export const month = day * 30;
export const year = day * 365;

export const humanizeInterval = (from, to) => {
    const duration = to - from;
    if (duration >= year) {
        const years = Math.floor(duration / year);
        const months = Math.floor(duration % year / month);
        return (months === 0 || years > 4) ? `${years}y` : `${years}y ${months}mo`;
    }
    if (duration >= month) {
        const months = Math.floor(duration / month);
        const days = Math.floor(duration % month / day);
        return (days === 0 || months > 4) ? `${months}mo` : `${months}mo ${days}d`;
    }
    if (duration >= week) {
        const weeks = Math.floor(duration / week);
        const days = Math.floor(duration % week / day);
        return (days === 0 || weeks > 3) ? `${weeks}w` : `${weeks}w ${days}d`;
    }
    if (duration >= day) {
        const days = Math.floor(duration / day);
        const hours = Math.floor(duration % day / hour);
        return (hours === 0 || days > 4) ? `${days}d` : `${days}d ${hours}h`;
    }
    if (duration >= hour) {
        const hours = Math.floor(duration / hour);
        const minutes = Math.floor(duration % hour / minute);
        return (minutes === 0 || hours > 6) ? `${hours}h` : `${hours}h ${minutes}m`;
    }
    const minutes = Math.round(duration / minute);
    return `${minutes}m`;
};

export const formatInterval = (from, to) => {
    const mFrom = moment(from);
    const mTo = moment(to);
    if (mTo.isSame(mFrom, 'd')) {
        return `${mFrom.format('YYYY-MM-DD  HH:mm')}  —  ${mTo.format('HH:mm')}`;
    } else {
        return `${mFrom.format('YYYY-MM-DD  HH:mm')}  —  ${mTo.format('YYYY-MM-DD  HH:mm')}`;
    }
};

export const formatTimeCanonical = (ts) => {
    return moment(ts).format('YYYY-MM-DD HH:mm');
};

export const getUTCFromCharts = (ts) => {
    const time = moment(ts);
    time.add(-time.utcOffset(), 'm');
    return time.valueOf();
};

export const getTimestampFromDate = (date) => {
    return moment(date).valueOf();
};


const minimalFromToDiff = 60000;
const nowRe = /^now(?:([+-]\d+)([a-zA-Z]))?(?:\/([a-zA-Z]))?$/;

const rangeMap = {
    'mo': 'M'
};

export const calculateBackTimestamp = (back, ts) => {
    const time = moment(ts);
    const backRe = /(\d+)([a-zA-Z]+)/g;
    while (true) { // eslint-disable-line no-constant-condition
        const match = backRe.exec(back);
        if (match) {
            const [str, amount, rawRange] = match; // eslint-disable-line no-unused-vars
            const range = rangeMap[rawRange] || rawRange;
            time.subtract(amount, range);
        } else {
            break;
        }
    }
    return time.valueOf();
};

export const calculateTimestamp = (ts) => {
    if (!isNaN(ts)) {
        return Number(ts);
    }
    const match = nowRe.exec(ts);
    if (match) {
        const [str, amount, range, roundRange] = match; // eslint-disable-line no-unused-vars
        const time = moment();
        if (amount) {
            time.add(amount, range);
        }
        if (roundRange) {
            time.startOf(roundRange);
        }
        return time.valueOf();
    } else {
        return null;
    }
};
