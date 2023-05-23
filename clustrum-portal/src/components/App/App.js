import React from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';

import { Pointerfocus } from 'lego-on-react';

import Index from '../Index/Index';
import Dash from '../../containers/Dash/Dash';

import { PREFIX } from '../../modules/constants/constants';

function App() {
  return (
    <div className="app">
      <Pointerfocus />
      <Switch>
        <Route path="/:root(dashboards)" exact={true} component={Index} />
        <Route path="/:root(datasets|widgets|favorites|navigation|connections)/:path*" component={Index} />
        <Route path={`${PREFIX}/:id`} component={Dash} />
        <Route path={`${PREFIX}/`} component={Index} />
      </Switch>
    </div>
  );
}

export default hot(module)(App);
