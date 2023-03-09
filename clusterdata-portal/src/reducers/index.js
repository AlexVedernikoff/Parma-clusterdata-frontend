import {combineReducers} from 'redux';

import {dataset} from './dataset';
import {visualization} from './visualization';
import {preview} from './preview';
import {widget} from './widget';
import {settings} from './settings';

const reducers = combineReducers({
    dataset, visualization, preview, widget, settings
});

export default reducers;
