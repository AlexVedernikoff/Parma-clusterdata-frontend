const range = (start, end, step) => {
    const _end = end || start;
    const _start = end ? start : 0;
    const _step = step || 1;

    return Array.from(new Array((_end - _start) / _step), (it, i) => _start + (i * _step));
};

const capitalize = str => {
    return str.replace(/^\w/, chr => chr.toUpperCase());
};

// функция нужна только для того, чтобы определить Firefox или Safari
const checkBrowser = () => {
    const agent = navigator.userAgent;

    if (
        agent.indexOf('Firefox') !== -1 &&
        parseFloat(agent.substring(agent.indexOf('Firefox') + 8)) >= 3.6
    ) {
        return 'Firefox';
    } else if (
        agent.indexOf('Safari') !== -1 && agent.indexOf('Version') !== -1 &&
        parseFloat(agent.substring(agent.indexOf('Version') + 8).split(' ')[0]) >= 5
    ) {
        return 'Safari';
    }

    return 'Good Browser';
};

const findPatternInClassList = (classList, pattern) => {
    for (let i = 0; i < classList.length; i++) {
        if (pattern.test(classList[i])) {
            return true;
        }
    }

    return false;
};

export default {
    range,
    capitalize,
    checkBrowser,
    findPatternInClassList
};
