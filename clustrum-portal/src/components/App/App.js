import React from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Pointerfocus } from 'lego-on-react';

import Index from '../Index/Index';
import Dash from '../../containers/Dash/Dash';
import { PREFIX } from '../../modules/constants/constants';
import { PageContainer } from '@widgets/page-container';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Pointerfocus />
      <Switch>
        <Route path="/:root(dashboards)" exact={true} component={Index} />
        <Route
          path="/:root(datasets|widgets|favorites|navigation|connections)/:path*"
          component={Index}
        />
        <Route
          path={`${PREFIX}/:id`}
          render={() => (
            <PageContainer withoutReactRoute>
              <Dash />
            </PageContainer>
          )}
        />
        <Route path={`${PREFIX}/`} component={Index} />
      </Switch>
    </DndProvider>
  );
}

export default hot(module)(App);
