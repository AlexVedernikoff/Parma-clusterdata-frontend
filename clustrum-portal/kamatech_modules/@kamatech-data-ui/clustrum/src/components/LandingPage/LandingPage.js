import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import ErrorContent, {
  Types,
  TypesHeaderWithoutCloudFolderSelect,
} from '../ErrorContent/ErrorContent';
import Header from '../Header/Header';
import Utils from '../../utils';
import { Pointerfocus } from 'lego-on-react';

// import './LandingPage.scss';
// import '../../styles/common.scss';

const b = block('landing-page');

class LandingPage extends PureComponent {
  static defaultProps = {
    headerEnabled: true,
  };

  static propTypes = {
    headerEnabled: PropTypes.bool,
    logoText: PropTypes.string,
    errorType: PropTypes.oneOf(Object.values(Types)),
    title: PropTypes.string,
    description: PropTypes.string,
    entryId: PropTypes.string,
    action: PropTypes.shape({
      text: PropTypes.string,
      content: PropTypes.node,
      handler: PropTypes.func,
    }),
    sdk: PropTypes.object.isRequired,
  };

  get headerEnabled() {
    const { pageSettings: { headerEnabled = this.props.headerEnabled } = {} } = window.DL;

    return headerEnabled;
  }

  render() {
    const {
      installationType,
      requestId,
      pageSettings: {
        errorType = this.props.errorType,
        title = this.props.title,
        description = this.props.description,
        entryId = this.props.entryId,
      } = {},
      endpoints,
      menu = [],
      user,
      features: { logoText, toggleTheme } = {},
    } = window.DL;
    const userData = {
      ...user,
      yu: Utils.getCookie('parmauid'),
    };
    const withCloudFolderSelect = !TypesHeaderWithoutCloudFolderSelect.includes(
      errorType,
    );

    return (
      <div className={b()}>
        <Pointerfocus />
        {this.headerEnabled && (
          <Header
            installationType={installationType}
            endpoints={endpoints}
            userData={userData}
            menuData={menu}
            logoText={this.props.logoText || logoText}
            withCloudFolderSelect={withCloudFolderSelect}
            toggleTheme={toggleTheme}
          />
        )}
        <ErrorContent
          sdk={this.props.sdk}
          type={errorType}
          title={title}
          description={description}
          action={this.props.action}
          reqId={requestId}
          entryId={entryId}
        />
      </div>
    );
  }
}

export default LandingPage;
