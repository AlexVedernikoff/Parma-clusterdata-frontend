import block from 'bem-cn-lite';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';

import { Wizard } from '@clustrum-lib';
import { Pointerfocus } from 'lego-on-react';

import { SDK } from '@kamatech-data-ui/clustrum';

import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';

import { exportWidget } from '../services/dashboard/export/export-widget';
import { PageContainer } from '@widgets/page-container';

const sdk = new SDK({
  endpoints: window.DL.endpoints,
  currentCloudFolderId: window.DL.currentCloudFolderId,
  currentCloudId: window.DL.currentCloudId,
});

const b = block('app');

class App extends Component {
  _handleExport(id, name, options) {
    exportWidget({ id, name }, undefined, options);
  }

  render() {
    return (
      <>
        <Pointerfocus />
        <Switch>
          <Route
            path={'/wizard/preview/:id'}
            component={props => (
              <Wizard {...props} onExport={this._handleExport} preview={true} sdk={sdk} />
            )}
          />
          <Route
            path={'/wizard'}
            component={props => (
              <PageContainer>
                <Wizard {...props} onExport={this._handleExport} sdk={sdk} />
              </PageContainer>
            )}
          />
        </Switch>
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({});
const mapDispatchToProps = {};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App);
