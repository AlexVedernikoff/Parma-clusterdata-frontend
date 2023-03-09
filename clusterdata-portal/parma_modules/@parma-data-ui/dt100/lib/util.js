import {ASCENDING, DESCENDING} from './constants';

export function getSortOrder(column, {sortOrder = {}, sortColumns = []}, multisort, settings = {}) {
    const defaultOrder = column.defaultOrder || settings.defaultOrder;
    const columnName = column.name;
    const emptyResult = {
        sortOrder: {},
        sortColumns: []
    };

    if (!columnName) {
        return multisort ? {sortOrder, sortColumns} : emptyResult;
    }

    let newColumns = sortColumns;
    const prevOrder = sortOrder[columnName];

    let order = defaultOrder;
    if (prevOrder === order) {
        order = order === ASCENDING ? DESCENDING : ASCENDING;
    } else if (prevOrder) {
        order = null;
    }

    if (!multisort) {
        return order ? {
            sortOrder: {[columnName]: order},
            sortColumns: [columnName]
        } : emptyResult;
    }

    const {[columnName]: _, ...newOrder} = sortOrder; // eslint-disable-line no-unused-vars

    if (order) {
        newOrder[columnName] = order;
        if (!new Set(sortColumns).has(columnName)) {
            newColumns = [...sortColumns, columnName];
        }
    } else {
        newColumns = sortColumns.filter(name => name !== columnName);
    }

    return {
        sortOrder: newOrder,
        sortColumns: newColumns
    };
}

function generateSortingFunction(column, order) {
    const compareValue = order;
    if (typeof column.sortAscending === 'function') {
        return (row1, row2) => {
            return compareValue * column.sortAscending(row1, row2);
        };
    }

    return (row1, row2) => {
        const value1 = column._getSortValue(row1.row);
        const value2 = column._getSortValue(row2.row);
        if (value1 < value2) { return -compareValue; }
        if (value1 > value2) { return compareValue; }
        /* eslint-disable no-eq-null, eqeqeq */
        // Comparison with null made here intentionally
        // to exclude multiple comparison with undefined and null
        if (value1 == null && value2 != null) { return 1; }
        if (value2 == null && value1 != null) { return -1; }
        /* eslint-enable no-eq-null, eqeqeq */
        return 0;
    };
}

export function getIndexedData(data) {
    return data.map((row, index) => ({row, index}));
}

export function getSortedData(data, dataColumns, {sortOrder, sortColumns}) {
    const sortFunctionDict = {};

    dataColumns.forEach(column => {
        if (sortOrder[column.name]) {
            sortFunctionDict[column.name] = generateSortingFunction(column, sortOrder[column.name]);
        }
    });

    const sortFunctions = sortColumns.map(name => sortFunctionDict[name]).filter(Boolean);
    const indexedData = data.map((row, index) => ({row, index}));

    if (sortFunctions.length) {
        indexedData.sort((row1, row2) => {
            let comparison = 0;
            sortFunctions.some(sort => {
                comparison = sort(row1, row2);
                return Boolean(comparison);
            });
            return comparison || (row1.index - row2.index);
        });
    }

    return indexedData;
}
