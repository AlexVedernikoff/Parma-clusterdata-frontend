import block from 'bem-cn-lite';
import constants from '../../constants';


const b = block(constants.cNameBody);
const MAIN_CL = b('month-day_filled');
const LEFT_CL = b('month-day_left-edge');
const RIGHT_CL = b('month-day_right-edge');
const CLS = {
    day: {
        find: 'month-day_filled',
        stop: 'content-inner'
    },
    week: {
        find: 'month-day_filled',
        stop: 'content-inner'
    },
    month: {
        find: 'sketch-month-wrap',
        stop: 'chunk-month'
    },
    quarter: {
        find: 'chunk-quarter-item',
        stop: 'chunk-quarter'
    },
    year: {
        find: 'chunk-year',
        stop: 'content-inner'
    }
};

function isISOStringValid(str) {
    const date = new Date(Date.parse(str));
    return date.toString() !== 'Invalid Date';
}

// получаем ноду с датой нужного типа по клику на родительский элемент
function getItemNode(node, type) {
    if (!node) {
        return undefined;
    }

    let currentNode = node;

    while (!currentNode.classList.contains(b(`${CLS[type].stop}`))) {
        if (currentNode.classList.contains(b(`${CLS[type].find}`))) {
            return currentNode;
        }

        currentNode = currentNode.parentElement;
    }

    return undefined;
}

// получаем начальную дату в рейндже
function getStartDate(range) {
    if (!range.length || (!range[0] && !range[1])) {
        return undefined;
    }

    if (range[0] && !range[1]) {
        return range[0];
    }

    if (!range[0] && range[1]) {
        return range[1];
    }

    return range[0].getTime() <= range[1].getTime() ? range[0] : range[1];
}

// получаем конечную дату в рейндже
function getEndDate(range) {
    if (range.length <= 1 || (!range[0] || !range[1])) {
        return undefined;
    }

    return range[0].getTime() <= range[1].getTime() ? range[1] : range[0];
}

// получаем массив dom-элементов дней недели, которые нужно красить/ховерить
function getWeekDays(node) {
    if (!node) {
        return undefined;
    }

    const hoverList = [];

    let leftSib = node.previousSibling;
    let rightSib = node.nextSibling;

    if (!node.classList.contains(LEFT_CL)) {
        while (leftSib) {
            if (leftSib.classList.contains(MAIN_CL)) {
                hoverList.push(leftSib);
                if (leftSib.classList.contains(LEFT_CL)) {
                    break;
                }
            }

            const nextSib = leftSib.previousSibling;
            if (nextSib && nextSib.classList.contains(LEFT_CL) && nextSib.classList.contains(MAIN_CL)) {
                hoverList.push(nextSib);
                break;
            }

            if (!nextSib || !nextSib.classList.contains(MAIN_CL)) {
                leftSib = leftSib
                    .parentNode
                    .previousSibling
                    .querySelector('.last-day');

                continue;
            }

            leftSib = nextSib;
        }
    }

    if (!node.classList.contains(RIGHT_CL)) {
        while (rightSib) {
            if (rightSib.classList.contains(MAIN_CL)) {
                hoverList.push(rightSib);
                if (rightSib.classList.contains(RIGHT_CL)) {
                    break;
                }
            }

            const nextSib = rightSib.nextSibling;

            if (nextSib && nextSib.classList.contains(RIGHT_CL) && nextSib.classList.contains(MAIN_CL)) {
                hoverList.push(nextSib);
                break;
            }

            if (!nextSib || !nextSib.classList.contains(MAIN_CL)) {
                rightSib = rightSib
                    .parentNode
                    .nextSibling
                    .querySelector('.first-day');

                continue;
            }

            rightSib = nextSib;
        }
    }

    return hoverList.concat(node);
}

// получаем объект Date по dom-элементу
function getDateFromNode(node, type) {
    let year, month, day;

    switch (type) {
        case 'day':
        case 'week':
            year = node.parentNode.dataset.year;
            month = node.parentNode.dataset.month;
            day = node.dataset.day;
            return new Date(year, month, day, 0, 0, 0);

        case 'month':
            year = node.dataset.year;
            month = node.dataset.month;
            return new Date(year, month, 1, 0, 0, 0);

        case 'quarter':
            year = node.parentNode.dataset.year;
            month = Number(node.dataset.quarter) * 3 - 1;
            return new Date(year, month, 1, 0, 0, 0);

        case 'year':
            year = node.dataset.year;
            return new Date(year, 0, 1, 0, 0, 0);

        default:
            return undefined;
    }
}

function getDatesRangeFromNode(node, type) {
    let fromDate, toDate, fromNode, toNode, fromMonth, toMonth, nodes, year, month;

    switch (type) {
        case 'week':
            nodes = getWeekDays(node);
            fromNode = nodes.find(node => node.classList.contains(LEFT_CL));
            toNode = nodes.find(node => node.classList.contains(RIGHT_CL));
            fromDate = getDateFromNode(fromNode, type);
            toDate = getDateFromNode(toNode, type);
            break;

        case 'month':
            year = node.dataset.year;
            month = node.dataset.month;
            fromDate = new Date(year, month, 1, 0, 0, 0);
            toDate = new Date(year, Number(month) + 1, 0, 0, 0, 0);
            break;

        case 'quarter':
            fromMonth = Number(node.dataset.quarter) * 3 - 3;
            toMonth = Number(node.dataset.quarter) * 3 - 1;
            year = node.parentNode.dataset.year;
            fromDate = new Date(year, fromMonth, 1, 0, 0, 0);
            toDate = new Date(year, toMonth + 1, 0, 0, 0, 0);
            break;

        case 'year':
            year = node.dataset.year;
            fromDate = new Date(year, 0, 1, 0, 0, 0);
            toDate = new Date(year, 12, 0, 0, 0, 0);
            break;

        default:
            return undefined;
    }

    return [fromDate, toDate];
}

function isDateOutOfRange(curDate, minDate, maxDate) {
    const curDateTime = curDate.getTime();

    if (!minDate && !maxDate) {
        return false;
    }

    if (minDate && !maxDate) {
        return curDateTime < minDate.getTime();
    }

    if (!minDate && maxDate) {
        return curDateTime > maxDate.getTime();
    }

    return (curDateTime < minDate.getTime()) || (curDateTime > maxDate.getTime());
}

export default {
    isISOStringValid,
    getItemNode,
    getStartDate,
    getEndDate,
    getWeekDays,
    getDateFromNode,
    getDatesRangeFromNode,
    isDateOutOfRange
};
