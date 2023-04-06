import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
// import './Logo.scss';

import monoWidgetLogoIcon from '../../../../../clustrum/src/icons/mono-widget-logo.svg';
import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';

const b = block('yc-header');

const Logo = props => (
  <div className={b('logo')}>
    <a href={props.logoHref} className={b('logo-link')}>
      <div className={b('logo-wrapper')}>
        {Boolean(props.logoIcon) && <span className={b('logo-icon')}>{props.logoIcon}</span>}
        {Boolean(props.logoText) && (
          <React.Fragment>
            <Icon className={b('icon-star-stroke')} data={monoWidgetLogoIcon} />
          </React.Fragment>
        )}
      </div>
    </a>
  </div>
);

Logo.propTypes = {
  logoIcon: PropTypes.node,
  logoText: PropTypes.string,
  logoHref: PropTypes.string,
};

Logo.defaultProps = {
  logoHref: '/',
};

export default Logo;
