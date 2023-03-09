import moment from 'moment';

const DATE_TYPE = {
    date: 'date',
    datetime: 'datetime'
}

const DATE_FORMAT = {
    defaultDate: 'DD.MM.YYYY',
    defaultDatetime: 'DD.MM.YYYY HH:mm:ss',

    month: 'MMMM',

    clickhouseDate: 'YYYY-MM-DD',
    clickhouseDatetime: 'YYYY-MM-DD HH:mm:ss',
    clickhouseDatetimeMillis: 'YYYY-MM-DDTHH:mm:ss.sss',
    clickhouseDatetimeMillisUtc: 'YYYY-MM-DDTHH:mm:ss.sssZ'
};

const MONTHS_NAMES = {
    january: 'Январь',
    february: 'Февраль',
    march: 'Март',
    april: 'Апрель',
    may: 'Май',
    june: 'Июнь',
    july: 'Июль',
    august: 'Август',
    september: 'Сентябрь',
    october: 'Октябрь',
    november: 'Ноябрь',
    december: 'Декабрь'
}

export default class DateFormat {
    constructor(originalDate, dateType) {
        this._originalDate = originalDate;
        this._dateType = dateType;
    }

    date() {
        if (this.isNotValidDate()) {
            return this._originalDate;
        }

        switch (this._dateType.toLowerCase()) {
            case DATE_TYPE.date:
                return this.isClickhouseDateFormat() ? this.formattedDate(DATE_FORMAT.defaultDate) : this.monthToRussian();

            case DATE_TYPE.datetime:
                return this.formattedDate(DATE_FORMAT.defaultDatetime);
        }
    }

    formattedDate(formatDate) {
        return moment(this._originalDate).format(formatDate);
    }

    clickHouseDate() {
        if (this.isNotValidDate()) {
            return this._originalDate;
        }

        switch (this._dateType.toLowerCase()) {
            case DATE_TYPE.date:
                return this.monthToEnglish();

            case DATE_TYPE.datetime:
                return this.isDefaultDatetime ? this.formattedDate(DATE_FORMAT.clickhouseDatetimeMillisUtc) : this._originalDate;
        }
    }

    monthToRussian() {
        if (!this.isMonthYearFormat('en')) {
            return this.formattedDate(DATE_FORMAT.defaultDate);
        }

        return this.monthTo();
    }

    monthToEnglish() {
        if (!this.isMonthYearFormat('ru')) {
            return this.formattedDate(DATE_FORMAT.defaultDate);
        }

        return this.monthTo();
    }

    /**
     * Заменяет месяц с ангийского на русский или наоборот.
     * Пример: "November 2021" --> "Ноябрь 2021"
     */
    monthTo() {
        const dateLow = this._originalDate.toLowerCase();

        for (let month in MONTHS_NAMES) {
            if (dateLow.includes(month)) {
                return dateLow.replace(month, MONTHS_NAMES[month]);
            }

            if (dateLow.includes(MONTHS_NAMES[month].toLowerCase())) {
                return dateLow.replace(MONTHS_NAMES[month].toLowerCase(), month);
            }
        }

        return this.formattedDate(DATE_FORMAT.defaultDate);
    }

    /**
     * Проверка на неправильность даты
     *
     * @see <a href="https://momentjs.com/docs/#/parsing/">Документация moment</a>
     */
    isNotValidDate() {
        return !moment(this._originalDate).isValid();
    }

    isClickhouseDateFormat() {
        return moment(this._originalDate, DATE_FORMAT.clickhouseDate, true).isValid();
    }

    isDefaultDatetime() {
        return moment(this._originalDate, DATE_FORMAT.defaultDatetime, true).isValid();
    }

    isMonthYearFormat(local = 'ru') {
        return moment(this._originalDate, DATE_FORMAT.month, local).isValid();
    }
}
