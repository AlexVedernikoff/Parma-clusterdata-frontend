import React from 'react';
import FullMonth from '../FullMonth';
import MonthContent from '../MonthContent';
import QuarterContent from '../QuarterContent';
import YearContent from '../YearContent';
import utils from '../../utils';


export default class ContentManager {
    constructor(initDate, minDate, maxDate, lang) {
        this._lang = lang;
        this._minDate = minDate;
        this._maxDate = maxDate;
        this._getInitialContent(initDate);
    }

    changeContentOnScroll(type, position) {
        const method = this._getMethodName(type);
        const date = this._getEdgeDate(type, position);
        const chunk = this[method](date, position);

        if (position === 'start') {
            this.content[type] =
                chunk.concat(this.content[type].slice(0, this.content[type].length - chunk.length));
        } else {
            this.content[type] = this.content[type].slice(chunk.length).concat(chunk);
        }
    }

    changeContent(date = new Date(), type) {
        const method = this._getMethodName(type === 'week' ? 'day' : type);
        this.content[type] = this[method](date, 'init');
    }

    setMinDate(date) {
        if (!date) {
            return;
        }

        this._minDate = date;
    }

    setMaxDate(date) {
        if (!date) {
            return;
        }

        this._maxDate = date;
    }

    _getInitialContent(date) {
        this.content = {
            day: this._getDayContent(date, 'init'),
            month: this._getMonthContent(date, 'init'),
            quarter: this._getQuarterContent(date, 'init'),
            year: this._getYearContent(date, 'init')
        };
    }

    _getEdgeDate(type, position) {
        const index = position === 'start' ? 0 : this.content[type].length - 1;
        const keyList = this.content[type][index].key.split('-');

        if (keyList.length > 1) {
            const [year, month] = [...keyList];
            return new Date(year, month);
        }

        return new Date(keyList[0], 0);
    }

    _getMethodName(type) {
        return `_get${utils.capitalize(type)}Content`;
    }

    _getDayContent(date, position) {
        const tmpDate = new Date(date);
        const monthCount = position === 'init' ? 12 : 3;

        const getMonthOffset = {
            init: date => date.getMonth() - 5,
            start: date => date.getMonth() - monthCount,
            end: date => date.getMonth() + 1
        };

        tmpDate.setMonth(getMonthOffset[position](tmpDate));

        let [year, month] = [tmpDate.getFullYear(), tmpDate.getMonth()];

        return Array.from({length: monthCount}, () => {
            if (month > 11) {
                month = 0;
                year += 1;
            }

            return (
                <FullMonth
                    key={`${year}-${month}`}
                    year={year}
                    month={month++}
                    lang={this._lang}
                    minDate={this._minDate}
                    maxDate={this._maxDate}
                />
            );
        });
    }

    _getMonthContent(date, position) {
        const year = date.getFullYear();

        const getRange = {
            init: () => [year - 2, year + 2],
            start: () => [year - 1, year - 1],
            end: () => [year + 1, year + 1]
        };

        const [start, end] = getRange[position]();

        return utils.range(start, end + 1).map(year => {
            return (
                <MonthContent
                    key={year}
                    year={year}
                    lang={this._lang}
                    minDate={this._minDate}
                    maxDate={this._maxDate}
                />
            );
        });
    }

    _getQuarterContent(date, position) {
        const year = date.getFullYear();

        const getRange = {
            init: () => [year - 2, year + 3],
            start: () => [year - 1, year - 1],
            end: () => [year + 1, year + 1]
        };

        const [start, end] = getRange[position]();

        return utils.range(start, end + 1).map(year => {
            return (
                <QuarterContent
                    key={year}
                    year={year}
                    type="quarter"
                    lang={this._lang}
                    minDate={this._minDate}
                    maxDate={this._maxDate}
                />
            );
        });
    }

    _getYearContent(date, position) {
        const year = date.getFullYear();

        const getRange = {
            init: () => [year - 5, year + 6],
            start: () => [year - 2, year - 1],
            end: () => [year + 1, year + 2]
        };

        const [start, end] = getRange[position]();

        return utils.range(start, end + 1).map(year => {
            return (
                <YearContent
                    key={year}
                    year={year}
                    type="year"
                    lang={this._lang}
                    minDate={this._minDate}
                    maxDate={this._maxDate}
                />
            );
        });
    }
}
