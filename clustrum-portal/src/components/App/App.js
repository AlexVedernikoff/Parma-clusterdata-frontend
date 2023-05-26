import React from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';

import { Pointerfocus } from 'lego-on-react';

import Index from '../Index/Index';
import Dash from '../../containers/Dash/Dash';

import { PREFIX } from '../../modules/constants/constants';
import { PageContainer } from '../../widgets/page-container/ui/page-container';

function App() {
  return (
    <>
      <Pointerfocus />
      <Switch>
        <Route path="/:root(dashboards)" exact={true} component={Index} />
        <Route path="/:root(datasets|widgets|favorites|navigation|connections)/:path*" component={Index} />
        <Route
          path={`${PREFIX}/:id`}
          render={() => (
            <PageContainer withoutReactRoute withoutSidePanel>
              <Dash />
            </PageContainer>
          )}
        />
        <Route path={`${PREFIX}/`} component={Index} />
      </Switch>
    </>
  );
}

export default hot(module)(App);
