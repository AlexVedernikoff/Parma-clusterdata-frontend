import block from 'bem-cn-lite';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';

import Wizard from '../containers/Wizard/Wizard';
import { Pointerfocus } from 'lego-on-react';

import { Utils, SDK, Header } from '@kamatech-data-ui/clusterdata';

import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';

// import '@kamatech-data-ui/common/src/styles/styles.scss';

// import './App.scss';

const sdk = new SDK({
  endpoints: window.DL.endpoints,
  currentCloudFolderId: window.DL.currentCloudFolderId,
  currentCloudId: window.DL.currentCloudId,
});

const b = block('app');

class App extends Component {
  renderHeader = () => {
    const {
      installationType,
      endpoints,
      clouds,
      user,
      features: { logoText, toggleTheme },
      menu,
    } = window.DL;

    user.yu = Utils.getCookie('parmauid');

    return (
      <Header
        installationType={installationType}
        sdk={sdk}
        endpoints={endpoints}
        clouds={clouds}
        userData={user}
        menuData={menu}
        toggleTheme={toggleTheme}
        logoText={logoText}
      />
    );
  };

  renderContent = () => {
    return (
      <Switch>
        <Route path={'/wizard/preview/:id'} component={props => <Wizard {...props} preview={true} sdk={sdk} />} />
        <Route path={'/wizard'} component={props => <Wizard {...props} sdk={sdk} />} />
      </Switch>
    );
  };

  render() {
    return (
      <div className={b()}>
        <Pointerfocus />
        <div className={b('header')}>{this.renderHeader()}</div>
        <div className={b('main')}>{this.renderContent()}</div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({});
const mapDispatchToProps = {};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App);
