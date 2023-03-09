import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { SDK } from '../modules/sdk';
import { dataset } from '../reducers/dataset';
import { visualization } from '../reducers/visualization';
import { preview } from '../reducers/preview';
import { widget } from '../reducers/widget';
import { settings } from '../reducers/settings';
import dash from '../store/reducers/dash';

export const history = createBrowserHistory();

const middlewares = [routerMiddleware(history), thunk.withExtraArgument({ sdk: SDK })];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger({ collapsed: true });
  middlewares.push(logger);
}

const getAllReducers = history =>
  combineReducers({ dataset, visualization, preview, widget, settings, dash, router: connectRouter(history) });

export const store = createStore(getAllReducers(history), composeWithDevTools(applyMiddleware(...middlewares)));
