import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import block from 'bem-cn-lite';
import PropTypes from 'prop-types';
import { Header, Utils } from '@kamatech-data-ui/clustrum';
import { Pointerfocus } from 'lego-on-react';

import DatasetPage from '../../containers/DatasetPage/DatasetPage';
import DatasetCreationPage from '../../containers/DatasetCreationPage/DatasetCreationPage';
import { REPLACE_SOURCE_MODE_ID } from '../../constants';

// import './DatasetRouter.scss';

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
        <Header
          installationType={installationType}
          sdk={sdk}
          endpoints={endpoints}
          clouds={clouds}
          userData={userData}
          menuData={menu}
          logoText={logoText}
          toggleTheme={toggleTheme}
        />
        <Router>
          <Switch>
            <Route path={'/datasets/new'} render={props => <DatasetCreationPage {...props} sdk={sdk} />} />
            <Route
              path={'/datasets/:datasetId/source'}
              render={props => {
                const { match: { params: { datasetId } = {} } = {} } = props;

                return (
                  <DatasetCreationPage {...props} modeId={REPLACE_SOURCE_MODE_ID} datasetId={datasetId} sdk={sdk} />
                );
              }}
            />
            <Route path={'/datasets/:datasetId'} render={props => <DatasetPage {...props} sdk={sdk} />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default DatasetRouter;
