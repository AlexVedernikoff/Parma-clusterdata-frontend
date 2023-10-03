import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';
import block from 'bem-cn-lite';
import PropTypes from 'prop-types';
import { Pointerfocus } from 'lego-on-react';
import { Utils } from '@kamatech-data-ui/clustrum';
import { Connectors } from '../Connectors/Connectors';
import ConnectionPage from '../../containers/ConnectionPage/ConnectionPage';
import { getConnectorType } from '../../containers/ConnectionPage/getConnectorType';
import { getConnectorsMap } from '../../constants';
import { PageContainer } from '@widgets/page-container';
import { $appSettingsStore } from '@shared/app-settings';

const b = block('connections-router');

class ConnectionsRouter extends PureComponent {
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
    } = $appSettingsStore.getState();
    const userData = {
      ...user,
      yu: Utils.getCookie('parmauid'),
    };

    return (
      <>
        <Pointerfocus />
        <Router>
          <Switch>
            <Route
              path={'/connections/new'}
              render={() => (
                <Route
                  exact
                  path={'/connections/new'}
                  render={props => {
                    const connectorType = getConnectorType(props.location.search);
                    if (!connectorType) {
                      return (
                        <PageContainer>
                          <Connectors {...props} sdk={sdk} />
                        </PageContainer>
                      );
                    }
                    if (Object.keys(getConnectorsMap()).includes(connectorType)) {
                      return (
                        <PageContainer>
                          <ConnectionPage {...props} sdk={sdk} />
                        </PageContainer>
                      );
                    }
                    return <Redirect to={'/connections/new'} />;
                  }}
                />
              )}
            />
            <Route
              path={'/connections/:connectionId'}
              render={props => {
                return (
                  <PageContainer>
                    <ConnectionPage {...props} sdk={sdk} />
                  </PageContainer>
                );
              }}
            />
          </Switch>
        </Router>
      </>
    );
  }
}

export default ConnectionsRouter;
