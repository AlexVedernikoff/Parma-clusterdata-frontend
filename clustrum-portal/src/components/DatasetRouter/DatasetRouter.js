import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import block from 'bem-cn-lite';
import PropTypes from 'prop-types';
import { Utils } from '@kamatech-data-ui/clustrum';
import { Pointerfocus } from 'lego-on-react';

import DatasetPage from '../../containers/DatasetPage/DatasetPage';
import DatasetCreationPage from '../../containers/DatasetCreationPage/DatasetCreationPage';
import { REPLACE_SOURCE_MODE_ID } from '../../constants';
import { PageContainer } from '@widgets/page-container';

const b = block('dataset-router');

class DatasetRouter extends PureComponent {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };

  render() {
    const { sdk } = this.props;
    const {
      installationType,
      endpoints,
      clouds,
      menu = [],
      features: { logoText, toggleTheme } = {},
      user = {},
    } = window.DL;
    const userData = {
      ...user,
      yu: Utils.getCookie('parmauid'),
    };

    return (
      <div className={b()}>
        <Pointerfocus />
        <Router>
          <Switch>
            <Route
              path={'/datasets/new'}
              render={props => (
                <PageContainer>
                  <DatasetCreationPage {...props} sdk={sdk} />
                </PageContainer>
              )}
            />
            <Route
              path={'/datasets/:datasetId/source'}
              render={props => {
                const { match: { params: { datasetId } = {} } = {} } = props;

                return (
                  <PageContainer>
                    <DatasetCreationPage
                      {...props}
                      modeId={REPLACE_SOURCE_MODE_ID}
                      datasetId={datasetId}
                      sdk={sdk}
                    />
                  </PageContainer>
                );
              }}
            />
            <Route
              path={'/datasets/:datasetId'}
              render={props => (
                <PageContainer>
                  <DatasetPage {...props} sdk={sdk} />
                </PageContainer>
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default DatasetRouter;
