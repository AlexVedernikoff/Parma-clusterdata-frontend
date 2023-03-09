import {
    FETCH_CONNECTIONS,
    FIND_CONNECTIONS
} from '../../actions/connections';
import Utils from '../../helpers/utils';


export function findConnections({searchText}) {
    return (dispatch) => {
        dispatch({
            type: FIND_CONNECTIONS,
            payload: {
                searchText
            }
        });
    };
}

export function fetchConnections() {
    return async (dispatch, getState, {sdk}) => {
        try {
            dispatch({
                type: FETCH_CONNECTIONS.REQUEST,
                payload: {}
            });

            const {connections} = await sdk.bi.getConnections();

            dispatch({
                type: FETCH_CONNECTIONS.SUCCESS,
                payload: {
                    connections
                }
            });
        } catch (error) {
            dispatch({
                type: FETCH_CONNECTIONS.FAILURE,
                payload: {
                    error
                }
            });
        }
    };
}


const initialState = {
    list: [],
    initialList: [],
    status: '',
    error: null
};

export function connections(state = initialState, action) {
    switch (action.type) {
        case FETCH_CONNECTIONS.REQUEST: {
            return {
                ...state,
                status: 'loading',
                error: null
            };
        }
        case FETCH_CONNECTIONS.SUCCESS: {
            const {connections} = action.payload;

            return {
                ...state,
                status: 'ok',
                list: [
                    ...connections
                ].sort(Utils.sortObjectBy('name')),
                initialList: [
                    ...connections
                ]
            };
        }
        case FETCH_CONNECTIONS.FAILURE: {
            const {error} = action.payload;

            return {
                ...state,
                status: 'error',
                error
            };
        }
        case FIND_CONNECTIONS: {
            const {
                payload: {
                    searchText
                } = {}
            } = action;
            const {initialList} = state;

            const SUB_STR_REG_EXP = new RegExp(`${searchText.toLowerCase()}`);

            const listFound = initialList.filter(connection => {
                const {name} = connection;

                return SUB_STR_REG_EXP.test(name.toLowerCase());
            });

            return {
                ...state,
                list: listFound
            };
        }
        default:
            return state;
    }
}


export const selectStatus = (state) => state.connections.status;
export const selectConnections = (state) => state.connections.list;
