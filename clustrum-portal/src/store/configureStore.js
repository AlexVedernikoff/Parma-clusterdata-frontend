import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer from './reducers';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export default function configureStore(services) {
  const middlewares = [thunk.withExtraArgument(services)];

  if (process.env.NODE_ENV !== 'production') {
    const logger = createLogger({ collapsed: true });

    middlewares.push(logger);
  }

  const store = createStore(rootReducer(history), composeWithDevTools(applyMiddleware(...middlewares)));

  return store;
}
