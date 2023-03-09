import {
    REQUEST_DATASET,
    RECEIVE_DATASET,
    UPDATE_DATASET_FIELDS,
    RESET_DATASET
} from '../actions';

const initialState = {
    isLoading: false,
    dataset: {},
    dimensions: [],
    measures: [],
    updates: []
};

export function dataset(state = initialState, action) {
    switch (action.type) {
        case RESET_DATASET: {
            return initialState;
        }
        case REQUEST_DATASET: {
            return {
                ...state,
                isLoading: true
            };
        }
        case UPDATE_DATASET_FIELDS: {
            const {resultSchema, dimensions, measures, updates} = action;

            const {dataset} = state;

            dataset.result_schema = resultSchema;

            return {
                ...state,
                dataset: {...dataset},
                dimensions,
                measures,
                updates
            };
        }
        case RECEIVE_DATASET: {
            const {dataset, measures, dimensions, updates, error} = action;

            if (dataset && dataset.key) {
                const keyParts = dataset.key.split('/');
                dataset.realName = keyParts[keyParts.length - 1];
            }

            if (error) {
                return {
                    ...state,
                    error,
                    dataset: dataset || state.dataset,
                    updates: updates || [],
                    isLoaded: true,
                    isLoading: false
                };
            } else {
                return {
                    ...state,
                    dataset,
                    dimensions,
                    measures,
                    updates: updates || [],
                    error: null,
                    isLoaded: true,
                    isLoading: false
                };
            }
        }
        default:
            return state;
    }
}

export const selectDataset = (state) => state.dataset.dataset;
export const selectFields = (state) => {
    if (state.dataset.isLoaded && state.dataset.dimensions && state.dataset.measures) {
        return [...state.dataset.dimensions, ...state.dataset.measures];
    } else {
        return [];
    }
};
export const selectAceModeUrl = (state) => state.dataset.dataset ? state.dataset.dataset.ace_url : null;
export const selectDatasetError = (state) => state.dataset.error;
export const selectMeasures = (state) => state.dataset.measures;
export const selectDimensions = (state) => state.dataset.dimensions;
export const selectUpdates = (state) => state.dataset.updates;
export const selectIsDatasetLoading = (state) => state.dataset.isLoading;
export const selectIsDatasetLoaded = (state) => state.dataset.isLoaded;
