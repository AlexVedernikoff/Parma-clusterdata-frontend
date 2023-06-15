import React from 'react';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { Utils, Navigation } from '@kamatech-data-ui/clustrum';
import { DL } from '@kamatech-data-ui/clustrum/src/constants/common';

import { Pointerfocus } from 'lego-on-react';
import { PageContainer } from '@widgets/page-container';

const b = block('navigation-page');

class NavigationPage extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };

  static defaultProps = {
    headerEnabled: true,
  };

  render() {
    const {
      installationType,
      endpoints,
      clouds,
      menu = [],
      features: { logoText, toggleTheme } = {},
      user = {},
    } = window.DL;
    const { sdk } = this.props;

    const userData = {
      ...user,
      yu: Utils.getCookie('parmauid'),
    };

    const startFrom = DL.IS_INTERNAL ? undefined : 'navigation';

    return (
      <div className={b()}>
        <Pointerfocus />
        <div className={b('navigation')}>
          <Route
            path="/:root?/:path*"
            render={({ match, location, history }) => (
              <PageContainer>
                <Navigation
                  sdk={sdk}
                  match={match}
                  location={location}
                  history={history}
                  startFrom={startFrom}
                />
              </PageContainer>
            )}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({});
const mapDispatchToProps = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavigationPage));
