import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

import dash from './dash';

const createRootReducer = history => combineReducers({
    dash,
    router: connectRouter(history)
});

export default createRootReducer;
