import {combineReducers} from 'redux';

import {dataset} from './dataset';
import {connections} from './connections';
import dash from './dash';
import {connectRouter} from "connected-react-router";

const rootReducer =history => combineReducers({
    connections,
    dataset,
    router: connectRouter(history),
    dash
});

export default rootReducer;