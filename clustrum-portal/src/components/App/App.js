import React from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';

import { Pointerfocus } from 'lego-on-react';

import Header from '../Header/Header';
import Index from '../Index/Index';
import Dash from '../../containers/Dash/Dash';

import { PREFIX } from '../../modules/constants/constants';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// import './App.scss';

function App() {
  return (
    <div className="app">
      <DndProvider backend={HTML5Backend}>
        <Pointerfocus />
        <Header />
        <Switch>
          <Route path="/:root(dashboards)" exact={true} component={Index} />
          <Route path="/:root(datasets|widgets|favorites|navigation|connections)/:path*" component={Index} />
          <Route path={`${PREFIX}/:id`} component={Dash} />
          <Route path={`${PREFIX}/`} component={Index} />
        </Switch>
      </DndProvider>
    </div>
  );
}

export default hot(module)(App);
