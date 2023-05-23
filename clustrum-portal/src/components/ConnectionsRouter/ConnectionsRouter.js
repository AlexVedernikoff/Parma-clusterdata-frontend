import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';
import block from 'bem-cn-lite';
import PropTypes from 'prop-types';
import { Pointerfocus } from 'lego-on-react';
import { Utils } from '@kamatech-data-ui/clustrum';
import Connectors from '../Connectors/Connectors';
import ConnectionPage from '../../containers/ConnectionPage/ConnectionPage';
import { getConnectorsMap } from '../../constants';

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
              path={'/connections/new'}
              render={() => (
                <Switch>
                  <Route exact path={'/connections/new'} render={props => <Connectors {...props} sdk={sdk} />} />
                  <Route
                    path={'/connections/new/:connectorType'}
                    render={props => {
                      const { params: { connectorType } = {} } = props.match;

                      if (Object.keys(getConnectorsMap()).includes(connectorType)) {
                        return <ConnectionPage {...props} sdk={sdk} />;
                      }

                      return <Redirect to={'/connections/new'} />;
                    }}
                  />
                </Switch>
              )}
            />
            <Route
              path={'/connections/:connectionId'}
              render={props => {
                return <ConnectionPage {...props} sdk={sdk} />;
              }}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default ConnectionsRouter;
