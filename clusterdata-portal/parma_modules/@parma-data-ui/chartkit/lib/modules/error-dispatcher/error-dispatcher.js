const ERROR_TYPE = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',

    UNKNOWN_EXTENSION: 'UNKNOWN_EXTENSION',
    UNSUPPORTED_EXTENSION: 'UNSUPPORTED_EXTENSION',

    CONFIG_LOADING_ERROR: 'CONFIG_LOADING_ERROR',
    EXECUTION_ERROR: 'EXECUTION_ERROR',
    DATA_FETCHING_ERROR: 'DATA_FETCHING_ERROR',
    WIZARD_DATA_FETCHING_ERROR: 'wizard_data_fetching_error',

    NO_DATA: 'NO_DATA',
    TOO_MANY_LINES: 'TOO_MANY_LINES',

    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    RENDER_ERROR: 'RENDER_ERROR',

    INCLUDES_LOADING_ERROR: 'INCLUDES_LOADING_ERROR',

    EXCEEDED_DATA_LIMIT: 'EXCEEDED_DATA_LIMIT'
};

class CustomError extends Error {
    constructor({type, extra, error}) {
        super();

        this.customError = true; // instanceof CustomError не срабатывает
        this.type = type;
        this.extra = extra;
        this.error = error;
    }
}

class ErrorDispatcher {
    static isCustomError(error) { return Boolean(error.customError); }

    static wrap(error) { return ErrorDispatcher.isCustomError(error) ? error : new CustomError(error); }
}

export default ErrorDispatcher;

export {ERROR_TYPE};
