function deconstructDate(date) {
    return [date.getFullYear(), date.getMonth(), date.getDate()];
}

function getMonday(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setHours(0);
    date.setMinutes(0);
    return new Date(date.setDate(diff));
}

function getSunday(date) {
    const sunday = getMonday(date);
    sunday.setDate(sunday.getDate() + 6);

    return sunday;
}

function getQuarterFromMonth(date) {
    return Math.floor((date.getMonth() + 1) / 2);
}

function getQuarterMonthes(date) {
    const quarter = getQuarterFromMonth(date);
    const firstQuarterMonth = quarter * 3 - 3;
    const lastQuarterMonth = quarter * 3 - 1;

    return [firstQuarterMonth, lastQuarterMonth];
}

function getDayInterval(date, interval) {
    const [year, month, day] = [...deconstructDate(date)];
    return new Date(year, month, day + interval);
}

function getWeekInterval(date, interval) {
    const monday = getMonday(date);
    const sunday = getSunday(date);
    monday.setDate(monday.getDate() + interval * 7);
    sunday.setDate(sunday.getDate() + interval * 7);

    return [monday, sunday];
}

function getMonthInterval(date, interval) {
    const [year, month] = [...deconstructDate(date)];
    const firstMonthDay = new Date(year, month + interval, 1);
    const lastMonthDay = new Date(year, month + interval + 1, 0);

    return [firstMonthDay, lastMonthDay];
}

function getQuarterInterval(date, interval) {
    const year = date.getFullYear();
    const [firstQuarterMonth, lastQuarterMonth] = [...getQuarterMonthes(date)];
    const firstQuarterDate = new Date(year, firstQuarterMonth + interval * 3, 1);
    const lastQuarterDate = new Date(year, lastQuarterMonth + interval * 3 + 1, 0);

    return [firstQuarterDate, lastQuarterDate];
}

function getYearInterval(date, interval) {
    const year = date.getFullYear();
    const firstDate = new Date(year, 0 + interval * 12, 1);
    const lastDate = new Date(year, 12 + interval * 12, 0);

    return [firstDate, lastDate];
}

export default {
    getDayInterval,
    getWeekInterval,
    getMonthInterval,
    getQuarterInterval,
    getYearInterval
};
