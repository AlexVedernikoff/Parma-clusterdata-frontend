export function createActionTypes(prefix, type, additionals = []) {
    return {
        REQUEST: `${prefix}_${type}_REQUEST`,
        SUCCESS: `${prefix}_${type}_SUCCESS`,
        FAILURE: `${prefix}_${type}_FAILURE`,
        ...additionals.reduce((additionalActions, additionalAction) => {
            additionalActions[additionalAction] = `${prefix}_${type}_${additionalAction}`;

            return additionalActions;
        }, {})
    };
}
