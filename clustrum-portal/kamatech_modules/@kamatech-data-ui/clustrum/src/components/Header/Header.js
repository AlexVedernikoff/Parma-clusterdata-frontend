import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Header } from '@kamatech-data-ui/common/src';

import { DL } from '../../constants/common';
import CloudFolderSelect from './CloudFolderSelect/CloudFolderSelect';
import withPreparedMenu from './withPreparedMenu';
import withToggleTheme from './withToggleTheme';
import withSuperuserSwitch from './withSuperuserSwitch';

// import './Header.scss';

const b = block('dl-header');

class HeaderClustrum extends React.Component {
  static propTypes = {
    logoText: PropTypes.string.isRequired,
    menuData: PropTypes.object.isRequired,
    endpoints: PropTypes.object.isRequired,
    menuIcons: PropTypes.object,
    toggleTheme: PropTypes.bool,
    actionsMenu: PropTypes.array,
    sdk: PropTypes.object,
    withCloudFolderSelect: PropTypes.bool,
  };

  static defaultProps = {
    withCloudFolderSelect: true,
  };

  renderCustomSection() {
    if (DL.IS_INTERNAL || !this.props.withCloudFolderSelect || !DL.hideHeader) {
      return null;
    }
    return (
      <div className={b('custom-section')}>
        {/*
                <CloudFolderSelect
                    sdk={this.props.sdk}
                />
                */}
      </div>
    );
  }

  render() {
    return <Header {...this.props}>{this.renderCustomSection()}</Header>;
  }
}

export default withToggleTheme(withSuperuserSwitch(withPreparedMenu(HeaderClustrum)));
